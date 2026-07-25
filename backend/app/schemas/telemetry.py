from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class TelemetryCreate(BaseModel):
    tag: str
    name: str
    value: float
    unit: str
    min_limit: float
    max_limit: float
    status: str = "NORMAL"


class TelemetryResponse(BaseModel):
    id: UUID
    tag: str
    name: str
    value: float
    unit: str
    min_limit: float
    max_limit: float
    status: str
    timestamp: datetime

    class Config:
        from_attributes = True
