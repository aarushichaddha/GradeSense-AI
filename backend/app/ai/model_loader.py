"""
model_loader.py
===============
Thread-safe artifact registry for loading trained ML models and their metadata.

On first call, loads the model manifest from ``artifacts/model_manifest.json``
and caches all fitted models in memory to avoid repeated disk I/O during
concurrent API requests.
"""
from __future__ import annotations

import json
import logging
import threading
from pathlib import Path
from typing import Any, Optional

import joblib
import numpy as np

logger = logging.getLogger(__name__)

ARTIFACTS_DIR = Path(__file__).resolve().parents[3] / "artifacts"
MANIFEST_PATH = ARTIFACTS_DIR / "model_manifest.json"


class _ModelCache:
    """Internal cache — one instance per process, protected by a mutex."""

    def __init__(self) -> None:
        self._lock = threading.Lock()
        self._manifest: Optional[dict] = None
        self._models: dict[str, Any] = {}
        self._scaler: Optional[Any] = None

    def _load_manifest(self) -> dict:
        if not MANIFEST_PATH.exists():
            raise FileNotFoundError(
                f"Model manifest not found at '{MANIFEST_PATH}'. "
                "Run the training pipeline first:\n"
                "  python -m app.ai.training_pipeline"
            )
        with open(MANIFEST_PATH, "r") as f:
            return json.load(f)

    def get_manifest(self) -> dict:
        with self._lock:
            if self._manifest is None:
                self._manifest = self._load_manifest()
            return self._manifest

    def get_scaler(self) -> Any:
        with self._lock:
            if self._scaler is None:
                manifest = self._load_manifest() if self._manifest is None else self._manifest
                scaler_path = manifest["scaler_path"]
                logger.info(f"Loading scaler from '{scaler_path}'")
                self._scaler = joblib.load(scaler_path)
            return self._scaler

    def get_model(self, model_name: str) -> Any:
        with self._lock:
            if model_name not in self._models:
                manifest = self._load_manifest() if self._manifest is None else self._manifest
                if model_name not in manifest["models"]:
                    available = list(manifest["models"].keys())
                    raise ValueError(
                        f"Model '{model_name}' not found in manifest. "
                        f"Available: {available}"
                    )
                artifact_path = manifest["models"][model_name]["artifact_path"]
                logger.info(f"Loading model '{model_name}' from '{artifact_path}'")
                self._models[model_name] = joblib.load(artifact_path)
            return self._models[model_name]

    def invalidate(self) -> None:
        """Clear cache (call after re-training)."""
        with self._lock:
            self._manifest = None
            self._models.clear()
            self._scaler = None
            logger.info("Model cache invalidated.")


# Module-level singleton
_cache = _ModelCache()


class ModelRegistry:
    """
    Public interface for loading and querying trained model artifacts.

    All methods are thread-safe; models are loaded lazily on first access
    and cached in-process for subsequent API calls.
    """

    # ── Active model helpers ──────────────────────────────────────────────────

    @staticmethod
    def get_active_model_name() -> str:
        """Return the name of the currently active (best) model."""
        return _cache.get_manifest()["active_model"]

    @staticmethod
    def load_active_model() -> tuple[Any, Any, list[str]]:
        """
        Load the active (auto-selected best) model + scaler + feature column names.

        Returns
        -------
        (model, scaler, feature_columns)
        """
        manifest = _cache.get_manifest()
        active_name = manifest["active_model"]
        model = _cache.get_model(active_name)
        scaler = _cache.get_scaler()
        feature_columns = manifest["feature_columns"]
        return model, scaler, feature_columns

    @staticmethod
    def load_model_by_name(model_name: str) -> tuple[Any, Any, list[str]]:
        """
        Load a specific model by name (e.g. "XGBoost", "LightGBM", "RandomForest").

        Returns
        -------
        (model, scaler, feature_columns)
        """
        model = _cache.get_model(model_name)
        scaler = _cache.get_scaler()
        manifest = _cache.get_manifest()
        feature_columns = manifest["feature_columns"]
        return model, scaler, feature_columns

    # ── Metadata queries ──────────────────────────────────────────────────────

    @staticmethod
    def list_registered_models() -> list[dict]:
        """
        Return metadata for all registered models.

        Returns
        -------
        list of dicts with keys: model_name, version, metrics, is_active.
        """
        manifest = _cache.get_manifest()
        result = []
        for model_name, info in manifest["models"].items():
            result.append(
                {
                    "model_name": model_name,
                    "version": info["version"],
                    "is_active": info["is_active"],
                    "metrics": info["metrics"],
                    "artifact_path": info["artifact_path"],
                }
            )
        return sorted(result, key=lambda x: x["metrics"]["f1_macro"], reverse=True)

    @staticmethod
    def get_model_metrics(model_name: str) -> dict:
        """Return the full metrics dict for a specific model."""
        manifest = _cache.get_manifest()
        if model_name not in manifest["models"]:
            raise ValueError(f"Model '{model_name}' not in manifest.")
        return manifest["models"][model_name]["metrics"]

    @staticmethod
    def is_trained() -> bool:
        """Return True if a model manifest exists (training has been run)."""
        return MANIFEST_PATH.exists()

    @staticmethod
    def invalidate_cache() -> None:
        """Flush the in-memory model cache (e.g., after re-training)."""
        _cache.invalidate()
