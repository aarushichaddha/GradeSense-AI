import io
import pandas as pd
from app.services.adapters.base_adapter import BaseIngestionAdapter


class CSVExcelAdapter(BaseIngestionAdapter):
    """Adapter for CSV and Excel (.xlsx, .xls) file uploads."""

    async def extract_dataframe(self, payload: bytes, filename: str = "data.csv") -> pd.DataFrame:
        if filename.endswith(".xlsx") or filename.endswith(".xls"):
            df = pd.read_excel(io.BytesIO(payload))
        else:
            df = pd.read_csv(io.BytesIO(payload))

        # Standardize expected columns: tag, name, value, unit, status, timestamp
        expected_cols = ["tag", "name", "value", "unit", "status", "timestamp"]
        for col in expected_cols:
            if col not in df.columns:
                if col == "status":
                    df["status"] = "NORMAL"
                elif col == "unit":
                    df["unit"] = "N/A"
                elif col == "name":
                    df["name"] = df.get("tag", "DCS_TAG")
                elif col == "timestamp":
                    df["timestamp"] = pd.Timestamp.now()

        return df
