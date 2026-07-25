from abc import ABC, abstractmethod
from typing import Any, Dict, List
import pandas as pd


class BaseIngestionAdapter(ABC):
    """Abstract Base Class for all DCS telemetry ingestion source adapters."""

    @abstractmethod
    async def extract_dataframe(self, payload: Any) -> pd.DataFrame:
        """Converts incoming payload (file bytes, JSON payload, or stream) into a standardized Pandas DataFrame."""
        pass
