"""
inference_engine.py
===================
Live inference engine for the GradeSense AI quality deviation predictor.

Accepts a validated ``RawProcessInputs`` object, computes the 25-feature vector,
applies the trained scaler, runs ``model.predict_proba()``, and returns a rich
``PredictionResult`` with:

  - off_spec_probability  (0.0 – 1.0, float)
  - confidence_score      (derived from the max class probability)
  - risk_label            (NORMAL / WARNING / CRITICAL)
  - feature_importances   (top-10 contributing features)
  - model_version         (identifies which artifact was used)
  - inference_latency_ms  (wall-clock measurement)

If no trained model exists, the engine returns ``MODEL_NOT_TRAINED`` status
rather than crashing the API.
"""
from __future__ import annotations

import logging
import time
from dataclasses import dataclass, field
from typing import Optional

import numpy as np

from app.ai.feature_engineering import GradeSenseFeatureEngineer, RawProcessInputs
from app.ai.model_loader import ModelRegistry

logger = logging.getLogger(__name__)


# ── Risk classification thresholds ────────────────────────────────────────────
RISK_THRESHOLDS = {
    "NORMAL":   (0.00, 0.35),
    "WARNING":  (0.35, 0.65),
    "CRITICAL": (0.65, 1.01),
}


def _classify_risk(probability: float) -> str:
    for label, (lo, hi) in RISK_THRESHOLDS.items():
        if lo <= probability < hi:
            return label
    return "CRITICAL"


def _confidence_from_proba(proba_class1: float) -> float:
    """
    Confidence score: how far the predicted probability is from 0.5 decision boundary.

    Maps [0.5, 1.0] → [0.0, 1.0] and [0.0, 0.5] → [0.0, 1.0].
    """
    return float(abs(proba_class1 - 0.5) * 2.0)


@dataclass
class PredictionResult:
    """Complete inference output for a single grade transition event."""

    # Core prediction
    off_spec_probability: float          # Model P(off-spec) in [0, 1]
    on_spec_probability: float           # 1 - off_spec_probability
    confidence_score: float              # Distance from decision boundary [0, 1]
    risk_label: str                      # NORMAL | WARNING | CRITICAL

    # Model identity
    model_name: str
    model_version: str
    inference_latency_ms: float

    # Explainability
    feature_importances: dict[str, float] = field(default_factory=dict)
    top_risk_factors: list[str] = field(default_factory=list)

    # Input echo (for audit trail)
    input_features: dict[str, float] = field(default_factory=dict)

    # Status flag
    status: str = "OK"   # OK | MODEL_NOT_TRAINED | ERROR


class QualityDeviationPredictor:
    """
    Main inference class.  Instantiate once per FastAPI application lifecycle
    (e.g., in lifespan or as a module-level singleton).
    """

    def __init__(self) -> None:
        self._engineer = GradeSenseFeatureEngineer()

    def predict(self, raw_inputs: RawProcessInputs) -> PredictionResult:
        """
        Run the full inference pipeline for one grade transition observation.

        Parameters
        ----------
        raw_inputs : RawProcessInputs
            Validated process inputs from the DCS / API request.

        Returns
        -------
        PredictionResult
        """
        t0 = time.perf_counter()

        # Graceful degradation if model hasn't been trained yet
        if not ModelRegistry.is_trained():
            logger.warning("Model not trained — returning MODEL_NOT_TRAINED status.")
            return PredictionResult(
                off_spec_probability=0.0,
                on_spec_probability=0.0,
                confidence_score=0.0,
                risk_label="UNKNOWN",
                model_name="none",
                model_version="none",
                inference_latency_ms=0.0,
                status="MODEL_NOT_TRAINED",
            )

        try:
            # 1. Feature engineering
            feature_dict = self._engineer.build_feature_dict(raw_inputs)
            X_raw = np.array(
                [feature_dict[col] for col in self._engineer.get_feature_names()],
                dtype=np.float64,
            ).reshape(1, -1)

            # 2. Load active model + scaler (cached after first call)
            model, scaler, feature_columns = ModelRegistry.load_active_model()
            active_model_name = ModelRegistry.get_active_model_name()

            # 3. Scale
            X_scaled = scaler.transform(X_raw)

            # 4. Inference
            proba = model.predict_proba(X_scaled)[0]   # shape: (2,)
            off_spec_prob = float(proba[1])
            on_spec_prob = float(proba[0])

            # 5. Risk classification
            risk_label = _classify_risk(off_spec_prob)
            confidence = _confidence_from_proba(off_spec_prob)

            # 6. Feature importances (top 10)
            importances = self._get_top_importances(model, feature_columns, n=10)
            top_risk_factors = [k for k, _ in list(importances.items())[:5]]

            latency_ms = (time.perf_counter() - t0) * 1000.0

            # 7. Model version from manifest
            manifest = ModelRegistry.list_registered_models()
            active_info = next((m for m in manifest if m["model_name"] == active_model_name), {})
            model_version = active_info.get("version", "v1")

            logger.info(
                f"Inference | P(off-spec)={off_spec_prob:.4f} | "
                f"risk={risk_label} | confidence={confidence:.4f} | "
                f"model={active_model_name} | latency={latency_ms:.1f}ms"
            )

            return PredictionResult(
                off_spec_probability=round(off_spec_prob, 6),
                on_spec_probability=round(on_spec_prob, 6),
                confidence_score=round(confidence, 6),
                risk_label=risk_label,
                model_name=active_model_name,
                model_version=model_version,
                inference_latency_ms=round(latency_ms, 2),
                feature_importances=importances,
                top_risk_factors=top_risk_factors,
                input_features=feature_dict,
                status="OK",
            )

        except Exception as exc:
            logger.exception(f"Inference failed: {exc}")
            return PredictionResult(
                off_spec_probability=0.0,
                on_spec_probability=0.0,
                confidence_score=0.0,
                risk_label="UNKNOWN",
                model_name="error",
                model_version="error",
                inference_latency_ms=(time.perf_counter() - t0) * 1000.0,
                status=f"ERROR: {str(exc)}",
            )

    def predict_sample(self) -> PredictionResult:
        """
        Run inference on a built-in sample input — useful for smoke testing
        without a database connection.

        Run with:
            python -c "from app.ai.inference_engine import QualityDeviationPredictor; \
                       p = QualityDeviationPredictor(); print(p.predict_sample())"
        """
        sample = RawProcessInputs(
            stock_flow_lpm=350.0,
            steam_pressure_bar=5.5,
            machine_speed_mpm=900.0,
            moisture_pct=7.2,
            basis_weight_gsm=120.0,
            ash_pct=18.0,
            caliper_um=140.0,
            transition_time_min=25.0,
            source_basis_weight=80.0,
            source_speed=800.0,
            source_steam=8.0,
            source_moisture_target=6.0,
            target_basis_weight=120.0,
            target_speed=750.0,
            target_steam=5.5,
            target_moisture_target=6.5,
            historical_offspec_rate=0.22,
        )
        return self.predict(sample)

    # ── Internal helpers ──────────────────────────────────────────────────────

    @staticmethod
    def _get_top_importances(model, feature_names: list[str], n: int = 10) -> dict[str, float]:
        """Extract and rank feature importances from the fitted model."""
        estimator = model
        if hasattr(model, "named_steps"):
            last_step = list(model.named_steps.keys())[-1]
            estimator = model.named_steps[last_step]

        if hasattr(estimator, "feature_importances_"):
            raw = estimator.feature_importances_
        elif hasattr(estimator, "coef_"):
            raw = np.abs(estimator.coef_).flatten()
        else:
            return {}

        pairs = sorted(zip(feature_names, raw), key=lambda x: x[1], reverse=True)
        total = sum(v for _, v in pairs[:n]) or 1.0
        return {name: round(float(val) / total, 5) for name, val in pairs[:n]}


# Module-level singleton — imported by the FastAPI endpoint
predictor = QualityDeviationPredictor()
