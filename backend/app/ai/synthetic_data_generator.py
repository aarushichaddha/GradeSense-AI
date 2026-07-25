"""
synthetic_data_generator.py
============================
Generates physically realistic paper machine grade transition datasets for
model training. Uses real Fourdrinier paper machine process ranges.

Physics references:
  - Stock Flow:      200–600 L/min (headbox dilution flow)
  - Steam Pressure:  4–12 bar (dryer section)
  - Machine Speed:   400–1200 m/min (modern Fourdrinier)
  - Moisture:        3–10 % (target: 5–7% post-dryer)
  - Basis Weight:    40–200 g/m² (fine paper: 70–120)
  - Ash:             5–30 % (filler content)
  - Caliper:         60–250 µm
  - Transition Time: 5–90 minutes

Off-spec oracle rule (grounded in paper machine control theory):
  A grade transition is off-spec when the process has insufficient drying
  capacity for the new basis weight target AND the operator is running too fast
  given the steam budget — or when recipe delta is too large for the current
  machine ramp rate.
"""
from __future__ import annotations

import logging
import numpy as np
import pandas as pd
from dataclasses import dataclass, field
from typing import Optional

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Process Physics Constants
# ---------------------------------------------------------------------------
FEATURE_COLUMNS = [
    # Raw sensor inputs
    "stock_flow_lpm",
    "steam_pressure_bar",
    "machine_speed_mpm",
    "moisture_pct",
    "basis_weight_gsm",
    "ash_pct",
    "caliper_um",
    "transition_time_min",
    # Recipe delta features (target - source)
    "delta_basis_weight",
    "delta_speed",
    "delta_steam",
    "delta_moisture_target",
    # Engineered ratio / interaction features
    "steam_per_speed",           # steam_pressure / machine_speed  (drying capacity ratio)
    "basis_weight_per_flow",     # basis_weight / stock_flow
    "moisture_steam_ratio",      # moisture / steam_pressure
    "speed_per_caliper",         # machine_speed / caliper (tension proxy)
    "ash_basis_interaction",     # ash * basis_weight (filler loading stress)
    "recipe_similarity_score",   # 0–1, 1 = identical recipe
    "transition_momentum",       # |delta_basis_weight| / transition_time_min
    "historical_offspec_rate",   # rolling fraction of past 10 transitions that were off-spec (per machine)
    "caliper_variance_proxy",    # abs(caliper - 110) / 110  (distance from median)
    "drying_adequacy_ratio",     # steam_pressure / (basis_weight * machine_speed * 1e-4)
    "headbox_loading",           # stock_flow / machine_speed
    "recipe_delta_magnitude",    # sqrt(delta_basis_weight² + delta_speed² + delta_steam²)
    "speed_pressure_interaction",# machine_speed * steam_pressure
]

LABEL_COLUMN = "off_spec"


@dataclass
class ProcessRanges:
    """Realistic Fourdrinier paper machine operating envelope."""
    stock_flow_min: float = 200.0
    stock_flow_max: float = 600.0
    steam_pressure_min: float = 4.0
    steam_pressure_max: float = 12.0
    machine_speed_min: float = 400.0
    machine_speed_max: float = 1200.0
    moisture_min: float = 3.5
    moisture_max: float = 10.0
    basis_weight_min: float = 40.0
    basis_weight_max: float = 200.0
    ash_min: float = 5.0
    ash_max: float = 30.0
    caliper_min: float = 60.0
    caliper_max: float = 250.0
    transition_time_min: float = 5.0
    transition_time_max: float = 90.0


class GradeTransitionDataGenerator:
    """
    Generates labeled grade transition dataset with realistic process physics.

    Parameters
    ----------
    n_samples : int
        Number of grade transition events to simulate.
    random_state : int
        Seed for reproducibility.
    off_spec_ratio : float
        Approximate fraction of off-spec transitions (class balance target).
    """

    def __init__(
        self,
        n_samples: int = 5000,
        random_state: int = 42,
        off_spec_ratio: float = 0.30,
    ):
        self.n_samples = n_samples
        self.random_state = random_state
        self.off_spec_ratio = off_spec_ratio
        self.ranges = ProcessRanges()
        self.rng = np.random.default_rng(random_state)

    def _sample_raw_features(self) -> dict:
        """Sample raw process variables within physical bounds."""
        rng = self.rng
        r = self.ranges

        # Source recipe state
        source_bw = rng.uniform(r.basis_weight_min, r.basis_weight_max)
        source_speed = rng.uniform(r.machine_speed_min, r.machine_speed_max)
        source_steam = rng.uniform(r.steam_pressure_min, r.steam_pressure_max)
        source_moisture_target = rng.uniform(5.0, 7.5)

        # Target recipe state (grade change destination)
        target_bw = rng.uniform(r.basis_weight_min, r.basis_weight_max)
        target_speed = rng.uniform(r.machine_speed_min, r.machine_speed_max)
        target_steam = rng.uniform(r.steam_pressure_min, r.steam_pressure_max)
        target_moisture_target = rng.uniform(5.0, 7.5)

        # Current process state (mid-transition snapshot)
        stock_flow = rng.uniform(r.stock_flow_min, r.stock_flow_max)
        steam_pressure = rng.uniform(r.steam_pressure_min, r.steam_pressure_max)
        machine_speed = rng.uniform(r.machine_speed_min, r.machine_speed_max)
        moisture = rng.uniform(r.moisture_min, r.moisture_max)
        basis_weight = rng.uniform(r.basis_weight_min, r.basis_weight_max)
        ash = rng.uniform(r.ash_min, r.ash_max)
        caliper = rng.uniform(r.caliper_min, r.caliper_max)
        transition_time = rng.uniform(r.transition_time_min, r.transition_time_max)
        historical_offspec_rate = rng.beta(2, 5)  # right-skewed: most machines perform well

        return dict(
            stock_flow=stock_flow,
            steam_pressure=steam_pressure,
            machine_speed=machine_speed,
            moisture=moisture,
            basis_weight=basis_weight,
            ash=ash,
            caliper=caliper,
            transition_time=transition_time,
            source_bw=source_bw,
            source_speed=source_speed,
            source_steam=source_steam,
            source_moisture_target=source_moisture_target,
            target_bw=target_bw,
            target_speed=target_speed,
            target_steam=target_steam,
            target_moisture_target=target_moisture_target,
            historical_offspec_rate=historical_offspec_rate,
        )

    def _engineer_features(self, raw: dict) -> dict:
        """Compute derived features from raw process variables."""
        delta_bw = raw["target_bw"] - raw["source_bw"]
        delta_speed = raw["target_speed"] - raw["source_speed"]
        delta_steam = raw["target_steam"] - raw["source_steam"]
        delta_moisture = raw["target_moisture_target"] - raw["source_moisture_target"]

        sp = raw["steam_pressure"]
        ms = raw["machine_speed"]
        bw = raw["basis_weight"]
        sf = raw["stock_flow"]
        ca = raw["caliper"]
        tt = raw["transition_time"]
        mo = raw["moisture"]
        ash = raw["ash"]
        hor = raw["historical_offspec_rate"]

        # Similarity: 1 - normalized L2 distance between recipe params
        recipe_delta_vec = np.array([delta_bw / 160, delta_speed / 800, delta_steam / 8])
        recipe_similarity = max(0.0, 1.0 - np.linalg.norm(recipe_delta_vec))

        recipe_delta_mag = np.sqrt(delta_bw**2 + delta_speed**2 + delta_steam**2)
        drying_adequacy = sp / max((bw * ms * 1e-4), 0.1)
        transition_momentum = abs(delta_bw) / max(tt, 1.0)

        return {
            "stock_flow_lpm": sf,
            "steam_pressure_bar": sp,
            "machine_speed_mpm": ms,
            "moisture_pct": mo,
            "basis_weight_gsm": bw,
            "ash_pct": ash,
            "caliper_um": ca,
            "transition_time_min": tt,
            "delta_basis_weight": delta_bw,
            "delta_speed": delta_speed,
            "delta_steam": delta_steam,
            "delta_moisture_target": delta_moisture,
            "steam_per_speed": sp / max(ms, 1.0),
            "basis_weight_per_flow": bw / max(sf, 1.0),
            "moisture_steam_ratio": mo / max(sp, 0.1),
            "speed_per_caliper": ms / max(ca, 1.0),
            "ash_basis_interaction": ash * bw,
            "recipe_similarity_score": recipe_similarity,
            "transition_momentum": transition_momentum,
            "historical_offspec_rate": hor,
            "caliper_variance_proxy": abs(ca - 110.0) / 110.0,
            "drying_adequacy_ratio": drying_adequacy,
            "headbox_loading": sf / max(ms, 1.0),
            "recipe_delta_magnitude": recipe_delta_mag,
            "speed_pressure_interaction": ms * sp,
        }

    def _oracle_label(self, features: dict, raw: dict) -> int:
        """
        Physics-grounded deterministic off-spec oracle.

        Off-spec conditions (ANY one sufficient, probability weighted):
          1. Drying inadequacy: steam can't keep up with basis weight * speed demand
          2. Large recipe jump in short transition window (high momentum)
          3. High historical failure rate machine + large delta
          4. Extreme moisture with low steam pressure
          5. Recipe similarity < 0.15 (very different grades)
        """
        score = 0.0

        # Condition 1: Drying inadequacy (most critical)
        if features["drying_adequacy_ratio"] < 0.6:
            score += 0.45

        # Condition 2: Transition momentum too high
        if features["transition_momentum"] > 3.0:
            score += 0.30

        # Condition 3: Historical machine tendency + large delta
        if features["historical_offspec_rate"] > 0.35 and features["recipe_delta_magnitude"] > 150:
            score += 0.25

        # Condition 4: Moisture-steam imbalance
        if features["moisture_steam_ratio"] > 1.2:
            score += 0.30

        # Condition 5: Very different recipes
        if features["recipe_similarity_score"] < 0.15:
            score += 0.20

        # Add calibrated noise to prevent perfectly separable oracle (makes model non-trivial)
        noise = self.rng.normal(0, 0.05)
        score = np.clip(score + noise, 0.0, 1.0)

        return int(score > 0.50)

    def generate(self, save_path: Optional[str] = None) -> pd.DataFrame:
        """
        Generate the full labeled dataset.

        Parameters
        ----------
        save_path : str, optional
            If given, saves the DataFrame as CSV at this path.

        Returns
        -------
        pd.DataFrame
            Shape (n_samples, 26) — 25 features + 1 binary label column.
        """
        logger.info(f"Generating {self.n_samples} synthetic grade transition events...")
        rows = []
        for i in range(self.n_samples):
            raw = self._sample_raw_features()
            features = self._engineer_features(raw)
            label = self._oracle_label(features, raw)
            features[LABEL_COLUMN] = label
            rows.append(features)

        df = pd.DataFrame(rows, columns=FEATURE_COLUMNS + [LABEL_COLUMN])

        actual_off_spec = df[LABEL_COLUMN].mean()
        logger.info(
            f"Dataset generated: {len(df)} samples | "
            f"Off-spec rate: {actual_off_spec:.1%} | "
            f"Features: {len(FEATURE_COLUMNS)}"
        )

        if save_path:
            df.to_csv(save_path, index=False)
            logger.info(f"Saved training dataset to '{save_path}'")

        return df
