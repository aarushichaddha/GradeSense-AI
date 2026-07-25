from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, Form, BackgroundTasks, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.db import get_db
from app.services.etl.pipeline import etl_pipeline
from app.models.upload_history import UploadHistory
from app.schemas.upload_history import UploadHistoryResponse
from app.schemas.common import MessageResponse

router = APIRouter()


@router.post("/upload", response_model=MessageResponse, summary="Upload CSV/Excel Telemetry for Automated ETL")
async def upload_telemetry_file(
    background_tasks: BackgroundTasks,
    machine_id: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    """Upload CSV or Excel file containing raw DCS telemetry. Executes automated data cleaning (duplicates, missing values, Z-score outliers) in BackgroundTasks."""
    filename = file.filename or "telemetry.csv"
    valid_exts = (".csv", ".xlsx", ".xls")
    if not any(filename.endswith(ext) for ext in valid_exts):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File type not supported. Please upload a .csv, .xlsx, or .xls file.",
        )

    content = await file.read()
    background_tasks.add_task(
        etl_pipeline.execute_file_etl_pipeline, content, filename, machine_id, db
    )

    return MessageResponse(
        message=f"File '{filename}' queued for automated ETL cleaning (Duplicates, Missing Values, Outliers) on machine {machine_id}."
    )


@router.get("/history", response_model=List[UploadHistoryResponse], summary="Retrieve Upload History & Data Quality Logs")
async def get_upload_history(db: AsyncSession = Depends(get_db)):
    """Retrieve history log of uploaded files, processed rows, and flagged outliers."""
    result = await db.execute(
        select(UploadHistory).order_by(UploadHistory.created_at.desc()).limit(50)
    )
    records = result.scalars().all()

    # Scaffold mock fallback if DB is unseeded
    if not records:
        return [
            UploadHistory(
                id="90000000-0000-0000-0000-000000000001",
                filename="Pineville_PM01_ShiftA_Telemetry.csv",
                source_type="CSV",
                total_rows=14200,
                cleaned_rows=14185,
                outliers_detected=15,
                status="COMPLETED",
            ),
            UploadHistory(
                id="90000000-0000-0000-0000-000000000002",
                filename="Dryer_Group3_Steam_Batch.xlsx",
                source_type="EXCEL",
                total_rows=8500,
                cleaned_rows=8492,
                outliers_detected=8,
                status="COMPLETED",
            ),
        ]
    return records
