import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.core.db import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    grade_transition_id = Column(UUID(as_uuid=True), ForeignKey("grade_transitions.id", ondelete="CASCADE"), nullable=True)
    prediction_id = Column(UUID(as_uuid=True), ForeignKey("predictions.id", ondelete="SET NULL"), nullable=True)
    severity = Column(String(20), default="WARNING", nullable=False)  # NORMAL, WARNING, CRITICAL
    parameter_name = Column(String(50), nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String(50), default="DETECTED", nullable=False)  # DETECTED, ACKNOWLEDGED, MITIGATED
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
