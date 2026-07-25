from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class AlertCreate(BaseModel):
    grade_transition_id: Optional[UUID] = None
    prediction_id: Optional[UUID] = None
    severity: str = "WARNING"
    parameter_name: str
    message: str


class AlertResponse(BaseModel):
    id: UUID
    grade_transition_id: Optional[UUID]
    prediction_id: Optional[UUID]
    severity: str
    parameter_name: str
    message: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
