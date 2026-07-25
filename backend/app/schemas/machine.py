from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class MachineCreate(BaseModel):
    code: str
    name: str
    plant_location: str
    max_speed_mpm: Optional[float] = 1500.0


class MachineUpdate(BaseModel):
    name: Optional[str] = None
    plant_location: Optional[str] = None
    max_speed_mpm: Optional[float] = None
    is_active: Optional[bool] = None


class MachineResponse(BaseModel):
    id: UUID
    code: str
    name: str
    plant_location: str
    max_speed_mpm: float
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
