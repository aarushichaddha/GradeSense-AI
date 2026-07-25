"""
ai_inference.py
===============
Pydantic v2 request/response contracts for the GradeSense AI inference endpoints.
"""
from __future__ import annotations

from typing import Optional
from pydantic import BaseModel, Field, field_validator


# ─────────────────────────────────────────────────────────────────────────────
# Request Schema — Raw Process Inputs
# ─────────────────────────────────────────────────────────────────────────────

class GradeTransitionInputSchema(BaseModel):
    """
    All inputs required by the inference engine to predict whether the current
    grade transition will produce off-spec paper.

    All fields are validated against realistic paper machine operating bounds.
    """

    # Live sensor readings
    stock_flow_lpm: float = Field(..., ge=50.0, le=800.0, description="Headbox stock flow (L/min)")
    steam_pressure_bar: float = Field(..., ge=1.0, le=16.0, description="Dryer section steam pressure (bar)")
    machine_speed_mpm: float = Field(..., ge=100.0, le=1500.0, description="Machine speed (m/min)")
    moisture_pct: float = Field(..., ge=0.5, le=20.0, description="Sheet moisture after press section (%)")
    basis_weight_gsm: float = Field(..., ge=20.0, le=300.0, description="Current basis weight measurement (g/m²)")
    ash_pct: float = Field(..., ge=0.0, le=50.0, description="Ash/filler content (%)")
    caliper_um: float = Field(..., ge=30.0, le=500.0, description="Sheet caliper / thickness (µm)")
    transition_time_min: float = Field(..., ge=0.0, le=180.0, description="Elapsed transition time (minutes)")

    # Source recipe (grade currently running)
    source_basis_weight: float = Field(..., ge=20.0, le=300.0, description="Source grade basis weight target (g/m²)")
    source_speed: float = Field(..., ge=100.0, le=1500.0, description="Source grade design speed (m/min)")
    source_steam: float = Field(..., ge=1.0, le=16.0, description="Source grade steam pressure design (bar)")
    source_moisture_target: float = Field(..., ge=3.0, le=12.0, description="Source grade moisture target (%)")

    # Target recipe (grade being transitioned to)
    target_basis_weight: float = Field(..., ge=20.0, le=300.0, description="Target grade basis weight (g/m²)")
    target_speed: float = Field(..., ge=100.0, le=1500.0, description="Target grade design speed (m/min)")
    target_steam: float = Field(..., ge=1.0, le=16.0, description="Target grade steam pressure design (bar)")
    target_moisture_target: float = Field(..., ge=3.0, le=12.0, description="Target grade moisture target (%)")

    # Historical context (optional — defaults to average plant performance)
    historical_offspec_rate: float = Field(
        default=0.15, ge=0.0, le=1.0,
        description="Fraction of recent transitions that were off-spec on this machine [0, 1]"
    )

    model_config = {"json_schema_extra": {
        "example": {
            "stock_flow_lpm": 350.0,
            "steam_pressure_bar": 5.5,
            "machine_speed_mpm": 900.0,
            "moisture_pct": 7.2,
            "basis_weight_gsm": 120.0,
            "ash_pct": 18.0,
            "caliper_um": 140.0,
            "transition_time_min": 25.0,
            "source_basis_weight": 80.0,
            "source_speed": 800.0,
            "source_steam": 8.0,
            "source_moisture_target": 6.0,
            "target_basis_weight": 120.0,
            "target_speed": 750.0,
            "target_steam": 5.5,
            "target_moisture_target": 6.5,
            "historical_offspec_rate": 0.22,
        }
    }}


# ─────────────────────────────────────────────────────────────────────────────
# Response Schemas
# ─────────────────────────────────────────────────────────────────────────────

class PredictionResultSchema(BaseModel):
    """Inference engine response for one grade transition event."""

    off_spec_probability: float = Field(..., description="P(off-spec) ∈ [0, 1]")
    on_spec_probability: float = Field(..., description="P(on-spec) ∈ [0, 1]")
    confidence_score: float = Field(..., description="Model confidence ∈ [0, 1]")
    risk_label: str = Field(..., description="NORMAL | WARNING | CRITICAL | UNKNOWN")
    model_name: str
    model_version: str
    inference_latency_ms: float
    feature_importances: dict[str, float]
    top_risk_factors: list[str]
    input_features: dict[str, float]
    status: str


class RocCurvePoint(BaseModel):
    fpr: float
    tpr: float
    threshold: float


class ModelMetricsSchema(BaseModel):
    """Full performance profile for one trained model."""
    model_name: str
    version: str
    is_active: bool

    accuracy: float
    precision_macro: float
    recall_macro: float
    f1_macro: float
    f1_weighted: float
    roc_auc: float

    cv_f1_scores: list[float]
    cv_f1_mean: float
    cv_f1_std: float

    confusion_matrix_raw: list[list[int]]
    confusion_matrix_normalised: list[list[float]]

    feature_importances: dict[str, float]
    n_train_samples: int
    n_test_samples: int
    training_duration_sec: float


class ModelComparisonResponse(BaseModel):
    """Ranked comparison of all trained models."""
    models: list[ModelMetricsSchema]
    best_model: str
    comparison_metric: str = "f1_macro"


class TrainingStatusResponse(BaseModel):
    """Response from the training trigger endpoint."""
    status: str   # QUEUED | RUNNING | COMPLETED | FAILED
    message: str
    job_id: Optional[str] = None


# ─────────────────────────────────────────────────────────────────────────────
# XAI / Explainability Schemas
# ─────────────────────────────────────────────────────────────────────────────

class FeatureContributionSchema(BaseModel):
    """SHAP contribution for a single feature — XAI response element."""
    feature_name: str
    operator_name: str
    unit: str
    category: str
    icon: str

    current_value: float
    shap_value: float
    contribution_pct: float
    direction: str                # "INCREASES_RISK" | "DECREASES_RISK"
    operator_message: str

    normal_range_low: float
    normal_range_high: float
    normal_label: str
    historical_status: str        # "ABOVE_NORMAL" | "BELOW_NORMAL" | "WITHIN_NORMAL"
    historical_deviation_pct: float


class ExplainedPredictionSchema(BaseModel):
    """Full SHAP XAI explanation response for a grade transition prediction."""
    off_spec_probability: float
    risk_label: str
    confidence_score: float

    top_contributions: list[FeatureContributionSchema]
    narrative: str
    key_reasons: list[str]

    model_name: str
    model_version: str
    explanation_latency_ms: float
    shap_base_value: float
    status: str
