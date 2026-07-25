from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.crud.crud_grade_change import crud_grade_change
from app.schemas.grade_change import GradeSenseCreate, GradeSenseResponse

router = APIRouter()


@router.get("/", response_model=List[GradeSenseResponse])
async def list_grade_changes(
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve scheduled and historical paper grade change transitions."""
    return await crud_grade_change.get_multi(db, skip=skip, limit=limit)


@router.post("/", response_model=GradeSenseResponse)
async def schedule_grade_change(
    grade_change_in: GradeSenseCreate,
    db: AsyncSession = Depends(get_db),
):
    """Schedule a new paper grade change on a paper machine."""
    return await crud_grade_change.create(db, obj_in=grade_change_in)
