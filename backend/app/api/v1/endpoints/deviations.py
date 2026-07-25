from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.crud.crud_deviation import crud_deviation
from app.schemas.deviation import QualityDeviationCreate, QualityDeviationResponse

router = APIRouter()


@router.get("/active", response_model=List[QualityDeviationResponse])
async def get_active_deviations(db: AsyncSession = Depends(get_db)):
    """Retrieve active quality deviation alarms detected by AI."""
    return await crud_deviation.get_active_alarms(db)


@router.post("/", response_model=QualityDeviationResponse)
async def log_deviation(
    deviation_in: QualityDeviationCreate,
    db: AsyncSession = Depends(get_db),
):
    """Log a detected quality deviation."""
    return await crud_deviation.create(db, obj_in=deviation_in)
