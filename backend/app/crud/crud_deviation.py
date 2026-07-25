from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.crud.base import CRUDBase
from app.models.deviation import QualityDeviation
from app.schemas.deviation import QualityDeviationCreate


class CRUDQualityDeviation(CRUDBase[QualityDeviation, QualityDeviationCreate, QualityDeviationCreate]):
    async def get_active_alarms(self, db: AsyncSession) -> List[QualityDeviation]:
        result = await db.execute(
            select(QualityDeviation).filter(QualityDeviation.status == "DETECTED")
        )
        return result.scalars().all()


crud_deviation = CRUDQualityDeviation(QualityDeviation)
