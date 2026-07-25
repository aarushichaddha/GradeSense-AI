"""
GradeSense AI — Core AI Engine
================================
Exports all public classes for the ML pipeline.
"""
from app.ai.feature_engineering import GradeSenseFeatureEngineer, RawProcessInputs, FEATURE_COLUMNS
from app.ai.synthetic_data_generator import GradeTransitionDataGenerator
from app.ai.validation_pipeline import ModelValidationPipeline, ModelMetrics
from app.ai.training_pipeline import ModelTrainingPipeline
from app.ai.model_loader import ModelRegistry
from app.ai.inference_engine import QualityDeviationPredictor, PredictionResult, predictor
from app.ai.explainer import SHAPExplainer, ExplainedPrediction, shap_explainer
from app.ai.operator_language import get_feature_language, OPERATOR_LANGUAGE_MAP
from app.ai.validation_pipeline import ModelValidationPipeline, ModelMetrics
from app.ai.training_pipeline import ModelTrainingPipeline
from app.ai.model_loader import ModelRegistry
from app.ai.inference_engine import QualityDeviationPredictor, PredictionResult, predictor

__all__ = [
    # Feature layer
    "GradeSenseFeatureEngineer",
    "RawProcessInputs",
    "FEATURE_COLUMNS",
    # Data layer
    "GradeTransitionDataGenerator",
    # Validation layer
    "ModelValidationPipeline",
    "ModelMetrics",
    # Training layer
    "ModelTrainingPipeline",
    # Model registry
    "ModelRegistry",
    # Inference layer
    "QualityDeviationPredictor",
    "PredictionResult",
    "predictor",
]
