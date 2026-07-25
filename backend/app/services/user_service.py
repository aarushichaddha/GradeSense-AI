from typing import List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.crud_user import crud_user
from app.schemas.user import UserCreate
from app.models.user import User


class UserService:
    async def get_users_paginated(
        self, db: AsyncSession, *, skip: int = 0, limit: int = 20
    ) -> Tuple[List[User], int]:
        items = await crud_user.get_multi(db, skip=skip, limit=limit)
        return items, len(items)


user_service = UserService()
