import logging
import pandas as pd
from typing import Any, Dict
from app.services.adapters.base_adapter import BaseIngestionAdapter

logger = logging.getLogger(__name__)


class MQTTIngestionAdapter(BaseIngestionAdapter):
    """Protocol Adapter Interface for MQTT Industrial IoT Broker (Future-Ready Plugin)."""

    def __init__(self, broker_url: str = "mqtt.paper-mill.internal", topic: str = "dcs/telemetry/#"):
        self.broker_url = broker_url
        self.topic = topic

    async def extract_dataframe(self, payload: Dict[str, Any]) -> pd.DataFrame:
        logger.info(f"Received MQTT telemetry message from topic {self.topic}")
        df = pd.DataFrame([payload])
        return df
