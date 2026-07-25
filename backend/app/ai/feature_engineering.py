"""
feature_engineering.py
=======================
Transforms raw DCS process inputs from an active grade transition into the
25-dimensional feature vector expected by the trained ML classifier.

This module is the single source of truth for feature definitions — both
the training pipeline and the live inference engine use this class so that
feature computation is always identical between training and production.
"""
from __future__ import annotations

import logging
import numpy as np
from dataclasses import dataclass, field
from typing import Optional

logger = logging.getLogger(__name__)

# Canonical feature column order — must match synthetic_data_generator.FEATURE_COLUMNS
FEATURE_COLUMNS = [
    "stock_flow_lpm",
    "steam_pressure_bar",
    "machine_speed_mpm",
    "moisture_pct",
    "basis_weight_gsm",
    "ash_pct",
    "caliper_um",
    "transition_time_min",
    "delta_basis_weight",
    "delta_speed",
    "delta_steam",
    "delta_moisture_target",
    "steam_per_speed",
    "basis_weight_per_flow",
    "moisture_steam_ratio",
    "speed_per_caliper",
    "ash_basis_interaction",
    "recipe_similarity_score",
    "transition_momentum",
    "historical_offspec_rate",
    "caliper_variance_proxy",
    "drying_adequacy_ratio",
    "headbox_loading",
    "recipe_delta_magnitude",
    "speed_pressure_interaction",
]


@dataclass
class RawProcessInputs:
    """
    Raw process inputs captured from DCS/SCADA at the moment of inference.

    All fields correspond directly to physical sensor tags or recipe parameters.
    Values are validated against plausible operating bounds before feature
    computation.
    """
    # ── Live sensor readings ──────────────────────────────────────────────────
    stock_flow_lpm: float           # Headbox stock flow (L/min)
    steam_pressure_bar: float       # Dryer section steam pressure (bar)
    machine_speed_mpm: float        # Wire/fabric speed (m/min)
    moisture_pct: float             # Sheet moisture after press section (%)
    basis_weight_gsm: float         # Current basis weight measurement (g/m²)
    ash_pct: float                  # Ash/filler content (%)
    caliper_um: float               # Sheet caliper / thickness (µm)
    transition_time_min: float      # Elapsed transition time (minutes)

    # ── Source recipe (grade currently running) ───────────────────────────────
    source_basis_weight: float      # Target basis weight of source grade (g/m²)
    source_speed: float             # Design machine speed for source grade (m/min)
    source_steam: float             # Design steam pressure for source grade (bar)
    source_moisture_target: float   # Moisture target of source grade (%)

    # ── Target recipe (grade being transitioned to) ───────────────────────────
    target_basis_weight: float      # Target basis weight of target grade (g/m²)
    target_speed: float             # Design machine speed for target grade (m/min)
    target_steam: float             # Design steam pressure for target grade (bar)
    target_moisture_target: float   # Moisture target of target grade (%)

    # ── Historical context ────────────────────────────────────────────────────
    historical_offspec_rate: float = 0.15  # Fraction of recent transitions that were off-spec [0, 1]


class GradeSenseFeatureEngineer:
    """
    Computes the canonical 25-dimensional feature vector from raw process inputs.

    Usage
    -----
    engineer = GradeSenseFeatureEngineer()
    feature_array = engineer.build_feature_vector(raw_inputs)   # → np.ndarray shape (25,)
    feature_dict  = engineer.build_feature_dict(raw_inputs)     # → dict[str, float]
    """

    def build_feature_dict(self, raw: RawProcessInputs) -> dict[str, float]:
        """Compute all 25 features and return as an ordered dict."""
        sp = raw.steam_pressure_bar
        ms = raw.machine_speed_mpm
        bw = raw.basis_weight_gsm
        sf = raw.stock_flow_lpm
        ca = raw.caliper_um
        tt = raw.transition_time_min
        mo = raw.moisture_pct
        ash = raw.ash_pct

        # Recipe deltas (target − source)
        delta_bw = raw.target_basis_weight - raw.source_basis_weight
        delta_speed = raw.target_speed - raw.source_speed
        delta_steam = raw.target_steam - raw.source_steam
        delta_moisture = raw.target_moisture_target - raw.source_moisture_target

        # Recipe similarity: 1 − normalised L2 distance in recipe-parameter space
        recipe_delta_vec = np.array([
            delta_bw / 160.0,
            delta_speed / 800.0,
            delta_steam / 8.0,
        ])
        recipe_similarity = float(np.clip(1.0 - np.linalg.norm(recipe_delta_vec), 0.0, 1.0))

        # Compound features
        recipe_delta_magnitude = float(np.sqrt(delta_bw**2 + delta_speed**2 + delta_steam**2))
        drying_adequacy = sp / max(bw * ms * 1e-4, 0.1)
        transition_momentum = abs(delta_bw) / max(tt, 1.0)

        features = {
            "stock_flow_lpm":           sf,
            "steam_pressure_bar":       sp,
            "machine_speed_mpm":        ms,
            "moisture_pct":             mo,
            "basis_weight_gsm":         bw,
            "ash_pct":                  ash,
            "caliper_um":               ca,
            "transition_time_min":      tt,
            "delta_basis_weight":       delta_bw,
            "delta_speed":              delta_speed,
            "delta_steam":              delta_steam,
            "delta_moisture_target":    delta_moisture,
            "steam_per_speed":          sp / max(ms, 1.0),
            "basis_weight_per_flow":    bw / max(sf, 1.0),
            "moisture_steam_ratio":     mo / max(sp, 0.1),
            "speed_per_caliper":        ms / max(ca, 1.0),
            "ash_basis_interaction":    ash * bw,
            "recipe_similarity_score":  recipe_similarity,
            "transition_momentum":      transition_momentum,
            "historical_offspec_rate":  raw.historical_offspec_rate,
            "caliper_variance_proxy":   abs(ca - 110.0) / 110.0,
            "drying_adequacy_ratio":    drying_adequacy,
            "headbox_loading":          sf / max(ms, 1.0),
            "recipe_delta_magnitude":   recipe_delta_magnitude,
            "speed_pressure_interaction": ms * sp,
        }
        return features

    def build_feature_vector(self, raw: RawProcessInputs) -> np.ndarray:
        """
        Compute all features and return as a 1×25 numpy array in canonical column order.

        Returns
        -------
        np.ndarray
            Shape (1, 25) — ready for sklearn/xgboost model.predict_proba().
        """
        feature_dict = self.build_feature_dict(raw)
        vector = np.array([feature_dict[col] for col in FEATURE_COLUMNS], dtype=np.float64)
        return vector.reshape(1, -1)

    def get_feature_names(self) -> list[str]:
        """Return the canonical list of feature column names."""
        return list(FEATURE_COLUMNS)
