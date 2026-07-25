import uuid
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.core.db import Base


class UploadHistory(Base):
    __tablename__ = "upload_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    filename = Column(String(255), nullable=False)
    source_type = Column(String(50), nullable=False)  # CSV, EXCEL, SENSOR_API, MQTT, OPC_UA
    total_rows = Column(Integer, default=0, nullable=False)
    cleaned_rows = Column(Integer, default=0, nullable=False)
    outliers_detected = Column(Integer, default=0, nullable=False)
    status = Column(String(50), default="PROCESSING", nullable=False)  # PROCESSING, COMPLETED, FAILED
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
