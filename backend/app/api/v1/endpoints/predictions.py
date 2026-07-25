"""
predictions.py
==============
FastAPI router for the GradeSense AI inference and model management endpoints.

Endpoints
---------
POST   /predictions/infer            — Run live quality deviation prediction
POST   /predictions/explain          — Run SHAP XAI explanation for a prediction
POST   /predictions/train            — Trigger model re-training (BackgroundTask)
GET    /predictions/models           — List all registered model versions
GET    /predictions/metrics/{name}   — Full metrics for a named model
GET    /predictions/metrics/compare  — Ranked comparison across all models
GET    /predictions/health           — AI engine health check
"""
from __future__ import annotations

import logging
import uuid
from typing import List

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

import numpy as np
from app.ai.feature_engineering import RawProcessInputs, GradeSenseFeatureEngineer, FEATURE_COLUMNS
from app.ai.inference_engine import predictor
from app.ai.model_loader import ModelRegistry
from app.ai.training_pipeline import ModelTrainingPipeline
from app.ai.explainer import shap_explainer
from app.core.db import get_db
from app.schemas.ai_inference import (
    GradeTransitionInputSchema,
    ExplainedPredictionSchema,
    FeatureContributionSchema,
    ModelComparisonResponse,
    ModelMetricsSchema,
    PredictionResultSchema,
    TrainingStatusResponse,
)

router = APIRouter()
logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Helper: schema → domain object
# ─────────────────────────────────────────────────────────────────────────────

def _schema_to_raw_inputs(body: GradeTransitionInputSchema) -> RawProcessInputs:
    return RawProcessInputs(
        stock_flow_lpm=body.stock_flow_lpm,
        steam_pressure_bar=body.steam_pressure_bar,
        machine_speed_mpm=body.machine_speed_mpm,
        moisture_pct=body.moisture_pct,
        basis_weight_gsm=body.basis_weight_gsm,
        ash_pct=body.ash_pct,
        caliper_um=body.caliper_um,
        transition_time_min=body.transition_time_min,
        source_basis_weight=body.source_basis_weight,
        source_speed=body.source_speed,
        source_steam=body.source_steam,
        source_moisture_target=body.source_moisture_target,
        target_basis_weight=body.target_basis_weight,
        target_speed=body.target_speed,
        target_steam=body.target_steam,
        target_moisture_target=body.target_moisture_target,
        historical_offspec_rate=body.historical_offspec_rate,
    )


# ─────────────────────────────────────────────────────────────────────────────
# Background training task
# ─────────────────────────────────────────────────────────────────────────────

def _run_training_pipeline(n_samples: int, data_path: str | None) -> None:
    """Called in background — trains and saves all models."""
    logger.info("Background training task started.")
    try:
        pipeline = ModelTrainingPipeline(n_samples=n_samples, data_path=data_path)
        summary = pipeline.run()
        # Invalidate model cache so next inference picks up the new artifacts
        ModelRegistry.invalidate_cache()
        logger.info(f"Background training completed. Best: {summary['best_model']}")
    except Exception as exc:
        logger.exception(f"Background training failed: {exc}")


# ─────────────────────────────────────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────────────────────────────────────

@router.post(
    "/infer",
    response_model=PredictionResultSchema,
    summary="Predict Off-Spec Probability for Active Grade Transition",
    description=(
        "Accepts real-time DCS sensor readings and recipe parameters for a grade transition. "
        "Runs the trained ML model (Random Forest / XGBoost / LightGBM — auto-selected) and "
        "returns the probability of paper becoming off-spec, a risk label (NORMAL / WARNING / CRITICAL), "
        "confidence score, and the top contributing process features."
    ),
)
async def infer_quality_deviation(
    body: GradeTransitionInputSchema,
    db: AsyncSession = Depends(get_db),
) -> PredictionResultSchema:
    raw_inputs = _schema_to_raw_inputs(body)
    result = predictor.predict(raw_inputs)

    if result.status.startswith("ERROR"):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference engine error: {result.status}",
        )

    return PredictionResultSchema(
        off_spec_probability=result.off_spec_probability,
        on_spec_probability=result.on_spec_probability,
        confidence_score=result.confidence_score,
        risk_label=result.risk_label,
        model_name=result.model_name,
        model_version=result.model_version,
        inference_latency_ms=result.inference_latency_ms,
        feature_importances=result.feature_importances,
        top_risk_factors=result.top_risk_factors,
        input_features=result.input_features,
        status=result.status,
    )


@router.post(
    "/explain",
    response_model=ExplainedPredictionSchema,
    summary="SHAP Explainable AI — Why Did the Model Predict Off-Spec?",
    description=(
        "Runs SHAP TreeExplainer on the active model to produce a full explainability report: "
        "top contributing features with signed SHAP values, contribution percentages, "
        "operator-friendly plain-English explanations, historical comparison (ABOVE/BELOW/WITHIN normal), "
        "and a narrative paragraph explaining why the AI flagged this transition as at-risk. "
        "No ML jargon — all explanations use plant operator language."
    ),
)
async def explain_prediction(
    body: GradeTransitionInputSchema,
    db: AsyncSession = Depends(get_db),
) -> ExplainedPredictionSchema:
    if not ModelRegistry.is_trained():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No trained model found. Run POST /predictions/train first.",
        )

    # 1. Run inference
    raw_inputs = _schema_to_raw_inputs(body)
    result = predictor.predict(raw_inputs)

    # 2. Build feature vector (unscaled) for SHAP
    engineer = GradeSenseFeatureEngineer()
    feature_dict = engineer.build_feature_dict(raw_inputs)
    X_raw = np.array(
        [feature_dict[col] for col in FEATURE_COLUMNS], dtype=np.float64
    ).reshape(1, -1)

    # 3. Load model + scaler
    model, scaler, feature_columns = ModelRegistry.load_active_model()
    active_name = ModelRegistry.get_active_model_name()
    manifest = ModelRegistry.list_registered_models()
    active_info = next((m for m in manifest if m["model_name"] == active_name), {})
    model_version = active_info.get("version", "v1")

    # 4. Compute SHAP explanation
    explanation = shap_explainer.explain(
        model=model,
        scaler=scaler,
        X_raw=X_raw,
        feature_columns=feature_columns,
        off_spec_probability=result.off_spec_probability,
        confidence_score=result.confidence_score,
        risk_label=result.risk_label,
        model_name=active_name,
        model_version=model_version,
    )

    # 5. Map to response schema
    contributions_schema = [
        FeatureContributionSchema(
            feature_name=c.feature_name,
            operator_name=c.operator_name,
            unit=c.unit,
            category=c.category,
            icon=c.icon,
            current_value=c.current_value,
            shap_value=c.shap_value,
            contribution_pct=c.contribution_pct,
            direction=c.direction,
            operator_message=c.operator_message,
            normal_range_low=c.normal_range_low,
            normal_range_high=c.normal_range_high,
            normal_label=c.normal_label,
            historical_status=c.historical_status,
            historical_deviation_pct=c.historical_deviation_pct,
        )
        for c in explanation.top_contributions
    ]

    return ExplainedPredictionSchema(
        off_spec_probability=explanation.off_spec_probability,
        risk_label=explanation.risk_label,
        confidence_score=explanation.confidence_score,
        top_contributions=contributions_schema,
        narrative=explanation.narrative,
        key_reasons=explanation.key_reasons,
        model_name=explanation.model_name,
        model_version=explanation.model_version,
        explanation_latency_ms=explanation.explanation_latency_ms,
        shap_base_value=explanation.shap_base_value,
        status=explanation.status,
    )


@router.post(
    "/train",
    response_model=TrainingStatusResponse,
    summary="Trigger Model Re-Training (Background Task)",
    description=(
        "Kicks off the full training pipeline in a background worker: "
        "data generation / loading → train RF + XGBoost + LightGBM → 5-fold CV → "
        "auto-select best model by F1-macro → save artifacts. "
        "Returns immediately with a job ID; models will be available after completion."
    ),
)
async def trigger_training(
    background_tasks: BackgroundTasks,
    n_samples: int = 5000,
    data_path: str | None = None,
) -> TrainingStatusResponse:
    job_id = str(uuid.uuid4())
    background_tasks.add_task(_run_training_pipeline, n_samples, data_path)
    logger.info(f"Training job {job_id} queued with n_samples={n_samples}.")
    return TrainingStatusResponse(
        status="QUEUED",
        message=(
            f"Training pipeline queued (job_id={job_id}). "
            f"Training {n_samples} grade transition events across Random Forest, XGBoost, and LightGBM. "
            "Query /predictions/models after ~60s to see results."
        ),
        job_id=job_id,
    )


@router.get(
    "/models",
    summary="List All Registered Model Versions",
    description="Returns all trained model versions from the artifact manifest, ranked by F1-macro.",
)
async def list_models() -> list[dict]:
    if not ModelRegistry.is_trained():
        return []
    return ModelRegistry.list_registered_models()


@router.get(
    "/metrics/compare",
    response_model=ModelComparisonResponse,
    summary="Ranked Model Comparison (RF vs XGBoost vs LightGBM)",
    description="Returns a ranked table of all trained models with accuracy, F1, ROC-AUC, and confusion matrix.",
)
async def compare_models() -> ModelComparisonResponse:
    if not ModelRegistry.is_trained():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No trained models found. Call POST /predictions/train first.",
        )

    registered = ModelRegistry.list_registered_models()
    model_schemas = [
        ModelMetricsSchema(
            model_name=m["model_name"],
            version=m["version"],
            is_active=m["is_active"],
            accuracy=m["metrics"]["accuracy"],
            precision_macro=m["metrics"]["precision_macro"],
            recall_macro=m["metrics"]["recall_macro"],
            f1_macro=m["metrics"]["f1_macro"],
            f1_weighted=m["metrics"]["f1_weighted"],
            roc_auc=m["metrics"]["roc_auc"],
            cv_f1_scores=m["metrics"]["cv_f1_scores"],
            cv_f1_mean=m["metrics"]["cv_f1_mean"],
            cv_f1_std=m["metrics"]["cv_f1_std"],
            confusion_matrix_raw=m["metrics"]["confusion_matrix_raw"],
            confusion_matrix_normalised=m["metrics"]["confusion_matrix_normalised"],
            feature_importances=m["metrics"]["feature_importances"],
            n_train_samples=m["metrics"]["n_train_samples"],
            n_test_samples=m["metrics"]["n_test_samples"],
            training_duration_sec=m["metrics"]["training_duration_sec"],
        )
        for m in registered
    ]

    best = max(model_schemas, key=lambda m: m.f1_macro)
    return ModelComparisonResponse(
        models=model_schemas,
        best_model=best.model_name,
        comparison_metric="f1_macro",
    )


@router.get(
    "/metrics/{model_name}",
    response_model=ModelMetricsSchema,
    summary="Full Metrics for a Specific Model",
)
async def get_model_metrics(model_name: str) -> ModelMetricsSchema:
    if not ModelRegistry.is_trained():
        raise HTTPException(status_code=404, detail="No trained models found.")
    try:
        m_info = ModelRegistry.list_registered_models()
        entry = next((m for m in m_info if m["model_name"] == model_name), None)
        if not entry:
            raise ValueError(f"'{model_name}' not found in manifest.")
        m = entry["metrics"]
        return ModelMetricsSchema(
            model_name=model_name,
            version=entry["version"],
            is_active=entry["is_active"],
            accuracy=m["accuracy"],
            precision_macro=m["precision_macro"],
            recall_macro=m["recall_macro"],
            f1_macro=m["f1_macro"],
            f1_weighted=m["f1_weighted"],
            roc_auc=m["roc_auc"],
            cv_f1_scores=m["cv_f1_scores"],
            cv_f1_mean=m["cv_f1_mean"],
            cv_f1_std=m["cv_f1_std"],
            confusion_matrix_raw=m["confusion_matrix_raw"],
            confusion_matrix_normalised=m["confusion_matrix_normalised"],
            feature_importances=m["feature_importances"],
            n_train_samples=m["n_train_samples"],
            n_test_samples=m["n_test_samples"],
            training_duration_sec=m["training_duration_sec"],
        )
    except (ValueError, KeyError) as exc:
        raise HTTPException(status_code=404, detail=str(exc))


@router.get(
    "/health",
    summary="AI Engine Health Check",
    description="Returns the current training status and active model metadata.",
)
async def ai_health() -> dict:
    trained = ModelRegistry.is_trained()
    if not trained:
        return {
            "status": "MODEL_NOT_TRAINED",
            "message": "Call POST /predictions/train to train the AI engine.",
            "active_model": None,
        }

    manifest = ModelRegistry.list_registered_models()
    active = next((m for m in manifest if m["is_active"]), manifest[0] if manifest else {})
    return {
        "status": "OPERATIONAL",
        "active_model": active.get("model_name"),
        "active_model_version": active.get("version"),
        "f1_macro": active.get("metrics", {}).get("f1_macro"),
        "roc_auc": active.get("metrics", {}).get("roc_auc"),
        "all_models": [m["model_name"] for m in manifest],
    }
