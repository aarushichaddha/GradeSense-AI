import uuid
from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.core.db import Base


class TelemetryData(Base):
    __tablename__ = "telemetry_data"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tag = Column(String(100), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    value = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False)
    min_limit = Column(Float, nullable=False)
    max_limit = Column(Float, nullable=False)
    status = Column(String(20), default="NORMAL")  # NORMAL, WARNING, CRITICAL
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
