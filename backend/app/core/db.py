import logging
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config import settings

logger = logging.getLogger(__name__)

# Fallback to local SQLite file database if PostgreSQL is not active locally
# Handle Supabase / Cloud Postgres URL schemes (postgres:// or postgresql:// -> postgresql+asyncpg://)
db_url = settings.DATABASE_URL
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql+asyncpg://", 1)
elif db_url.startswith("postgresql://"):
    db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# Handle unencoded '@' in password (e.g. postgres:Aarushi@2004@db...)
if db_url.count("@") > 1 and "://" in db_url:
    scheme, rest = db_url.split("://", 1)
    user_pass_host_db = rest.rsplit("@", 1)
    if ":" in user_pass_host_db[0]:
        user, pwd = user_pass_host_db[0].split(":", 1)
        pwd_encoded = pwd.replace("@", "%40")
        db_url = f"{scheme}://{user}:{pwd_encoded}@{user_pass_host_db[1]}"

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
