from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.crud.base import CRUDBase
from app.models.telemetry import TelemetryData
from app.schemas.telemetry import TelemetryCreate


class CRUDTelemetry(CRUDBase[TelemetryData, TelemetryCreate, TelemetryCreate]):
    async def get_latest_by_tag(self, db: AsyncSession, *, tag: str) -> List[TelemetryData]:
        result = await db.execute(
            select(TelemetryData)
            .filter(TelemetryData.tag == tag)
            .order_by(TelemetryData.timestamp.desc())
            .limit(50)
        )
        return result.scalars().all()


crud_telemetry = CRUDTelemetry(TelemetryData)
