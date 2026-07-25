from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Dict, Any, Optional


class RecipeCreate(BaseModel):
    machine_id: UUID
    paper_grade_id: UUID
    setpoint_targets: Dict[str, Any]


class RecipeUpdate(BaseModel):
    setpoint_targets: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


class RecipeResponse(BaseModel):
    id: UUID
    machine_id: UUID
    paper_grade_id: UUID
    setpoint_targets: Dict[str, Any]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
