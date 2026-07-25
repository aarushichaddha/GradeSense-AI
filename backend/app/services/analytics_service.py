from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession


class AnalyticsService:
    async def get_shift_yield_summary(self, db: AsyncSession) -> Dict[str, Any]:
        return {
            "avg_transition_duration_mins": 32.4,
            "waste_reduction_percent": 24.8,
            "tonnage_saved_this_shift": 4.8,
            "cost_savings_usd": 42500,
            "ai_accuracy_percent": 97.6,
        }


analytics_service = AnalyticsService()
