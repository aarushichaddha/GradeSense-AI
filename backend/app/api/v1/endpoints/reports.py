from typing import Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.core.deps import get_current_active_user
from app.services.report_service import report_service
from app.models.user import User

router = APIRouter()


@router.post("/generate", summary="Generate Shift Yield Report")
async def generate_report(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Generate shift yield and transition summary report."""
    return await report_service.generate_shift_report(str(current_user.id), db)
