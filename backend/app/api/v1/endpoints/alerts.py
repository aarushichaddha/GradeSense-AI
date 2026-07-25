from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.services.alert_service import alert_service
from app.schemas.alert import AlertResponse

router = APIRouter()


@router.get("/", response_model=List[AlertResponse], summary="List Active Quality Deviation Alarms")
async def get_alerts(db: AsyncSession = Depends(get_db)):
    """Retrieve active and historical quality alarms."""
    return await alert_service.get_active_alerts(db)
