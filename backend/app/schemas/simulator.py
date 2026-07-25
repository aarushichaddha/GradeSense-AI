from pydantic import BaseModel, Field
from typing import List, Dict, Optional


class SimulationRequest(BaseModel):
    machine_speed_mpm: float = Field(default=900.0, ge=300.0, le=1400.0, description="Machine speed in m/min")
    steam_pressure_bar: float = Field(default=5.5, ge=2.0, le=12.0, description="Dryer section steam pressure in bar")
    stock_flow_lpm: float = Field(default=350.0, ge=150.0, le=700.0, description="Headbox stock flow in L/min")
    moisture_pct: float = Field(default=7.2, ge=3.0, le=12.0, description="Sheet moisture percentage")
    basis_weight_gsm: float = Field(default=120.0, ge=40.0, le=220.0, description="Sheet basis weight in g/m²")
    ash_pct: float = Field(default=18.0, ge=5.0, le=35.0, description="Ash filler percentage")
    caliper_um: float = Field(default=140.0, ge=50.0, le=300.0, description="Sheet caliper in µm")
    source_grade: str = Field(default="Fine Copy 80g", description="Source paper grade")
    target_grade: str = Field(default="Linerboard 120g", description="Target paper grade")
    source_basis_weight: float = Field(default=80.0, ge=40.0, le=220.0)
    target_basis_weight: float = Field(default=120.0, ge=40.0, le=220.0)


class TimelinePoint(BaseModel):
    time_offset_min: float
    moisture_pct: float
    basis_weight_gsm: float
    machine_speed_mpm: float
    steam_pressure_bar: float
    quality_on_spec: bool


class MachineSectionLoad(BaseModel):
    section_name: str
    load_percentage: float
    status: str  # NORMAL, WARNING, OVERLOAD
    temperature_c: float


class SimulationResponse(BaseModel):
    off_spec_probability: float
    risk_score: float  # 0 to 100
    risk_label: str  # NORMAL, WARNING, CRITICAL
    quality_index: float  # 0 to 100%
    stabilization_time_min: float
    predicted_waste_tons: float
    timeline: List[TimelinePoint]
    section_loads: List[MachineSectionLoad]
    delta_vs_baseline: Dict[str, float]
