from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class PredictionCreate(BaseModel):
    grade_transition_id: UUID
    ai_model_id: UUID
    parameter_name: str
    predicted_value: float
    confidence_score: float
    horizon_time: datetime


class PredictionResponse(BaseModel):
    id: UUID
    grade_transition_id: UUID
    ai_model_id: UUID
    parameter_name: str
    predicted_value: float
    confidence_score: float
    horizon_time: datetime
    created_at: datetime

    class Config:
        from_attributes = True
