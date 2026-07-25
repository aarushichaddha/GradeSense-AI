"""
training_pipeline.py
====================
Orchestrates the full ML training workflow:

  1. Load (or generate) training dataset.
  2. Stratified train / validation / test split (70 / 15 / 15).
  3. Feature scaling with StandardScaler.
  4. Train three candidate models: Random Forest, XGBoost, LightGBM.
  5. 5-fold cross-validate each model on the training set.
  6. Select the best model by F1-macro on the held-out test set.
  7. Save all model artifacts + the selection manifest to ``backend/artifacts/``.

CLI usage
---------
    # From the ``backend/`` directory:
    python -m app.ai.training_pipeline

    # With custom sample count:
    python -m app.ai.training_pipeline --n-samples 10000 --data-path data/my_data.csv
"""
from __future__ import annotations

import argparse
import json
import logging
import os
import time
from pathlib import Path
from typing import Optional

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
import xgboost as xgb
import lightgbm as lgb

from app.ai.feature_engineering import FEATURE_COLUMNS
from app.ai.synthetic_data_generator import (
    LABEL_COLUMN,
    GradeTransitionDataGenerator,
)
from app.ai.validation_pipeline import ModelMetrics, ModelValidationPipeline

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Artifact directory (relative to backend/ working directory)
# ---------------------------------------------------------------------------
ARTIFACTS_DIR = Path(__file__).resolve().parents[3] / "artifacts"
DATA_DIR = Path(__file__).resolve().parents[3] / "data"
MANIFEST_PATH = ARTIFACTS_DIR / "model_manifest.json"


def _ensure_dirs() -> None:
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)


# ---------------------------------------------------------------------------
# Candidate model definitions
# ---------------------------------------------------------------------------
CANDIDATE_MODELS: dict[str, object] = {
    "RandomForest": RandomForestClassifier(
        n_estimators=300,
        max_depth=12,
        min_samples_leaf=5,
        class_weight="balanced",
        n_jobs=-1,
        random_state=42,
    ),
    "XGBoost": xgb.XGBClassifier(
        n_estimators=400,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        scale_pos_weight=2.5,   # handles class imbalance
        eval_metric="logloss",
        random_state=42,
        n_jobs=-1,
    ),
    "LightGBM": lgb.LGBMClassifier(
        n_estimators=500,
        num_leaves=63,
        learning_rate=0.04,
        subsample=0.8,
        colsample_bytree=0.8,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
        verbose=-1,
    ),
}


class ModelTrainingPipeline:
    """
    End-to-end training, validation, and artifact-persistence pipeline.

    Parameters
    ----------
    n_samples : int
        Number of synthetic training events (if no CSV provided).
    data_path : str | None
        Optional path to a real training CSV. Must contain all FEATURE_COLUMNS
        plus the ``off_spec`` binary label column.
    random_state : int
        Seed for reproducibility.
    """

    def __init__(
        self,
        n_samples: int = 5000,
        data_path: Optional[str] = None,
        random_state: int = 42,
    ):
        self.n_samples = n_samples
        self.data_path = data_path
        self.random_state = random_state
        self.validator = ModelValidationPipeline(cv_folds=5)
        _ensure_dirs()

    # ── Data loading ─────────────────────────────────────────────────────────

    def load_or_generate_dataset(self) -> pd.DataFrame:
        """
        Load training CSV if it exists, otherwise generate synthetic data.

        The CSV must have columns matching FEATURE_COLUMNS + ``off_spec``.
        """
        if self.data_path and Path(self.data_path).exists():
            logger.info(f"Loading training data from '{self.data_path}'")
            df = pd.read_csv(self.data_path)
            # Validate columns
            missing = set(FEATURE_COLUMNS + [LABEL_COLUMN]) - set(df.columns)
            if missing:
                raise ValueError(f"Training CSV is missing columns: {missing}")
            return df

        logger.info(
            f"No training CSV found — generating {self.n_samples} synthetic "
            "grade transition events using physics-based oracle."
        )
        gen = GradeTransitionDataGenerator(
            n_samples=self.n_samples, random_state=self.random_state
        )
        df = gen.generate(save_path=str(DATA_DIR / "synthetic_training_data.csv"))
        return df

    # ── Data splitting ────────────────────────────────────────────────────────

    def split_and_scale(
        self, df: pd.DataFrame
    ) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray, StandardScaler]:
        """
        Stratified 70 / 15 / 15 train-val-test split + StandardScaler fit on train.

        Returns
        -------
        X_train, X_val, X_test, y_train, y_val, y_test, scaler
        """
        X = df[FEATURE_COLUMNS].values.astype(np.float64)
        y = df[LABEL_COLUMN].values.astype(int)

        # 70 % train, 30 % temp
        X_train, X_temp, y_train, y_temp = train_test_split(
            X, y, test_size=0.30, stratify=y, random_state=self.random_state
        )
        # 15 % val, 15 % test from the 30 % temp
        X_val, X_test, y_val, y_test = train_test_split(
            X_temp, y_temp, test_size=0.50, stratify=y_temp, random_state=self.random_state
        )

        scaler = StandardScaler()
        X_train = scaler.fit_transform(X_train)
        X_val = scaler.transform(X_val)
        X_test = scaler.transform(X_test)

        logger.info(
            f"Split: train={len(X_train)} | val={len(X_val)} | test={len(X_test)} | "
            f"off-spec rate: train={y_train.mean():.1%} test={y_test.mean():.1%}"
        )
        return X_train, X_val, X_test, y_train, y_val, y_test, scaler

    # ── Training ──────────────────────────────────────────────────────────────

    def train_all_candidates(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        X_test: np.ndarray,
        y_test: np.ndarray,
    ) -> dict[str, tuple[object, ModelMetrics]]:
        """
        Train all candidate models and compute their test-set metrics.

        Returns
        -------
        dict mapping model_name → (fitted_model, ModelMetrics)
        """
        results: dict[str, tuple[object, ModelMetrics]] = {}

        for model_name, clf in CANDIDATE_MODELS.items():
            logger.info(f"Training {model_name}...")
            t0 = time.perf_counter()
            clf.fit(X_train, y_train)
            duration = time.perf_counter() - t0

            version = f"{model_name.lower()}_v1"
            metrics = self.validator.compute_metrics(
                model=clf,
                X_train=X_train,
                y_train=y_train,
                X_test=X_test,
                y_test=y_test,
                model_name=model_name,
                model_version=version,
                feature_names=FEATURE_COLUMNS,
                training_duration_sec=duration,
            )
            results[model_name] = (clf, metrics)

        return results

    # ── Model selection ───────────────────────────────────────────────────────

    def select_best_model(
        self, results: dict[str, tuple[object, ModelMetrics]]
    ) -> tuple[str, object, ModelMetrics]:
        """
        Automatically select the model with the highest F1-macro on the test set.

        Returns
        -------
        (best_model_name, best_model, best_metrics)
        """
        best_name = max(results, key=lambda k: results[k][1].f1_macro)
        best_model, best_metrics = results[best_name]
        logger.info(
            f"🏆 Best model: {best_name} | F1-macro={best_metrics.f1_macro:.4f} | "
            f"ROC-AUC={best_metrics.roc_auc:.4f}"
        )
        return best_name, best_model, best_metrics

    # ── Artifact persistence ──────────────────────────────────────────────────

    def save_artifacts(
        self,
        results: dict[str, tuple[object, ModelMetrics]],
        scaler: StandardScaler,
        best_model_name: str,
    ) -> None:
        """
        Save all fitted models, the scaler, and the selection manifest to
        ``backend/artifacts/``.

        Artifact layout
        ---------------
        artifacts/
          scaler.joblib
          RandomForest_model.joblib
          XGBoost_model.joblib
          LightGBM_model.joblib
          model_manifest.json        ← lists all models + metrics + active pointer
        """
        # Save scaler
        scaler_path = ARTIFACTS_DIR / "scaler.joblib"
        joblib.dump(scaler, scaler_path)
        logger.info(f"Saved scaler → {scaler_path}")

        manifest: dict = {
            "active_model": best_model_name,
            "feature_columns": FEATURE_COLUMNS,
            "scaler_path": str(scaler_path),
            "models": {},
        }

        for model_name, (clf, metrics) in results.items():
            artifact_path = ARTIFACTS_DIR / f"{model_name}_model.joblib"
            joblib.dump(clf, artifact_path)
            logger.info(f"Saved {model_name} → {artifact_path}")

            manifest["models"][model_name] = {
                "version": metrics.model_version,
                "artifact_path": str(artifact_path),
                "metrics": {
                    "accuracy": metrics.accuracy,
                    "precision_macro": metrics.precision_macro,
                    "recall_macro": metrics.recall_macro,
                    "f1_macro": metrics.f1_macro,
                    "f1_weighted": metrics.f1_weighted,
                    "roc_auc": metrics.roc_auc,
                    "cv_f1_mean": metrics.cv_f1_mean,
                    "cv_f1_std": metrics.cv_f1_std,
                    "cv_f1_scores": metrics.cv_f1_scores,
                    "confusion_matrix_raw": metrics.confusion_matrix_raw,
                    "confusion_matrix_normalised": metrics.confusion_matrix_normalised,
                    "feature_importances": metrics.feature_importances,
                    "n_train_samples": metrics.n_train_samples,
                    "n_test_samples": metrics.n_test_samples,
                    "training_duration_sec": metrics.training_duration_sec,
                },
                "is_active": model_name == best_model_name,
            }

        with open(MANIFEST_PATH, "w") as f:
            json.dump(manifest, f, indent=2)
        logger.info(f"Saved model manifest → {MANIFEST_PATH}")

    # ── Full run ──────────────────────────────────────────────────────────────

    def run(self) -> dict:
        """
        Execute the complete training pipeline end-to-end.

        Returns
        -------
        dict
            Summary dict with best model name, metrics, and artifact paths.
        """
        logger.info("=" * 70)
        logger.info("GradeSense AI — Model Training Pipeline")
        logger.info("=" * 70)

        df = self.load_or_generate_dataset()
        X_train, X_val, X_test, y_train, y_val, y_test, scaler = self.split_and_scale(df)
        results = self.train_all_candidates(X_train, y_train, X_test, y_test)
        best_name, best_model, best_metrics = self.select_best_model(results)
        self.save_artifacts(results, scaler, best_name)

        summary = {
            "best_model": best_name,
            "f1_macro": best_metrics.f1_macro,
            "roc_auc": best_metrics.roc_auc,
            "accuracy": best_metrics.accuracy,
            "all_models": {
                name: {
                    "f1_macro": m.f1_macro,
                    "roc_auc": m.roc_auc,
                    "cv_f1_mean": m.cv_f1_mean,
                }
                for name, (_, m) in results.items()
            },
            "artifact_dir": str(ARTIFACTS_DIR),
        }

        logger.info("=" * 70)
        logger.info(f"Training complete. Best: {best_name} (F1={best_metrics.f1_macro:.4f})")
        logger.info("=" * 70)
        return summary


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------
def _parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="GradeSense AI — Training Pipeline CLI")
    p.add_argument("--n-samples", type=int, default=5000, help="Synthetic dataset size")
    p.add_argument("--data-path", type=str, default=None, help="Path to real training CSV")
    p.add_argument("--random-state", type=int, default=42)
    p.add_argument("--log-level", type=str, default="INFO")
    return p.parse_args()


if __name__ == "__main__":
    args = _parse_args()
    logging.basicConfig(
        level=getattr(logging, args.log_level.upper(), logging.INFO),
        format="%(asctime)s | %(name)s | %(levelname)s | %(message)s",
    )
    pipeline = ModelTrainingPipeline(
        n_samples=args.n_samples,
        data_path=args.data_path,
        random_state=args.random_state,
    )
    summary = pipeline.run()
    print("\n" + "=" * 60)
    print("TRAINING SUMMARY")
    print("=" * 60)
    for model_name, m in summary["all_models"].items():
        star = " [BEST]" if model_name == summary["best_model"] else ""
        print(f"  {model_name:<15} F1={m['f1_macro']:.4f}  ROC-AUC={m['roc_auc']:.4f}  CV-F1={m['cv_f1_mean']:.4f}{star}")
    print(f"\nArtifacts saved to: {summary['artifact_dir']}")
