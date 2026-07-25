from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.crud.base import CRUDBase
from app.models.recommendation import AIRecommendation
from app.schemas.recommendation import AIRecommendationCreate


class CRUDRecommendation(CRUDBase[AIRecommendation, AIRecommendationCreate, AIRecommendationCreate]):
    async def get_pending_advisories(self, db: AsyncSession) -> List[AIRecommendation]:
        result = await db.execute(
            select(AIRecommendation).filter(AIRecommendation.status == "PENDING")
        )
        return result.scalars().all()


crud_recommendation = CRUDRecommendation(AIRecommendation)
