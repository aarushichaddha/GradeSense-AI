# Import all models for Alembic autogenerate
from app.core.db import Base  # noqa
from app.models.user import User  # noqa
from app.models.grade_change import GradeSense  # noqa
from app.models.deviation import QualityDeviation  # noqa
from app.models.recommendation import AIRecommendation  # noqa
from app.models.telemetry import TelemetryData  # noqa
