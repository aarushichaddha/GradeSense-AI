from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.recipe import Recipe


class RecipeService:
    async def list_recipes(self, db: AsyncSession) -> List[Recipe]:
        return [
            Recipe(
                id="50000000-0000-0000-0000-000000000001",
                machine_id="30000000-0000-0000-0000-000000000001",
                paper_grade_id="40000000-0000-0000-0000-000000000001",
                setpoint_targets={"headbox_pressure_kPa": 142.0, "press_1_load_knm": 78.0, "dryer_group_3_bar": 3.57},
                is_active=True,
            )
        ]


recipe_service = RecipeService()
