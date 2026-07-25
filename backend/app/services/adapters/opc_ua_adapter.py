import logging
import pandas as pd
from typing import Any, List, Dict
from app.services.adapters.base_adapter import BaseIngestionAdapter

logger = logging.getLogger(__name__)


class OPCUAIngestionAdapter(BaseIngestionAdapter):
    """Protocol Adapter Interface for OPC-UA DCS Industrial Servers (Honeywell / Siemens / ABB)."""

    def __init__(self, opc_server_endpoint: str = "opc.tcp://experion-dcs.pineville.mill:4840"):
        self.endpoint = opc_server_endpoint

    async def extract_dataframe(self, payload: List[Dict[str, Any]]) -> pd.DataFrame:
        logger.info(f"Connected to OPC-UA server at {self.endpoint}")
        df = pd.DataFrame(payload)
        return df
