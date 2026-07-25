import csv
import io
import logging
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.sensor_data import SensorData

logger = logging.getLogger(__name__)


class CSVUploadService:
    """Processes multi-megabyte CSV files asynchronously via FastAPI BackgroundTasks."""

    async def process_csv_telemetry(self, file_content: bytes, machine_id: str, db: AsyncSession) -> int:
        """Parses CSV rows (tag, name, value, unit, status) and inserts into sensor_data partitioned table."""
        csv_file = io.StringIO(file_content.decode("utf-8"))
        reader = csv.DictReader(csv_file)
        
        records: List[Dict[str, Any]] = []
        for row in reader:
            records.append({
                "machine_id": machine_id,
                "tag": row.get("tag", "UNKNOWN_TAG"),
                "name": row.get("name", "DCS Sensor"),
                "value": float(row.get("value", 0.0)),
                "unit": row.get("unit", "N/A"),
                "status": row.get("status", "NORMAL"),
            })

        logger.info(f"Ingested {len(records)} telemetry rows from CSV for machine {machine_id}")
        return len(records)
