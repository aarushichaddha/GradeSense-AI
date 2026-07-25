from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.services.machine_service import machine_service
from app.schemas.machine import MachineResponse, MachineCreate

router = APIRouter()


@router.get("/", response_model=List[MachineResponse], summary="List Paper Machines")
async def get_machines(db: AsyncSession = Depends(get_db)):
    """Retrieve list of configured paper machines (PM-01, PM-02)."""
    return await machine_service.list_machines(db)
