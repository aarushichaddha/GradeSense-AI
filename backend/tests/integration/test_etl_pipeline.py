import pytest
import pandas as pd
from app.services.etl.cleaning_engine import cleaning_engine


def test_cleaning_engine_duplicates_and_outliers():
    # Construct raw DataFrame with duplicate timestamps and 1 extreme outlier
    raw_data = {
        "tag": ["PM01_MOISTURE"] * 10,
        "timestamp": [
            "2026-07-25T10:00:00Z",
            "2026-07-25T10:00:00Z",  # duplicate
            "2026-07-25T10:01:00Z",
            "2026-07-25T10:02:00Z",
            "2026-07-25T10:03:00Z",
            "2026-07-25T10:04:00Z",
            "2026-07-25T10:05:00Z",
            "2026-07-25T10:06:00Z",
            "2026-07-25T10:07:00Z",
            "2026-07-25T10:08:00Z",
        ],
        "value": [6.2, 6.2, 6.3, 6.1, 6.2, 99.0, 6.2, 6.3, 6.1, 6.2],  # 99.0 is extreme outlier
        "unit": ["%"] * 10,
        "status": ["GOOD"] * 10,
    }
    df = pd.DataFrame(raw_data)

    cleaned_df, metrics = cleaning_engine.clean_telemetry_dataframe(df)

    assert len(cleaned_df) == 9  # 1 duplicate removed
    assert metrics["duplicates_removed"] == 1
    assert metrics["outliers_detected"] >= 1
    assert cleaned_df["value"].max() < 50.0  # outlier clipped
