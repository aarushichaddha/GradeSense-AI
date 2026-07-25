from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional


class UploadHistoryResponse(BaseModel):
    id: UUID
    filename: str
    source_type: str
    total_rows: int
    cleaned_rows: int
    outliers_detected: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
