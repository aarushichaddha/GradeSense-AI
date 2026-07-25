from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class QualityDeviationCreate(BaseModel):
    grade_change_id: UUID
    parameter_name: str
    target_value: float
    predicted_value: float
    deviation_percentage: float
    severity: str = "WARNING"
    time_to_deviation_minutes: float = 0.0
    root_cause_tag: Optional[str] = None


class QualityDeviationResponse(BaseModel):
    id: UUID
    grade_change_id: UUID
    parameter_name: str
    target_value: float
    predicted_value: float
    deviation_percentage: float
    severity: str
    time_to_deviation_minutes: float
    root_cause_tag: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
