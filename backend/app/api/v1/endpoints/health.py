import shutil
import psutil
from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text
from app.core.db import get_db
from app.ai.model_loader import ModelRegistry

router = APIRouter()


@router.get("", summary="Comprehensive Production System Health Check")
async def health_check(response: Response, db: AsyncSession = Depends(get_db)):
    """Deep production health check probing PostgreSQL DB, ML Model registry, Memory, and Disk space."""
    health_status = "HEALTHY"
    db_status = "ONLINE"
    model_status = "LOADED" if ModelRegistry.is_trained() else "NOT_TRAINED"
    
    # 1. Probe Database Connection
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"UNHEALTHY: {str(e)}"
        health_status = "DEGRADED"
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    # 2. Probe System Memory
    memory = psutil.virtual_memory()
    memory_percent = memory.percent

    # 3. Probe Disk Space
    disk = shutil.disk_usage("/")
    disk_free_gb = round(disk.free / (1024 ** 3), 2)

    return {
        "status": health_status,
        "service": "GradeSense AI Backend",
        "version": "1.0.0",
        "database": db_status,
        "ml_engine": {
            "status": model_status,
            "active_model": ModelRegistry.get_active_model_name() if ModelRegistry.is_trained() else None,
        },
        "system_metrics": {
            "memory_usage_percent": memory_percent,
            "disk_free_gb": disk_free_gb,
        },
    }
