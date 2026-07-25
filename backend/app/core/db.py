import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

# Fallback to local SQLite file database if PostgreSQL is not active locally
db_url = settings.DATABASE_URL
is_sqlite = "sqlite" in db_url

if is_sqlite:
    engine = create_async_engine(db_url, echo=False, future=True)
else:
    try:
        engine = create_async_engine(
            db_url,
            echo=False,
            future=True,
            pool_size=10,
            max_overflow=20,
        )
    except Exception as e:
        logger.warning(f"PostgreSQL connection failed ({e}), falling back to local SQLite database.")
        db_url = "sqlite+aiosqlite:///./gradesense_dev.db"
        engine = create_async_engine(db_url, echo=False, future=True)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
