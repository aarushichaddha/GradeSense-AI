from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks, Form, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.services.csv_upload_service import CSVUploadService
from app.schemas.telemetry import TelemetryCreate, TelemetryResponse
from app.schemas.common import MessageResponse

router = APIRouter()
csv_service = CSVUploadService()


@router.post("/upload-csv", response_model=MessageResponse, summary="Upload Telemetry CSV via BackgroundTask")
async def upload_sensor_csv(
    background_tasks: BackgroundTasks,
    machine_id: str = Form(...),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    """Upload multi-megabyte CSV file containing DCS time-series telemetry. Processed asynchronously in BackgroundTasks."""
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File must be a CSV file")

    content = await file.read()
    background_tasks.add_task(csv_service.process_csv_telemetry, content, machine_id, db)

    return MessageResponse(
        message=f"CSV telemetry file '{file.filename}' queued for background processing on machine {machine_id}."
    )
