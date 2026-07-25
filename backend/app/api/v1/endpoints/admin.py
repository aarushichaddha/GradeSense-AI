from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.core.deps import get_current_admin_user
from app.services.admin_service import admin_service

router = APIRouter()


@router.get("/system-metrics", summary="Get DCS Backend System Metrics")
async def get_system_metrics(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_admin_user),
):
    """Retrieve database health, OPC-UA ingestion throughput, and background task statuses."""
    return await admin_service.get_system_metrics(db)
