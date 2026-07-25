from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import Base, engine
from app.core.security import get_password_hash
from app.models.user import User


async def init_db(db: AsyncSession) -> None:
    # Create tables if not exist (scaffold initialization)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed initial Plant Admin / Lead Operator user if not exists
    # Scaffold setup
    pass
