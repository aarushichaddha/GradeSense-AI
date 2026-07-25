import pytest
import numpy as np
from app.ai.feature_engineering import GradeSenseFeatureEngineer, RawProcessInputs
from app.ai.synthetic_data_generator import GradeTransitionDataGenerator
from app.ai.training_pipeline import ModelTrainingPipeline
from app.ai.operator_language import get_feature_language


def test_feature_engineering_vector_shape(sample_raw_inputs: RawProcessInputs):
    engineer = GradeSenseFeatureEngineer()
    vec = engineer.build_feature_vector(sample_raw_inputs)
    f_dict = engineer.build_feature_dict(sample_raw_inputs)

    assert isinstance(vec, np.ndarray)
    assert vec.shape == (1, 25)
    assert len(f_dict) == 25
    assert "drying_adequacy_ratio" in f_dict
    assert "transition_momentum" in f_dict


def test_synthetic_data_generator_output():
    generator = GradeTransitionDataGenerator(n_samples=100, random_state=42)
    df = generator.generate()

    assert len(df) == 100
    assert "off_spec" in df.columns
    assert len(df.columns) == 26
    assert df["off_spec"].isin([0, 1]).all()


def test_operator_language_mapping():
    lang = get_feature_language("steam_pressure_bar")
    assert lang.operator_name == "Steam Pressure (Dryer Section)"
    assert lang.unit == "bar"
    assert lang.category == "DRYING"
    assert "Steam pressure" in lang.risk_message


def test_training_pipeline_execution():
    pipeline = ModelTrainingPipeline(n_samples=150, random_state=42)
    df = pipeline.load_or_generate_dataset()
    X_train, X_val, X_test, y_train, y_val, y_test, scaler = pipeline.split_and_scale(df)

    assert len(X_train) > 0
    assert len(X_test) > 0
    assert X_train.shape[1] == 25
