from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.services.recipe_service import recipe_service
from app.schemas.recipe import RecipeResponse

router = APIRouter()


@router.get("/", response_model=List[RecipeResponse], summary="List Grade Setpoint Recipes")
async def get_recipes(db: AsyncSession = Depends(get_db)):
    """Retrieve operational machine setpoint recipes for paper grades."""
    return await recipe_service.list_recipes(db)
