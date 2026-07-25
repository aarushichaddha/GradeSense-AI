"""
explainer.py
============
SHAP-based Explainable AI engine for the GradeSense quality deviation predictor.

For every prediction, this module computes:
  1. SHAP values per feature (using shap.TreeExplainer for RF/XGBoost/LightGBM).
  2. Signed contribution values showing which features push toward/away from off-spec.
  3. Contribution percentages — how much each feature contributes to the decision.
  4. Operator-friendly natural language explanations for each contributing factor.
  5. Historical comparison: whether each input is above/below/within the training data norm.
  6. A plain-English narrative paragraph explaining WHY the AI predicted failure.

Dependencies: shap>=0.44.0 (installed via requirements.txt)

Usage
-----
    from app.ai.explainer import SHAPExplainer, ExplainedPrediction
    explainer = SHAPExplainer()
    result: ExplainedPrediction = explainer.explain(model, scaler, X_raw, feature_columns, prediction_result)
"""
from __future__ import annotations

import logging
import threading
import time
from dataclasses import dataclass, field
from typing import Any, Optional

import numpy as np

from app.ai.operator_language import (
    OPERATOR_LANGUAGE_MAP,
    FeatureLanguage,
    get_feature_language,
)

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Output data structures
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class FeatureContribution:
    """SHAP contribution for a single feature."""
    feature_name: str
    operator_name: str
    unit: str
    category: str
    icon: str

    # Raw values
    current_value: float
    shap_value: float          # Raw SHAP value (signed)

    # Contribution metrics
    contribution_pct: float    # |shap_value| / sum(|shap_values|) * 100
    direction: str             # "INCREASES_RISK" | "DECREASES_RISK"

    # Operator-friendly explanation
    operator_message: str      # Plain-language explanation

    # Historical comparison
    normal_range_low: float
    normal_range_high: float
    normal_label: str
    historical_status: str     # "ABOVE_NORMAL" | "BELOW_NORMAL" | "WITHIN_NORMAL"
    historical_deviation_pct: float  # % deviation from midpoint of normal range


@dataclass
class ExplainedPrediction:
    """Full XAI explanation output for a single inference call."""

    # Core verdict
    off_spec_probability: float
    risk_label: str
    confidence_score: float

    # SHAP contributions (sorted by |shap_value| desc, top 10)
    top_contributions: list[FeatureContribution]

    # Plain-English narrative
    narrative: str                   # "Why did the AI predict failure?" paragraph
    key_reasons: list[str]           # Bullet points (operator-friendly sentences)

    # Model metadata
    model_name: str
    model_version: str
    explanation_latency_ms: float

    # Base value (expected value = mean prediction over training data)
    shap_base_value: float = 0.0

    # Status
    status: str = "OK"


# ─────────────────────────────────────────────────────────────────────────────
# Historical reference statistics (training data averages)
# These are the expected "normal" mid-transition values used for comparison.
# ─────────────────────────────────────────────────────────────────────────────
_TRAINING_DATA_MEANS: dict[str, float] = {
    "stock_flow_lpm":             400.0,
    "steam_pressure_bar":          8.0,
    "machine_speed_mpm":          800.0,
    "moisture_pct":                6.5,
    "basis_weight_gsm":           120.0,
    "ash_pct":                     17.5,
    "caliper_um":                  155.0,
    "transition_time_min":         47.5,
    "delta_basis_weight":          12.0,
    "delta_speed":                  0.0,
    "delta_steam":                 -0.5,
    "delta_moisture_target":        0.0,
    "steam_per_speed":              0.010,
    "basis_weight_per_flow":        0.30,
    "moisture_steam_ratio":         0.82,
    "speed_per_caliper":            5.2,
    "ash_basis_interaction":      2100.0,
    "recipe_similarity_score":      0.55,
    "transition_momentum":          0.65,
    "historical_offspec_rate":      0.18,
    "caliper_variance_proxy":       0.41,
    "drying_adequacy_ratio":        0.87,
    "headbox_loading":              0.50,
    "recipe_delta_magnitude":       85.0,
    "speed_pressure_interaction": 6400.0,
}


# ─────────────────────────────────────────────────────────────────────────────
# SHAP Explainer
# ─────────────────────────────────────────────────────────────────────────────

class SHAPExplainer:
    """
    Computes SHAP TreeExplainer values for any tree-based sklearn-compatible model
    (RandomForest, XGBoost, LightGBM).

    Thread-safe: one explainer instance is cached per model name.
    """

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._explainer_cache: dict[str, Any] = {}

    def _get_explainer(self, model: Any, model_name: str) -> Any:
        """Lazy-load and cache a shap.TreeExplainer for the given model."""
        import shap

        with self._lock:
            if model_name not in self._explainer_cache:
                logger.info(f"Building SHAP TreeExplainer for model '{model_name}'...")
                try:
                    self._explainer_cache[model_name] = shap.TreeExplainer(model)
                except Exception:
                    # Fallback to generic KernelExplainer using 50-sample background
                    logger.warning("TreeExplainer failed — using Explainer fallback.")
                    self._explainer_cache[model_name] = shap.Explainer(model)
            return self._explainer_cache[model_name]

    def explain(
        self,
        model: Any,
        scaler: Any,
        X_raw: np.ndarray,                 # shape (1, 25), unscaled
        feature_columns: list[str],
        off_spec_probability: float,
        confidence_score: float,
        risk_label: str,
        model_name: str,
        model_version: str,
        n_top: int = 10,
    ) -> ExplainedPrediction:
        """
        Compute SHAP explanation for a single prediction.

        Parameters
        ----------
        model : fitted sklearn/xgb/lgb estimator
        scaler : fitted StandardScaler
        X_raw : np.ndarray(1, 25) — unscaled feature values
        feature_columns : list of 25 feature names
        off_spec_probability : float — from predict_proba
        confidence_score : float
        risk_label : str
        model_name : str — for cache key
        model_version : str
        n_top : int — number of top contributions to return

        Returns
        -------
        ExplainedPrediction
        """
        t0 = time.perf_counter()

        try:
            import shap

            X_scaled = scaler.transform(X_raw)
            explainer = self._get_explainer(model, model_name)

            # Compute raw SHAP values
            shap_output = explainer.shap_values(X_scaled)

            # For binary classifiers: shap_values returns list [class0_arr, class1_arr]
            # We always want class 1 (off-spec) contributions
            if isinstance(shap_output, list) and len(shap_output) == 2:
                sv = shap_output[1][0]    # shape (n_features,)
                base_value = float(explainer.expected_value[1])
            elif isinstance(shap_output, np.ndarray) and shap_output.ndim == 3:
                sv = shap_output[0, :, 1]
                base_value = float(explainer.expected_value[1])
            else:
                sv = np.array(shap_output).flatten()[:len(feature_columns)]
                base_value = float(np.atleast_1d(explainer.expected_value)[0])

            # Normalise contributions
            abs_sum = float(np.abs(sv).sum()) or 1.0

            # Build FeatureContribution records
            contributions: list[FeatureContribution] = []
            for i, (feat_name, sv_val) in enumerate(zip(feature_columns, sv)):
                lang: FeatureLanguage = get_feature_language(feat_name)
                current_val = float(X_raw[0, i])
                direction = "INCREASES_RISK" if sv_val > 0 else "DECREASES_RISK"

                # Historical comparison
                mid = (lang.normal_range_low + lang.normal_range_high) / 2.0
                range_half = max((lang.normal_range_high - lang.normal_range_low) / 2.0, 1e-9)
                dev_pct = (current_val - mid) / range_half * 100.0
                if current_val < lang.normal_range_low:
                    hist_status = "BELOW_NORMAL"
                elif current_val > lang.normal_range_high:
                    hist_status = "ABOVE_NORMAL"
                else:
                    hist_status = "WITHIN_NORMAL"

                operator_msg = (
                    lang.risk_message if direction == "INCREASES_RISK" else lang.safe_message
                )

                contributions.append(
                    FeatureContribution(
                        feature_name=feat_name,
                        operator_name=lang.operator_name,
                        unit=lang.unit,
                        category=lang.category,
                        icon=lang.icon,
                        current_value=current_val,
                        shap_value=float(sv_val),
                        contribution_pct=round(abs(sv_val) / abs_sum * 100, 2),
                        direction=direction,
                        operator_message=operator_msg,
                        normal_range_low=lang.normal_range_low,
                        normal_range_high=lang.normal_range_high,
                        normal_label=lang.normal_label,
                        historical_status=hist_status,
                        historical_deviation_pct=round(dev_pct, 1),
                    )
                )

            # Sort by |SHAP value| descending, take top N
            contributions_sorted = sorted(
                contributions, key=lambda c: abs(c.shap_value), reverse=True
            )
            top_contributions = contributions_sorted[:n_top]

            # Generate operator narrative and key reasons
            narrative, key_reasons = self._build_narrative(
                top_contributions, off_spec_probability, risk_label
            )

            latency_ms = round((time.perf_counter() - t0) * 1000, 2)

            return ExplainedPrediction(
                off_spec_probability=off_spec_probability,
                risk_label=risk_label,
                confidence_score=confidence_score,
                top_contributions=top_contributions,
                narrative=narrative,
                key_reasons=key_reasons,
                model_name=model_name,
                model_version=model_version,
                explanation_latency_ms=latency_ms,
                shap_base_value=base_value,
                status="OK",
            )

        except Exception as exc:
            logger.exception(f"SHAP explanation failed: {exc}")
            return self._fallback_explanation(
                off_spec_probability, risk_label, confidence_score,
                X_raw, feature_columns, model_name, model_version, t0, str(exc)
            )

    # ── Narrative builder ─────────────────────────────────────────────────────

    @staticmethod
    def _build_narrative(
        top: list[FeatureContribution],
        prob: float,
        risk_label: str,
    ) -> tuple[str, list[str]]:
        """Build a plain-English explanation paragraph and bullet-point reasons."""

        risk_word = {
            "CRITICAL": "a HIGH probability",
            "WARNING":  "a MODERATE probability",
            "NORMAL":   "a LOW probability",
        }.get(risk_label, "an unknown probability")

        # Top risk-increasing factors
        risk_drivers = [c for c in top if c.direction == "INCREASES_RISK"][:5]
        safe_factors = [c for c in top if c.direction == "DECREASES_RISK"][:2]

        # Build key reason bullets
        key_reasons: list[str] = []
        for c in risk_drivers:
            hist_tag = ""
            if c.historical_status == "ABOVE_NORMAL":
                hist_tag = f" ({c.current_value:.1f} {c.unit} — above normal range of {c.normal_range_low:.0f}–{c.normal_range_high:.0f} {c.unit})"
            elif c.historical_status == "BELOW_NORMAL":
                hist_tag = f" ({c.current_value:.1f} {c.unit} — below normal range of {c.normal_range_low:.0f}–{c.normal_range_high:.0f} {c.unit})"
            else:
                hist_tag = f" ({c.current_value:.1f} {c.unit})"

            key_reasons.append(
                f"{c.icon} {c.operator_name}{hist_tag}: {c.operator_message}"
            )

        if safe_factors:
            for c in safe_factors:
                key_reasons.append(
                    f"✅ {c.operator_name} ({c.current_value:.1f} {c.unit}): {c.safe_message}"
                )

        # Build narrative paragraph
        top_names = [c.operator_name for c in risk_drivers[:3]]
        top_names_str = (
            ", ".join(top_names[:-1]) + f", and {top_names[-1]}"
            if len(top_names) > 1 else (top_names[0] if top_names else "multiple factors")
        )

        risk_sentence = {
            "CRITICAL": (
                f"The AI model has identified {risk_word} ({int(prob * 100)}%) "
                f"that this grade transition will produce off-specification paper. "
            ),
            "WARNING": (
                f"The AI model has detected {risk_word} ({int(prob * 100)}%) "
                f"of quality deviation during this grade change. "
            ),
            "NORMAL": (
                f"The AI model calculates {risk_word} ({int(prob * 100)}%) "
                f"of off-spec quality during this transition. "
            ),
        }.get(risk_label, f"The AI model predicts {int(prob * 100)}% off-spec probability. ")

        narrative = (
            risk_sentence
            + f"The primary drivers are {top_names_str}. "
            + "These factors combine to create conditions where the paper machine cannot reliably "
            "meet the target quality specifications for this grade change."
        )

        return narrative, key_reasons

    # ── Fallback when SHAP fails ──────────────────────────────────────────────

    @staticmethod
    def _fallback_explanation(
        prob: float, risk_label: str, conf: float,
        X_raw: np.ndarray, feature_columns: list[str],
        model_name: str, model_version: str,
        t0: float, error_msg: str,
    ) -> ExplainedPrediction:
        """Return a degraded explanation based on raw feature values when SHAP fails."""
        fallback_contributions = []
        for i, feat_name in enumerate(feature_columns[:10]):
            lang = get_feature_language(feat_name)
            val = float(X_raw[0, i])
            mid = (lang.normal_range_low + lang.normal_range_high) / 2.0
            fallback_contributions.append(
                FeatureContribution(
                    feature_name=feat_name,
                    operator_name=lang.operator_name,
                    unit=lang.unit,
                    category=lang.category,
                    icon=lang.icon,
                    current_value=val,
                    shap_value=0.0,
                    contribution_pct=10.0,
                    direction="INCREASES_RISK" if val > mid else "DECREASES_RISK",
                    operator_message=lang.risk_message if val > mid else lang.safe_message,
                    normal_range_low=lang.normal_range_low,
                    normal_range_high=lang.normal_range_high,
                    normal_label=lang.normal_label,
                    historical_status=(
                        "ABOVE_NORMAL" if val > lang.normal_range_high
                        else "BELOW_NORMAL" if val < lang.normal_range_low
                        else "WITHIN_NORMAL"
                    ),
                    historical_deviation_pct=0.0,
                )
            )

        return ExplainedPrediction(
            off_spec_probability=prob,
            risk_label=risk_label,
            confidence_score=conf,
            top_contributions=fallback_contributions,
            narrative=f"SHAP explanation unavailable (SHAP library error). Raw prediction: {int(prob * 100)}% off-spec probability.",
            key_reasons=["SHAP explanation generation failed. Install shap>=0.44.0."],
            model_name=model_name,
            model_version=model_version,
            explanation_latency_ms=round((time.perf_counter() - t0) * 1000, 2),
            status=f"SHAP_FALLBACK: {error_msg[:120]}",
        )


# Module-level singleton
shap_explainer = SHAPExplainer()
