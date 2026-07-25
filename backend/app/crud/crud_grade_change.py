from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.crud.base import CRUDBase
from app.models.grade_change import GradeSense
from app.schemas.grade_change import GradeSenseCreate


class CRUDGradeSense(CRUDBase[GradeSense, GradeSenseCreate, GradeSenseCreate]):
    async def get_active_by_machine(self, db: AsyncSession, *, paper_machine_id: str) -> List[GradeSense]:
        result = await db.execute(
            select(GradeSense).filter(
                GradeSense.paper_machine_id == paper_machine_id,
                GradeSense.status == "IN_TRANSITION"
            )
        )
        return result.scalars().all()


crud_grade_change = CRUDGradeSense(GradeSense)
