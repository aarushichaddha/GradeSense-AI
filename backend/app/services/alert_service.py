from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.alert import Alert


class AlertService:
    async def get_active_alerts(self, db: AsyncSession) -> List[Alert]:
        return [
            Alert(
                id="70000000-0000-0000-0000-000000000001",
                severity="CRITICAL",
                parameter_name="MOISTURE_REEL",
                message="Reel moisture deviation predicted +1.4% above spec USL in 4 mins.",
                status="DETECTED",
            ),
            Alert(
                id="70000000-0000-0000-0000-000000000002",
                severity="WARNING",
                parameter_name="BASIS_WEIGHT",
                message="Basis weight offset -1.6 g/m² detected at scanner.",
                status="DETECTED",
            ),
        ]


alert_service = AlertService()
