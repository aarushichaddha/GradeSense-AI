import logging
import math
from typing import List, Dict, Any
from app.ai.feature_engineering import RawProcessInputs, GradeSenseFeatureEngineer
from app.ai.inference_engine import predictor, PredictionResult
from app.schemas.simulator import SimulationRequest, SimulationResponse, TimelinePoint, MachineSectionLoad

logger = logging.getLogger(__name__)


class DigitalTwinSimulatorService:
    """Simulates paper machine physics, quality stabilization timeline, and thermal section loads."""

    def __init__(self):
        self.feature_engineer = GradeSenseFeatureEngineer()

    def simulate(self, req: SimulationRequest) -> SimulationResponse:
        logger.info(f"Running Digital Twin What-If Simulation for Speed={req.machine_speed_mpm} m/min, Steam={req.steam_pressure_bar} bar")

        # 1. Prepare raw inputs for ML model
        raw = RawProcessInputs(
            stock_flow_lpm=req.stock_flow_lpm,
            steam_pressure_bar=req.steam_pressure_bar,
            machine_speed_mpm=req.machine_speed_mpm,
            moisture_pct=req.moisture_pct,
            basis_weight_gsm=req.basis_weight_gsm,
            ash_pct=req.ash_pct,
            caliper_um=req.caliper_um,
            transition_time_min=20.0,
            source_basis_weight=req.source_basis_weight,
            source_speed=req.machine_speed_mpm - 50.0,
            source_steam=req.steam_pressure_bar + 1.0,
            source_moisture_target=6.0,
            target_basis_weight=req.target_basis_weight,
            target_speed=req.machine_speed_mpm,
            target_steam=req.steam_pressure_bar,
            target_moisture_target=6.5,
            historical_offspec_rate=0.18,
        )

        # 2. Execute AI Model Prediction
        prediction: PredictionResult = predictor.predict(raw)
        off_spec_prob = prediction.off_spec_probability
        risk_score = round(off_spec_prob * 100.0, 1)
        risk_label = prediction.risk_label

        # 3. Calculate physics-derived outputs
        # Waste tons formula: waste = speed * (basis_weight * 1e-6) * sheet_width_m (6m) * stabilization_time_min
        # Higher speed + higher off_spec_prob = larger waste
        delta_bw = abs(req.target_basis_weight - req.source_basis_weight)
        speed_factor = req.machine_speed_mpm / 800.0
        drying_factor = max(0.5, req.steam_pressure_bar / 7.0)
        
        stabilization_time_min = round(
            max(8.0, 15.0 + (delta_bw * 0.25) * speed_factor / drying_factor + (off_spec_prob * 12.0)), 1
        )
        
        # Waste tons calculation: ~0.8 to 3.5 tons
        predicted_waste_tons = round(
            (req.machine_speed_mpm * 6.0 * (req.basis_weight_gsm * 1e-6) * stabilization_time_min) * (0.4 + off_spec_prob * 0.8), 2
        )
        
        quality_index = round(max(30.0, 100.0 - (risk_score * 0.75)), 1)

        # 4. Generate Timeline Trajectory Points (0 to 30 mins)
        timeline: List[TimelinePoint] = []
        target_moisture = 6.2
        target_bw_val = req.target_basis_weight

        for t in range(0, 31, 2):
            progress = min(1.0, t / max(1.0, stabilization_time_min))
            # Exponential decay settling curve
            decay = math.exp(-3.0 * progress)
            current_moisture = round(target_moisture + (req.moisture_pct - target_moisture) * decay + (off_spec_prob * 1.5 * (1 - progress)), 2)
            current_bw = round(target_bw_val + (req.basis_weight_gsm - target_bw_val) * decay, 1)
            on_spec = abs(current_moisture - target_moisture) < 0.6 and progress > 0.7

            timeline.append(
                TimelinePoint(
                    time_offset_min=float(t),
                    moisture_pct=current_moisture,
                    basis_weight_gsm=current_bw,
                    machine_speed_mpm=req.machine_speed_mpm,
                    steam_pressure_bar=req.steam_pressure_bar,
                    quality_on_spec=on_spec,
                )
            )

        # 5. Calculate Machine Section Thermal Loads (%)
        drying_load = round(min(100.0, (req.machine_speed_mpm * req.basis_weight_gsm * 1e-4) / (req.steam_pressure_bar * 0.15) * 65.0), 1)
        wire_load = round(min(100.0, (req.stock_flow_lpm / 450.0) * 75.0), 1)
        press_load = round(min(100.0, (req.machine_speed_mpm / 1000.0) * 80.0), 1)
        reel_load = round(min(100.0, (req.machine_speed_mpm / 1100.0) * 70.0), 1)

        section_loads = [
            MachineSectionLoad(section_name="Headbox & Dilution", load_percentage=wire_load, status="OVERLOAD" if wire_load > 90 else ("WARNING" if wire_load > 80 else "NORMAL"), temperature_c=48.0),
            MachineSectionLoad(section_name="Fourdrinier Wire Section", load_percentage=wire_load, status="OVERLOAD" if wire_load > 90 else ("WARNING" if wire_load > 80 else "NORMAL"), temperature_c=52.0),
            MachineSectionLoad(section_name="Press Section Dewatering", load_percentage=press_load, status="OVERLOAD" if press_load > 90 else ("WARNING" if press_load > 80 else "NORMAL"), temperature_c=65.0),
            MachineSectionLoad(section_name="Dryer Group 1 (Pre-Dryer)", load_percentage=drying_load, status="OVERLOAD" if drying_load > 90 else ("WARNING" if drying_load > 80 else "NORMAL"), temperature_c=145.0),
            MachineSectionLoad(section_name="Dryer Group 2 (Main Dryer)", load_percentage=min(100.0, drying_load + 5.0), status="OVERLOAD" if drying_load > 85 else ("WARNING" if drying_load > 75 else "NORMAL"), temperature_c=168.0),
            MachineSectionLoad(section_name="Calender & Reel Section", load_percentage=reel_load, status="OVERLOAD" if reel_load > 90 else ("WARNING" if reel_load > 80 else "NORMAL"), temperature_c=35.0),
        ]

        # 6. Baseline Delta Comparison
        baseline_risk = 74.0
        baseline_waste = 2.1
        baseline_time = 24.0
        
        delta_vs_baseline = {
            "risk_score_delta": round(risk_score - baseline_risk, 1),
            "waste_tons_delta": round(predicted_waste_tons - baseline_waste, 2),
            "stabilization_time_delta": round(stabilization_time_min - baseline_time, 1),
        }

        return SimulationResponse(
            off_spec_probability=off_spec_prob,
            risk_score=risk_score,
            risk_label=risk_label,
            quality_index=quality_index,
            stabilization_time_min=stabilization_time_min,
            predicted_waste_tons=predicted_waste_tons,
            timeline=timeline,
            section_loads=section_loads,
            delta_vs_baseline=delta_vs_baseline,
        )


digital_twin_service = DigitalTwinSimulatorService()
