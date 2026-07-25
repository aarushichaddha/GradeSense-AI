from fastapi import APIRouter, HTTPException, status
from app.schemas.simulator import SimulationRequest, SimulationResponse
from app.services.simulator_service import digital_twin_service

router = APIRouter()


@router.post(
    "/run",
    response_model=SimulationResponse,
    summary="Run Digital Twin What-If Simulation",
    description="Simulates grade transition quality, off-spec risk score, stabilization timeline, waste paper tons, and section thermal loads in real-time based on what-if process parameters.",
)
async def run_simulation(req: SimulationRequest) -> SimulationResponse:
    try:
        return digital_twin_service.simulate(req)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Digital Twin Simulation failed: {str(e)}",
        )
