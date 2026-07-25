from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class GradeSenseCreate(BaseModel):
    paper_machine_id: str
    source_grade_code: str
    target_grade_code: str
    estimated_duration_minutes: Optional[int] = 45


class GradeSenseResponse(BaseModel):
    id: UUID
    paper_machine_id: str
    source_grade_code: str
    target_grade_code: str
    status: str
    start_time: datetime
    estimated_completion_time: Optional[datetime]
    actual_completion_time: Optional[datetime]
    transition_progress_percent: float
    predicted_waste_tons: float

    class Config:
        from_attributes = True
