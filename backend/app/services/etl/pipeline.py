import logging
from typing import Any, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.adapters.csv_excel_adapter import CSVExcelAdapter
from app.services.etl.cleaning_engine import cleaning_engine
from app.models.upload_history import UploadHistory

logger = logging.getLogger(__name__)


class IngestionETLPipeline:
    """End-to-End Orchestrator for Extraction, Cleaning Transformation, and DB Storage."""

    def __init__(self):
        self.csv_adapter = CSVExcelAdapter()
        self.cleaner = cleaning_engine

    async def execute_file_etl_pipeline(
        self, file_content: bytes, filename: str, machine_id: str, db: AsyncSession
    ) -> Dict[str, Any]:
        logger.info(f"Starting ETL Pipeline execution for file '{filename}'")

        # 1. Extraction via Adapter
        raw_df = await self.csv_adapter.extract_dataframe(file_content, filename)

        # 2. Automated Transformation & Cleaning Engine
        cleaned_df, cleaning_metrics = self.cleaner.clean_telemetry_dataframe(raw_df)

        # 3. Record in Upload History Registry
        history_record = UploadHistory(
            filename=filename,
            source_type="EXCEL" if (filename.endswith(".xlsx") or filename.endswith(".xls")) else "CSV",
            total_rows=cleaning_metrics["initial_rows"],
            cleaned_rows=cleaning_metrics["cleaned_rows"],
            outliers_detected=cleaning_metrics["outliers_detected"],
            status="COMPLETED",
        )
        db.add(history_record)
        await db.commit()
        await db.refresh(history_record)

        return {
            "upload_history_id": str(history_record.id),
            "filename": filename,
            "metrics": cleaning_metrics,
            "status": "COMPLETED",
        }


etl_pipeline = IngestionETLPipeline()
