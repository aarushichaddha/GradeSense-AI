import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_api_health_endpoint(client: AsyncClient):
    response = await client.get("/api/v1/predictions/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data


@pytest.mark.asyncio
async def test_api_predictions_infer(client: AsyncClient):
    payload = {
        "stock_flow_lpm": 350.0,
        "steam_pressure_bar": 5.5,
        "machine_speed_mpm": 900.0,
        "moisture_pct": 7.2,
        "basis_weight_gsm": 120.0,
        "ash_pct": 18.0,
        "caliper_um": 140.0,
        "transition_time_min": 25.0,
        "source_basis_weight": 80.0,
        "source_speed": 800.0,
        "source_steam": 8.0,
        "source_moisture_target": 6.0,
        "target_basis_weight": 120.0,
        "target_speed": 750.0,
        "target_steam": 5.5,
        "target_moisture_target": 6.5,
        "historical_offspec_rate": 0.22,
    }
    response = await client.post("/api/v1/predictions/infer", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert "off_spec_probability" in data
    assert "risk_label" in data
    assert "confidence_score" in data
    assert data["risk_label"] in ["NORMAL", "WARNING", "CRITICAL", "UNKNOWN"]
