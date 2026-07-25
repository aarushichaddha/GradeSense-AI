import logging
from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.recommendation import Recommendation
from app.schemas.recommendation import (
    GenerateRecommendationsRequest,
    AIRecommendationResponse,
    AcceptRecommendationRequest,
    RejectRecommendationRequest,
)
from app.services.recommendation_engine import recommendation_engine
from app.ai.feature_engineering import RawProcessInputs

logger = logging.getLogger(__name__)


class CorrectiveAIService:
    """Service interface for persisting, fetching, accepting, and rejecting AI recommendations."""

    async def generate_and_store_recommendations(
        self, req: GenerateRecommendationsRequest, db: AsyncSession
    ) -> List[Recommendation]:
        raw_inputs = RawProcessInputs(
            stock_flow_lpm=req.stock_flow_lpm or 350.0,
            steam_pressure_bar=req.steam_pressure_bar or 5.5,
            machine_speed_mpm=req.machine_speed_mpm or 900.0,
            moisture_pct=req.moisture_pct or 7.2,
            basis_weight_gsm=req.basis_weight_gsm or 120.0,
            ash_pct=req.ash_pct or 18.0,
            caliper_um=req.caliper_um or 140.0,
            transition_time_min=req.transition_time_min or 25.0,
            source_basis_weight=req.source_basis_weight or 80.0,
            source_speed=req.source_speed or 800.0,
            source_steam=req.source_steam or 8.0,
            source_moisture_target=req.source_moisture_target or 6.0,
            target_basis_weight=req.target_basis_weight or 120.0,
            target_speed=req.target_speed or 750.0,
            target_steam=req.target_steam or 5.5,
            target_moisture_target=req.target_moisture_target or 6.5,
            historical_offspec_rate=req.historical_offspec_rate or 0.22,
        )

        recs_dto = recommendation_engine.generate_recommendations(raw_inputs)
        db_records = []

        for dto in recs_dto:
            rec_record = Recommendation(
                grade_transition_id=req.grade_transition_id,
                action_type=dto.action_type,
                parameter_to_adjust=dto.parameter_to_adjust,
                current_setting=dto.current_setting,
                recommended_setting=dto.recommended_setting,
                unit=dto.unit,
                reason=dto.reason,
                confidence_score=dto.confidence_score,
                expected_improvement=dto.expected_improvement,
                historical_cases_count=dto.historical_cases_count,
                historical_success_rate=dto.historical_success_rate,
                priority=dto.priority,
                status="PENDING",
            )
            db.add(rec_record)
            db_records.append(rec_record)

        await db.commit()
        for r in db_records:
            await db.refresh(r)

        return db_records

    async def list_recommendations(
        self, status_filter: Optional[str], db: AsyncSession
    ) -> List[Recommendation]:
        query = select(Recommendation).order_by(Recommendation.created_at.desc())
        if status_filter:
            query = query.where(Recommendation.status == status_filter.upper())
        result = await db.execute(query)
        records = result.scalars().all()
        return list(records)

    async def accept_recommendation(
        self, recommendation_id: UUID, req: Optional[AcceptRecommendationRequest], db: AsyncSession
    ) -> Recommendation:
        result = await db.execute(select(Recommendation).where(Recommendation.id == recommendation_id))
        rec = result.scalars().first()
        if not rec:
            raise ValueError(f"Recommendation '{recommendation_id}' not found.")

        rec.status = "ACCEPTED"
        await db.commit()
        await db.refresh(rec)
        return rec

    async def reject_recommendation(
        self, recommendation_id: UUID, req: RejectRecommendationRequest, db: AsyncSession
    ) -> Recommendation:
        result = await db.execute(select(Recommendation).where(Recommendation.id == recommendation_id))
        rec = result.scalars().first()
        if not rec:
            raise ValueError(f"Recommendation '{recommendation_id}' not found.")

        rec.status = "REJECTED"
        rec.rejection_reason = req.rejection_reason
        await db.commit()
        await db.refresh(rec)
        return rec


corrective_ai_service = CorrectiveAIService()
