from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.crud.crud_telemetry import crud_telemetry
from app.schemas.telemetry import TelemetryResponse

router = APIRouter()


@router.get("/live", response_model=List[TelemetryResponse])
async def get_live_telemetry(db: AsyncSession = Depends(get_db)):
    """Retrieve real-time DCS telemetry stream tags."""
    return await crud_telemetry.get_multi(db, limit=50)
