import uuid
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.core.db import Base


class GradeSense(Base):
    __tablename__ = "grade_transitions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    machine_id = Column(UUID(as_uuid=True), ForeignKey("machines.id"), nullable=False, index=True)
    source_grade_id = Column(UUID(as_uuid=True), ForeignKey("paper_grades.id"), nullable=False)
    target_grade_id = Column(UUID(as_uuid=True), ForeignKey("paper_grades.id"), nullable=False)
    status = Column(String(50), default="SCHEDULED", nullable=False)
    progress_percent = Column(Float, default=0.0, nullable=False)
    predicted_waste_tons = Column(Float, default=0.0, nullable=False)
    start_time = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    estimated_completion_time = Column(DateTime(timezone=True), nullable=True)
    actual_completion_time = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
