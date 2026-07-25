from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.services.analytics_service import analytics_service

router = APIRouter()


@router.get("/yield-summary", summary="Get Shift Yield & Transition Efficiency")
async def get_yield_summary(db: AsyncSession = Depends(get_db)):
    """Retrieve historical transition yield statistics, waste reduction, and cost savings."""
    return await analytics_service.get_shift_yield_summary(db)
