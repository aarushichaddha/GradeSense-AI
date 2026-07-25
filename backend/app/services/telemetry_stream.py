import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)


class TelemetryStreamService:
    """Service interface for OPC-UA / MQTT real-time DCS telemetry ingestion."""

    async def ingest_tag_buffer(self, tag_data: Dict[str, Any]) -> bool:
        """Ingest raw sensor payload into telemetry buffer."""
        logger.info(f"Ingested tag {tag_data.get('tag')} = {tag_data.get('value')}")
        return True
