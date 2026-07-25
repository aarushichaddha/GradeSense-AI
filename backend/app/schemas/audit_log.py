from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Dict, Any, Optional


class AuditLogResponse(BaseModel):
    id: UUID
    user_id: Optional[UUID]
    action: str
    target_entity: str
    details: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True
