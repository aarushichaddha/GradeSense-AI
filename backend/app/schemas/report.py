from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Dict, Any


class ReportCreate(BaseModel):
    title: str
    report_type: str
    summary_data: Dict[str, Any]


class ReportResponse(BaseModel):
    id: UUID
    generated_by_user_id: UUID
    title: str
    report_type: str
    summary_data: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True
