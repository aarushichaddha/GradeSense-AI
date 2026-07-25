import uuid
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.core.db import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    grade_transition_id = Column(UUID(as_uuid=True), ForeignKey("grade_transitions.id", ondelete="CASCADE"), nullable=True, index=True)
    prediction_id = Column(UUID(as_uuid=True), ForeignKey("predictions.id", ondelete="SET NULL"), nullable=True)
    
    # Core recommendation parameters
    action_type = Column(String(100), nullable=False)  # e.g., INCREASE_STEAM_PRESSURE, REDUCE_MACHINE_SPEED, INCREASE_STOCK_FLOW, REDUCE_FILLER_FLOW
    parameter_to_adjust = Column(String(100), nullable=False)
    current_setting = Column(String(50), nullable=False)
    recommended_setting = Column(String(50), nullable=False)
    unit = Column(String(20), nullable=False)
    
    # AI & Rule Engine metadata
    reason = Column(Text, nullable=False)
    confidence_score = Column(Float, nullable=False)  # 0.0 to 1.0
    expected_improvement = Column(String(255), nullable=False)  # e.g. "Reduces off-spec probability from 78% to 14%"
    historical_cases_count = Column(Integer, default=0, nullable=False)
    historical_success_rate = Column(Float, default=0.0, nullable=False)  # 0.0 to 1.0 (e.g. 0.94)
    priority = Column(String(20), default="MEDIUM", nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW
    
    # Operator feedback & lifecycle status
    status = Column(String(50), default="PENDING", nullable=False)  # PENDING, ACCEPTED, REJECTED, AUTO_APPLIED
    rejection_reason = Column(Text, nullable=True)
    operator_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)


# Class alias for backward compatibility across crud layer
AIRecommendation = Recommendation

