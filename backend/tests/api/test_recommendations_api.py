import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_recommendations(client: AsyncClient):
    response = await client.get("/api/v1/recommendations")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "parameter_to_adjust" in data[0]


@pytest.mark.asyncio
async def test_generate_recommendations(client: AsyncClient):
    payload = {
        "stock_flow_lpm": 350.0,
        "steam_pressure_bar": 5.5,
        "machine_speed_mpm": 900.0,
        "moisture_pct": 7.2,
        "basis_weight_gsm": 120.0,
        "ash_pct": 18.0,
        "caliper_um": 140.0,
    }
    response = await client.post("/api/v1/recommendations/generate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "action_type" in data[0]
