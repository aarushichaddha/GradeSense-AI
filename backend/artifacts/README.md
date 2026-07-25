# GradeSense AI — Model Artifacts

This directory stores all trained ML model artifacts produced by the training pipeline.

## Contents (after first training run)

| File | Description |
|---|---|
| `model_manifest.json` | Master manifest: lists all models, their metrics, artifact paths, and the active model pointer |
| `scaler.joblib` | Fitted `StandardScaler` — **must** be used for both training and inference transforms |
| `RandomForest_model.joblib` | Trained `RandomForestClassifier` |
| `XGBoost_model.joblib` | Trained `XGBClassifier` |
| `LightGBM_model.joblib` | Trained `LGBMClassifier` |

## Running the Training Pipeline

From the `backend/` directory:

```bash
# Activate your virtual environment first
pip install -r requirements.txt

# Run with default 5,000 synthetic samples
python -m app.ai.training_pipeline

# Run with your own SCADA CSV (must have all 25 feature columns + off_spec label)
python -m app.ai.training_pipeline --data-path data/my_plant_data.csv --n-samples 20000
```

## Artifact Format

All models are saved with `joblib.dump()` and loaded with `joblib.load()`.  
The `model_manifest.json` is the single source of truth for which model is active.

Do **not** delete or modify `scaler.joblib` independently of retraining — the scaler
parameters must match those used during training.
