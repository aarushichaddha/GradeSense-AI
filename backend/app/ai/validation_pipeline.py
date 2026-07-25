"""
validation_pipeline.py
=======================
Computes full classification performance metrics for any trained model.

Outputs
-------
- Accuracy, Precision, Recall, F1 (macro & weighted)
- ROC-AUC (binary)
- 5-fold stratified cross-validation scores
- Normalised confusion matrix
- ROC curve data points for frontend charting
- Feature importance rankings
"""
from __future__ import annotations

import logging
import numpy as np
from dataclasses import dataclass, field
from typing import Any, Optional

logger = logging.getLogger(__name__)


@dataclass
class RocPoint:
    """Single point on the ROC curve."""
    fpr: float
    tpr: float
    threshold: float


@dataclass
class ModelMetrics:
    """Complete performance profile for one trained model."""
    model_name: str
    model_version: str

    # Classification metrics
    accuracy: float
    precision_macro: float
    recall_macro: float
    f1_macro: float
    f1_weighted: float
    roc_auc: float

    # Cross-validation
    cv_f1_scores: list[float]
    cv_f1_mean: float
    cv_f1_std: float

    # Confusion matrix (normalised)
    confusion_matrix_raw: list[list[int]]
    confusion_matrix_normalised: list[list[float]]

    # ROC curve data
    roc_curve_points: list[RocPoint] = field(default_factory=list)

    # Feature importances (top-15)
    feature_importances: dict[str, float] = field(default_factory=dict)

    # Training metadata
    n_train_samples: int = 0
    n_test_samples: int = 0
    training_duration_sec: float = 0.0


class ModelValidationPipeline:
    """
    Evaluates any sklearn-compatible binary classifier using a held-out test set
    and stratified k-fold cross-validation.

    Parameters
    ----------
    cv_folds : int
        Number of cross-validation folds (default: 5).
    """

    def __init__(self, cv_folds: int = 5):
        self.cv_folds = cv_folds

    def compute_metrics(
        self,
        model: Any,
        X_train: np.ndarray,
        y_train: np.ndarray,
        X_test: np.ndarray,
        y_test: np.ndarray,
        model_name: str,
        model_version: str,
        feature_names: Optional[list[str]] = None,
        training_duration_sec: float = 0.0,
    ) -> ModelMetrics:
        """
        Compute the full set of metrics for a fitted classifier.

        Parameters
        ----------
        model : sklearn Pipeline or estimator (already fitted)
        X_train, y_train : training data (for CV)
        X_test, y_test   : held-out test data
        model_name        : human-readable name (e.g. "Random Forest")
        model_version     : version string for artifact tracking
        feature_names     : list of feature column names for importance reporting
        training_duration_sec : wall-clock training time

        Returns
        -------
        ModelMetrics dataclass
        """
        # Import lazily so the module is importable without sklearn installed
        from sklearn.metrics import (
            accuracy_score,
            precision_score,
            recall_score,
            f1_score,
            roc_auc_score,
            confusion_matrix,
            roc_curve,
        )
        from sklearn.model_selection import StratifiedKFold, cross_val_score

        y_pred = model.predict(X_test)
        y_proba = (
            model.predict_proba(X_test)[:, 1]
            if hasattr(model, "predict_proba")
            else y_pred.astype(float)
        )

        # Core metrics
        accuracy = float(accuracy_score(y_test, y_pred))
        precision = float(precision_score(y_test, y_pred, average="macro", zero_division=0))
        recall = float(recall_score(y_test, y_pred, average="macro", zero_division=0))
        f1_mac = float(f1_score(y_test, y_pred, average="macro", zero_division=0))
        f1_wt = float(f1_score(y_test, y_pred, average="weighted", zero_division=0))
        roc_auc = float(roc_auc_score(y_test, y_proba))

        # Cross-validation on combined (train+test reuse is deliberate for CV — we
        # pass X_train only to avoid data leakage from the true test holdout)
        skf = StratifiedKFold(n_splits=self.cv_folds, shuffle=True, random_state=42)
        cv_scores = cross_val_score(model, X_train, y_train, cv=skf, scoring="f1_macro")
        cv_f1_scores = [float(s) for s in cv_scores]
        cv_mean = float(np.mean(cv_scores))
        cv_std = float(np.std(cv_scores))

        # Confusion matrix
        cm = confusion_matrix(y_test, y_pred)
        cm_raw = cm.tolist()
        cm_norm = (cm.astype(float) / cm.sum(axis=1, keepdims=True)).round(4).tolist()

        # ROC curve (subsample to 100 points for API response size)
        fprs, tprs, thresholds = roc_curve(y_test, y_proba)
        indices = np.linspace(0, len(fprs) - 1, num=min(100, len(fprs)), dtype=int)
        roc_points = [
            RocPoint(
                fpr=float(fprs[i]),
                tpr=float(tprs[i]),
                threshold=float(thresholds[i]) if i < len(thresholds) else 0.0,
            )
            for i in indices
        ]

        # Feature importances (model-agnostic: try attribute, else uniform)
        importances: dict[str, float] = {}
        if feature_names:
            raw_imp = self._extract_importances(model, len(feature_names))
            if raw_imp is not None:
                ranked = sorted(
                    zip(feature_names, raw_imp),
                    key=lambda x: x[1],
                    reverse=True,
                )[:15]
                importances = {name: float(imp) for name, imp in ranked}

        logger.info(
            f"[{model_name}] accuracy={accuracy:.4f} | precision={precision:.4f} | "
            f"recall={recall:.4f} | F1-macro={f1_mac:.4f} | ROC-AUC={roc_auc:.4f} | "
            f"CV-F1={cv_mean:.4f}±{cv_std:.4f}"
        )

        return ModelMetrics(
            model_name=model_name,
            model_version=model_version,
            accuracy=accuracy,
            precision_macro=precision,
            recall_macro=recall,
            f1_macro=f1_mac,
            f1_weighted=f1_wt,
            roc_auc=roc_auc,
            cv_f1_scores=cv_f1_scores,
            cv_f1_mean=cv_mean,
            cv_f1_std=cv_std,
            confusion_matrix_raw=cm_raw,
            confusion_matrix_normalised=cm_norm,
            roc_curve_points=roc_points,
            feature_importances=importances,
            n_train_samples=len(X_train),
            n_test_samples=len(X_test),
            training_duration_sec=training_duration_sec,
        )

    def compare_all_models(self, metrics_list: list[ModelMetrics]) -> list[ModelMetrics]:
        """
        Sort a list of ModelMetrics by F1-macro descending.

        Returns
        -------
        list[ModelMetrics]
            Ranked from best to worst by F1-macro.
        """
        return sorted(metrics_list, key=lambda m: m.f1_macro, reverse=True)

    def _extract_importances(self, model: Any, n_features: int) -> Optional[np.ndarray]:
        """Extract feature importance array from model (handles Pipeline wrapper)."""
        # Try to unwrap sklearn Pipeline
        estimator = model
        if hasattr(model, "named_steps"):
            # Pipeline: last step is the classifier
            last_step_name = list(model.named_steps.keys())[-1]
            estimator = model.named_steps[last_step_name]

        if hasattr(estimator, "feature_importances_"):
            return estimator.feature_importances_

        if hasattr(estimator, "coef_"):
            return np.abs(estimator.coef_).flatten()[:n_features]

        return None
