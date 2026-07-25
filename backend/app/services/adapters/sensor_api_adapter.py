from typing import List, Dict, Any
import pandas as pd
from app.services.adapters.base_adapter import BaseIngestionAdapter


class SensorAPIAdapter(BaseIngestionAdapter):
    """Adapter for REST API JSON telemetry payload streams."""

    async def extract_dataframe(self, payload: List[Dict[str, Any]]) -> pd.DataFrame:
        df = pd.DataFrame(payload)
        if "timestamp" not in df.columns or df["timestamp"].isnull().all():
            df["timestamp"] = pd.Timestamp.now()
        return df
