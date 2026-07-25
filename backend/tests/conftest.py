import pytest
import asyncio
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from main import app
from app.core.db import Base, get_db
from app.ai.feature_engineering import RawProcessInputs

# In-memory SQLite async database for testing
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestingSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="session", autouse=True)
async def setup_test_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
    async with TestingSessionLocal() as session:
        yield session


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as c:
        yield c


@pytest.fixture
def sample_raw_inputs() -> RawProcessInputs:
    return RawProcessInputs(
        stock_flow_lpm=350.0,
        steam_pressure_bar=5.5,
        machine_speed_mpm=900.0,
        moisture_pct=7.2,
        basis_weight_gsm=120.0,
        ash_pct=18.0,
        caliper_um=140.0,
        transition_time_min=25.0,
        source_basis_weight=80.0,
        source_speed=800.0,
        source_steam=8.0,
        source_moisture_target=6.0,
        target_basis_weight=120.0,
        target_speed=750.0,
        target_steam=5.5,
        target_moisture_target=6.5,
        historical_offspec_rate=0.22,
    )
