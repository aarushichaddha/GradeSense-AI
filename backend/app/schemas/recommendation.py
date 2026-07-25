from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, List


class GenerateRecommendationsRequest(BaseModel):
    grade_transition_id: Optional[UUID] = None
    machine_id: Optional[UUID] = None
    stock_flow_lpm: Optional[float] = 350.0
    steam_pressure_bar: Optional[float] = 5.5
    machine_speed_mpm: Optional[float] = 900.0
    moisture_pct: Optional[float] = 7.2
    basis_weight_gsm: Optional[float] = 120.0
    ash_pct: Optional[float] = 18.0
    caliper_um: Optional[float] = 140.0
    transition_time_min: Optional[float] = 25.0
    source_basis_weight: Optional[float] = 80.0
    source_speed: Optional[float] = 800.0
    source_steam: Optional[float] = 8.0
    source_moisture_target: Optional[float] = 6.0
    target_basis_weight: Optional[float] = 120.0
    target_speed: Optional[float] = 750.0
    target_steam: Optional[float] = 5.5
    target_moisture_target: Optional[float] = 6.5
    historical_offspec_rate: Optional[float] = 0.22


class AIRecommendationCreate(BaseModel):
    grade_transition_id: Optional[UUID] = None
    prediction_id: Optional[UUID] = None
    action_type: str
    parameter_to_adjust: str
    current_setting: str
    recommended_setting: str
    unit: str
    reason: str
    confidence_score: float
    expected_improvement: str
    historical_cases_count: int = 0
    historical_success_rate: float = 0.0
    priority: str = "MEDIUM"


class AIRecommendationResponse(BaseModel):
    id: UUID
    grade_transition_id: Optional[UUID] = None
    prediction_id: Optional[UUID] = None
    action_type: str
    parameter_to_adjust: str
    current_setting: str
    recommended_setting: str
    unit: str
    reason: str
    confidence_score: float
    expected_improvement: str
    historical_cases_count: int
    historical_success_rate: float
    priority: str
    status: str
    rejection_reason: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AcceptRecommendationRequest(BaseModel):
    operator_notes: Optional[str] = None


class RejectRecommendationRequest(BaseModel):
    rejection_reason: str = Field(..., min_length=3, description="Operator explanation for rejecting recommendation")
