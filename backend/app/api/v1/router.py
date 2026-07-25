from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    users,
    machines,
    recipes,
    sensor_data,
    ingestion,
    grade_changes,
    predictions,
    recommendations,
    simulator,
    alerts,
    analytics,
    reports,
    admin,
    health,
)

api_v1_router = APIRouter()

api_v1_router.include_router(health.router, prefix="/health", tags=["Health & Diagnostics"])
api_v1_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_v1_router.include_router(users.router, prefix="/users", tags=["User CRUD & Profile"])
api_v1_router.include_router(machines.router, prefix="/machines", tags=["Machine CRUD"])
api_v1_router.include_router(recipes.router, prefix="/recipes", tags=["Recipe CRUD"])
api_v1_router.include_router(sensor_data.router, prefix="/sensor-data", tags=["Sensor Data"])
api_v1_router.include_router(ingestion.router, prefix="/ingestion", tags=["Data Ingestion & ETL Pipeline"])
api_v1_router.include_router(grade_changes.router, prefix="/grade-changes", tags=["Grade Transitions"])
api_v1_router.include_router(predictions.router, prefix="/predictions", tags=["ML Quality Predictions"])
api_v1_router.include_router(recommendations.router, prefix="/recommendations", tags=["Prescriptive AI Control"])
api_v1_router.include_router(simulator.router, prefix="/simulator", tags=["Digital Twin Simulator"])
api_v1_router.include_router(alerts.router, prefix="/alerts", tags=["Quality Deviation Alarms"])
api_v1_router.include_router(analytics.router, prefix="/analytics", tags=["Historical Analytics & Yield"])
api_v1_router.include_router(reports.router, prefix="/reports", tags=["Shift Reports"])
api_v1_router.include_router(admin.router, prefix="/admin", tags=["Admin System Management"])
