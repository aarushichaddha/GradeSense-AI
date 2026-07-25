from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_db
from app.core.deps import get_current_admin_user, PaginationParams
from app.services.user_service import user_service
from app.schemas.user import UserResponse, UserCreate
from app.schemas.common import PaginatedResponse

router = APIRouter()


@router.get("/", response_model=List[UserResponse], summary="List Plant Users")
async def list_users(
    pagination: PaginationParams = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_admin_user),
):
    """Retrieve paginated list of registered plant operators and control engineers."""
    items, _ = await user_service.get_users_paginated(db, skip=pagination.skip, limit=pagination.size)
    return items
