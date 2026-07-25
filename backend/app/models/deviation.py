import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.core.db import Base


class QualityDeviation(Base):
    __tablename__ = "quality_deviations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    grade_change_id = Column(UUID(as_uuid=True), ForeignKey("grade_changes.id"), nullable=False)
    parameter_name = Column(String(50), nullable=False)  # MOISTURE, BASIS_WEIGHT, TENSILE_MD, CALIPER
    target_value = Column(Float, nullable=False)
    predicted_value = Column(Float, nullable=False)
    deviation_percentage = Column(Float, nullable=False)
    severity = Column(String(20), default="WARNING")  # NORMAL, WARNING, CRITICAL
    time_to_deviation_minutes = Column(Float, default=0.0)
    root_cause_tag = Column(String(100), nullable=True)
    status = Column(String(50), default="DETECTED")  # DETECTED, ACKNOWLEDGED, MITIGATED
    created_at = Column(DateTime, default=datetime.utcnow)
