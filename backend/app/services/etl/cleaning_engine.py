import logging
import numpy as np
import pandas as pd
from typing import Tuple, Dict, Any

logger = logging.getLogger(__name__)


class TelemetryDataCleaningEngine:
    """Automated ETL Data Cleaning Module for Paper Machine DCS Telemetry.
    Performs:
    1. Duplicate (tag, timestamp) removal.
    2. Missing value forward-fill & linear interpolation.
    3. Z-score (3σ) statistical outlier detection and anomaly trimming.
    4. Min-Max value normalization.
    """

    def clean_telemetry_dataframe(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        initial_rows = len(df)
        metrics = {
            "initial_rows": initial_rows,
            "duplicates_removed": 0,
            "missing_values_filled": 0,
            "outliers_detected": 0,
            "cleaned_rows": 0,
        }

        if df.empty:
            return df, metrics

        # 1. Remove Exact & Timestamp Duplicates
        if "tag" in df.columns and "timestamp" in df.columns:
            df = df.drop_duplicates(subset=["tag", "timestamp"], keep="last")
        else:
            df = df.drop_duplicates()
        metrics["duplicates_removed"] = initial_rows - len(df)

        # 2. Missing Value Imputation (Forward fill then mean interpolation)
        missing_count = df["value"].isnull().sum() if "value" in df.columns else 0
        if "value" in df.columns:
            df["value"] = df["value"].ffill().bfill().fillna(0.0)
        metrics["missing_values_filled"] = int(missing_count)

        # 3. Z-Score Outlier Detection (Threshold > 3.0 Standard Deviations)
        if "value" in df.columns and len(df) > 3:
            vals = df["value"].to_numpy()
            std = np.std(vals)
            if std > 0:
                mean = np.mean(vals)
                z_scores = np.abs((vals - mean) / std)
                outliers_mask = z_scores > 3.0
                outliers_count = int(np.sum(outliers_mask))
                metrics["outliers_detected"] = outliers_count
                
                # Cap outliers to ±3σ bounds to prevent model corruption
                lower_bound = mean - 3.0 * std
                upper_bound = mean + 3.0 * std
                df["value"] = np.clip(df["value"], lower_bound, upper_bound)

        # 4. Range Normalization (Min-Max Scaled feature column `normalized_value`)
        if "value" in df.columns:
            min_val = df["value"].min()
            max_val = df["value"].max()
            if max_val > min_val:
                df["normalized_value"] = (df["value"] - min_val) / (max_val - min_val)
            else:
                df["normalized_value"] = 0.5

        metrics["cleaned_rows"] = len(df)
        logger.info(f"Cleaned ETL batch: {metrics}")
        return df, metrics


cleaning_engine = TelemetryDataCleaningEngine()
