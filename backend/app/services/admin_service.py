from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession


class AdminService:
    async def get_system_metrics(self, db: AsyncSession) -> Dict[str, Any]:
        return {
            "postgres_connection_pool": "HEALTHY",
            "active_db_sessions": 4,
            "opc_ua_telemetry_tags": 1420,
            "ingestion_rate_hz": 100,
            "ai_inference_engine": "ONLINE",
            "uptime_hours": 720.5,
        }


admin_service = AdminService()
