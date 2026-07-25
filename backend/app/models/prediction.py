import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.core.db import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    grade_transition_id = Column(UUID(as_uuid=True), ForeignKey("grade_transitions.id", ondelete="CASCADE"), nullable=False, index=True)
    ai_model_id = Column(UUID(as_uuid=True), ForeignKey("ai_models.id"), nullable=False)
    parameter_name = Column(String(50), nullable=False)
    predicted_value = Column(Float, nullable=False)
    confidence_score = Column(Float, nullable=False)
    horizon_time = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
