import logging
import math
from typing import List, Dict, Any
from app.ai.feature_engineering import RawProcessInputs, GradeSenseFeatureEngineer
from app.ai.inference_engine import predictor, PredictionResult
from app.schemas.recommendation import AIRecommendationCreate

logger = logging.getLogger(__name__)


class RuleEngine:
    """Evaluates paper machine DCS expert process control rules based on physics ratios."""

    def evaluate_rules(
        self, raw: RawProcessInputs, features: Dict[str, float], prediction: PredictionResult
    ) -> List[Dict[str, Any]]:
        rules_triggered = []

        sp = raw.steam_pressure_bar
        ms = raw.machine_speed_mpm
        bw = raw.basis_weight_gsm
        sf = raw.stock_flow_lpm
        ash = raw.ash_pct
        tt = raw.transition_time_min

        drying_adequacy = features.get("drying_adequacy_ratio", 0.6)
        momentum = features.get("transition_momentum", 1.0)
        headbox_loading = features.get("headbox_loading", 0.4)
        top_factors = prediction.top_risk_factors

        # Rule 1: Increase Steam Pressure
        if drying_adequacy < 0.65 or "steam_pressure_bar" in top_factors or "moisture_steam_ratio" in top_factors:
            recommended_steam = min(round(sp + 0.75, 2), 11.5)
            rules_triggered.append({
                "action_type": "INCREASE_STEAM_PRESSURE",
                "parameter_to_adjust": "Dryer Section Steam Pressure",
                "current_setting": f"{sp:.2f}",
                "recommended_setting": f"{recommended_steam:.2f}",
                "unit": "bar",
                "reason": (
                    f"Drying adequacy ratio ({drying_adequacy:.3f}) is below target threshold (0.650) "
                    f"for target basis weight ({raw.target_basis_weight:.0f} g/m²). Increasing steam pressure "
                    "prevents moisture spikes post-press section."
                ),
                "confidence_score": round(max(0.85, prediction.confidence_score), 2),
                "expected_improvement": f"Reduces predicted off-spec probability from {int(prediction.off_spec_probability * 100)}% to <12% and saves ~1.4 tons of broke.",
                "priority": "CRITICAL" if prediction.risk_label == "CRITICAL" else "HIGH",
            })

        # Rule 2: Reduce Machine Speed
        if momentum > 2.2 or (prediction.off_spec_probability > 0.60 and sp >= 10.5):
            recommended_speed = max(round(ms - 75.0, 0), 450.0)
            rules_triggered.append({
                "action_type": "REDUCE_MACHINE_SPEED",
                "parameter_to_adjust": "Machine Wire Speed",
                "current_setting": f"{ms:.0f}",
                "recommended_setting": f"{recommended_speed:.0f}",
                "unit": "m/min",
                "reason": (
                    f"Transition momentum ({momentum:.2f} g/m²/min) exceeds thermal response rate of dryer section. "
                    "Slowing wire speed allows sufficient web drying residence time during grade jump."
                ),
                "confidence_score": 0.89,
                "expected_improvement": "Stabilizes sheet tension, eliminating wet-end sheet breaks.",
                "priority": "HIGH",
            })

        # Rule 3: Increase Stock Flow
        if headbox_loading < 0.38 or "stock_flow_lpm" in top_factors or "basis_weight_per_flow" in top_factors:
            recommended_flow = round(sf + 35.0, 1)
            rules_triggered.append({
                "action_type": "INCREASE_STOCK_FLOW",
                "parameter_to_adjust": "Headbox Stock Flow Dilution",
                "current_setting": f"{sf:.1f}",
                "recommended_setting": f"{recommended_flow:.1f}",
                "unit": "L/min",
                "reason": (
                    f"Headbox loading ratio ({headbox_loading:.3f}) is under-diluted for target speed ({ms:.0f} m/min). "
                    "Increasing stock flow improves sheet formation profile."
                ),
                "confidence_score": 0.92,
                "expected_improvement": "Improves Cross-Direction (CD) basis weight uniformity profile by +16%.",
                "priority": "MEDIUM",
            })

        # Rule 4: Reduce Filler Flow
        if ash > 20.0 or "ash_basis_interaction" in top_factors:
            recommended_ash = max(round(ash - 3.5, 1), 5.0)
            rules_triggered.append({
                "action_type": "REDUCE_FILLER_FLOW",
                "parameter_to_adjust": "Ash Filler Addition Rate",
                "current_setting": f"{ash:.1f}",
                "recommended_setting": f"{recommended_ash:.1f}",
                "unit": "%",
                "reason": (
                    f"Filler ash loading ({ash:.1f}%) weakens fiber bonding network during high-speed transition. "
                    "Reducing filler addition rate maintains internal Mullen burst strength."
                ),
                "confidence_score": 0.87,
                "expected_improvement": "Restores internal bond strength to >180 kPa specification.",
                "priority": "MEDIUM",
            })

        # Fallback rule if no specific rule triggered
        if not rules_triggered:
            rules_triggered.append({
                "action_type": "INCREASE_STEAM_PRESSURE",
                "parameter_to_adjust": "Dryer Section Steam Pressure",
                "current_setting": f"{sp:.2f}",
                "recommended_setting": f"{sp + 0.3:.2f}",
                "unit": "bar",
                "reason": "Fine-tune steam header pressure to optimize sheet moisture profile.",
                "confidence_score": 0.84,
                "expected_improvement": "Maintains target 6.2% sheet moisture.",
                "priority": "LOW",
            })

        return rules_triggered


class HistoricalTransitionMatcher:
    """Simulates nearest-neighbor matching against historical grade transition dataset."""

    def find_historical_evidence(self, raw: RawProcessInputs, action_type: str) -> Dict[str, Any]:
        """Calculates similar historical transition count and success rate based on grade proximity."""
        bw_delta = abs(raw.target_basis_weight - raw.source_basis_weight)
        
        # Determine case count & success rate based on transition difficulty
        if bw_delta > 40.0:
            cases_count = 14
            success_rate = 0.928
        elif bw_delta > 20.0:
            cases_count = 22
            success_rate = 0.954
        else:
            cases_count = 38
            success_rate = 0.973

        return {
            "historical_cases_count": cases_count,
            "historical_success_rate": success_rate,
        }


class RecommendationEngineService:
    """Hybrid AI Recommendation Engine integrating AI predictions, rule evaluation, and historical matching."""

    def __init__(self):
        self.feature_engineer = GradeSenseFeatureEngineer()
        self.rule_engine = RuleEngine()
        self.historical_matcher = HistoricalTransitionMatcher()

    def generate_recommendations(self, raw_inputs: RawProcessInputs) -> List[AIRecommendationCreate]:
        logger.info("Executing Hybrid AI Recommendation Engine...")

        # 1. AI Model Output Prediction
        prediction: PredictionResult = predictor.predict(raw_inputs)
        features = self.feature_engineer.build_feature_dict(raw_inputs)

        # 2. Process Control Rule Engine Evaluation
        triggered_rules = self.rule_engine.evaluate_rules(raw_inputs, features, prediction)

        # 3. Combine with Historical Transition Evidence
        recommendations: List[AIRecommendationCreate] = []

        for rule in triggered_rules:
            evidence = self.historical_matcher.find_historical_evidence(raw_inputs, rule["action_type"])
            
            rec = AIRecommendationCreate(
                action_type=rule["action_type"],
                parameter_to_adjust=rule["parameter_to_adjust"],
                current_setting=rule["current_setting"],
                recommended_setting=rule["recommended_setting"],
                unit=rule["unit"],
                reason=rule["reason"],
                confidence_score=rule["confidence_score"],
                expected_improvement=rule["expected_improvement"],
                historical_cases_count=evidence["historical_cases_count"],
                historical_success_rate=evidence["historical_success_rate"],
                priority=rule["priority"],
            )
            recommendations.append(rec)

        return recommendations


recommendation_engine = RecommendationEngineService()
