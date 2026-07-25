from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.machine import Machine
from app.schemas.machine import MachineCreate


class MachineService:
    async def list_machines(self, db: AsyncSession) -> List[Machine]:
        # Scaffold mock machine returns
        return [
            Machine(
                id="30000000-0000-0000-0000-000000000001",
                code="PM-01",
                name="Paper Machine #01 (Fine Writing)",
                plant_location="Pineville Mill - Line 1",
                max_speed_mpm=1400.0,
                is_active=True,
            ),
            Machine(
                id="30000000-0000-0000-0000-000000000002",
                code="PM-02",
                name="Paper Machine #02 (Linerboard)",
                plant_location="Pineville Mill - Line 2",
                max_speed_mpm=1200.0,
                is_active=True,
            ),
        ]


machine_service = MachineService()
