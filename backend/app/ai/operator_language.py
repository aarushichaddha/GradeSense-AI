"""
operator_language.py
=====================
Maps ML feature names and SHAP contribution directions into plain operator-
friendly language that plant operators understand without ML knowledge.

Each feature has:
  - operator_name   : human-readable sensor/parameter name
  - unit            : physical unit string
  - normal_range    : (low, high) tuple for historical comparison
  - normal_label    : what "normal" looks like in plain language
  - risk_message    : message when this feature INCREASES off-spec risk
  - safe_message    : message when this feature DECREASES off-spec risk
  - icon            : emoji icon for dashboard display
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class FeatureLanguage:
    operator_name: str
    unit: str
    normal_range_low: float
    normal_range_high: float
    normal_label: str
    risk_message: str       # When SHAP value > 0 (pushes toward off-spec)
    safe_message: str       # When SHAP value < 0 (pushes toward on-spec)
    icon: str
    category: str           # MOISTURE | SPEED | DRYING | STOCK | RECIPE | HISTORY


# ── Full operator language map for all 25 feature columns ────────────────────
OPERATOR_LANGUAGE_MAP: dict[str, FeatureLanguage] = {

    "steam_pressure_bar": FeatureLanguage(
        operator_name="Steam Pressure (Dryer Section)",
        unit="bar",
        normal_range_low=6.0,
        normal_range_high=10.5,
        normal_label="Normal: 6.0 – 10.5 bar",
        risk_message="Steam pressure is below the minimum needed to dry the sheet at this machine speed. The sheet will exit the dryer section too wet.",
        safe_message="Steam pressure is within normal operating range for this grade.",
        icon="🔥",
        category="DRYING",
    ),
    "moisture_pct": FeatureLanguage(
        operator_name="Sheet Moisture",
        unit="%",
        normal_range_low=5.0,
        normal_range_high=7.0,
        normal_label="Normal: 5.0 – 7.0 %",
        risk_message="Sheet moisture is rising above the acceptable limit. Paper leaving the machine is too wet and will fail reel moisture specifications.",
        safe_message="Sheet moisture is within target range.",
        icon="💧",
        category="MOISTURE",
    ),
    "machine_speed_mpm": FeatureLanguage(
        operator_name="Machine Wire Speed",
        unit="m/min",
        normal_range_low=500.0,
        normal_range_high=1000.0,
        normal_label="Normal: 500 – 1000 m/min",
        risk_message="Machine speed is higher than the historical average for this grade change. The sheet passes through the dryer too quickly to be fully dried.",
        safe_message="Machine speed is within safe limits for this grade.",
        icon="⚡",
        category="SPEED",
    ),
    "basis_weight_gsm": FeatureLanguage(
        operator_name="Basis Weight",
        unit="g/m²",
        normal_range_low=60.0,
        normal_range_high=130.0,
        normal_label="Normal: 60 – 130 g/m²",
        risk_message="Current basis weight is significantly different from the target grade — the sheet is heavier or lighter than the recipe specifies.",
        safe_message="Basis weight is tracking the target grade recipe.",
        icon="⚖️",
        category="STOCK",
    ),
    "stock_flow_lpm": FeatureLanguage(
        operator_name="Headbox Stock Flow",
        unit="L/min",
        normal_range_low=250.0,
        normal_range_high=500.0,
        normal_label="Normal: 250 – 500 L/min",
        risk_message="Stock flow to the headbox is too low for the current machine speed, causing thin spot formation in the sheet.",
        safe_message="Headbox stock flow is adequate for the current machine speed.",
        icon="🌊",
        category="STOCK",
    ),
    "ash_pct": FeatureLanguage(
        operator_name="Ash / Filler Content",
        unit="%",
        normal_range_low=8.0,
        normal_range_high=22.0,
        normal_label="Normal: 8 – 22 %",
        risk_message="Filler ash loading is too high during this grade transition. Excess filler weakens fiber bonding and may cause sheet breaks.",
        safe_message="Ash filler content is within the acceptable range for this grade.",
        icon="🪨",
        category="STOCK",
    ),
    "caliper_um": FeatureLanguage(
        operator_name="Sheet Caliper / Thickness",
        unit="µm",
        normal_range_low=80.0,
        normal_range_high=180.0,
        normal_label="Normal: 80 – 180 µm",
        risk_message="Sheet caliper deviates significantly from the target specification — the paper is too thick or too thin.",
        safe_message="Sheet caliper is within target specification.",
        icon="📏",
        category="STOCK",
    ),
    "transition_time_min": FeatureLanguage(
        operator_name="Elapsed Transition Time",
        unit="min",
        normal_range_low=10.0,
        normal_range_high=60.0,
        normal_label="Normal: 10 – 60 min",
        risk_message="Grade transition has been running longer than typical historical transitions for this grade pair.",
        safe_message="Grade transition is progressing within the normal time window.",
        icon="⏱️",
        category="RECIPE",
    ),
    "delta_basis_weight": FeatureLanguage(
        operator_name="Grade Basis Weight Change (Target − Source)",
        unit="g/m²",
        normal_range_low=-30.0,
        normal_range_high=30.0,
        normal_label="Small change: ±30 g/m²",
        risk_message="The grade jump in basis weight is very large — jumping from a light to a heavy grade (or vice versa) in a short window.",
        safe_message="Basis weight change between grades is manageable.",
        icon="📊",
        category="RECIPE",
    ),
    "delta_speed": FeatureLanguage(
        operator_name="Grade Speed Change (Target − Source)",
        unit="m/min",
        normal_range_low=-100.0,
        normal_range_high=100.0,
        normal_label="Small change: ±100 m/min",
        risk_message="Target grade requires a significant speed change from the current grade, stressing the sheet forming section.",
        safe_message="Speed change between grades is within normal transition tolerance.",
        icon="🏃",
        category="RECIPE",
    ),
    "delta_steam": FeatureLanguage(
        operator_name="Grade Steam Change (Target − Source)",
        unit="bar",
        normal_range_low=-2.0,
        normal_range_high=2.0,
        normal_label="Small change: ±2 bar",
        risk_message="Target grade requires a large steam pressure adjustment that the dryer section cannot complete within the transition window.",
        safe_message="Steam requirement difference between grades is within ramp capacity.",
        icon="♨️",
        category="RECIPE",
    ),
    "delta_moisture_target": FeatureLanguage(
        operator_name="Moisture Target Change (Target − Source)",
        unit="%",
        normal_range_low=-1.0,
        normal_range_high=1.0,
        normal_label="Small change: ±1 %",
        risk_message="The new grade has a significantly different moisture target, requiring major dryer section rebalancing.",
        safe_message="Moisture target change between grades is small and manageable.",
        icon="💦",
        category="RECIPE",
    ),
    "drying_adequacy_ratio": FeatureLanguage(
        operator_name="Drying Capacity Adequacy",
        unit="ratio",
        normal_range_low=0.65,
        normal_range_high=2.5,
        normal_label="Normal: above 0.65",
        risk_message="Dryer section does not have enough thermal capacity to dry this basis weight at the current machine speed. Sheet will leave wet.",
        safe_message="Dryer section has adequate thermal capacity for this grade at current speed.",
        icon="🌡️",
        category="DRYING",
    ),
    "transition_momentum": FeatureLanguage(
        operator_name="Transition Rate of Change",
        unit="g/m²/min",
        normal_range_low=0.0,
        normal_range_high=2.0,
        normal_label="Normal: below 2.0 g/m²/min",
        risk_message="Grade change is happening too fast for the dryer section to respond. The rapid recipe change outpaces machine thermal response time.",
        safe_message="Grade transition rate is within the machine's ability to respond.",
        icon="📈",
        category="SPEED",
    ),
    "recipe_similarity_score": FeatureLanguage(
        operator_name="Recipe Similarity (Source to Target)",
        unit="score",
        normal_range_low=0.4,
        normal_range_high=1.0,
        normal_label="Normal: above 0.40 (similar grades)",
        risk_message="The source and target grades are very different from each other — this is a large, complex grade change with high transition risk.",
        safe_message="Source and target grades are similar — transition should be straightforward.",
        icon="🎯",
        category="RECIPE",
    ),
    "historical_offspec_rate": FeatureLanguage(
        operator_name="Machine Historical Failure Rate",
        unit="rate",
        normal_range_low=0.0,
        normal_range_high=0.20,
        normal_label="Normal: below 20% failure rate",
        risk_message="This paper machine has a higher-than-average history of off-spec events during grade transitions.",
        safe_message="Machine has a good track record of on-spec grade transitions.",
        icon="📋",
        category="HISTORY",
    ),
    "moisture_steam_ratio": FeatureLanguage(
        operator_name="Moisture-to-Steam Ratio",
        unit="ratio",
        normal_range_low=0.4,
        normal_range_high=1.0,
        normal_label="Normal: 0.40 – 1.00",
        risk_message="Sheet moisture is high relative to available steam pressure — not enough heat energy to remove moisture from this sheet.",
        safe_message="Steam supply is adequate relative to current sheet moisture level.",
        icon="⚗️",
        category="DRYING",
    ),
    "steam_per_speed": FeatureLanguage(
        operator_name="Steam-to-Speed Ratio",
        unit="bar/(m/min)",
        normal_range_low=0.005,
        normal_range_high=0.018,
        normal_label="Normal: 0.005 – 0.018",
        risk_message="Machine speed is too high relative to available steam — not enough drying distance per unit speed.",
        safe_message="Steam supply is balanced with machine speed.",
        icon="⚖️",
        category="DRYING",
    ),
    "headbox_loading": FeatureLanguage(
        operator_name="Headbox Loading Ratio",
        unit="L/m",
        normal_range_low=0.30,
        normal_range_high=0.60,
        normal_label="Normal: 0.30 – 0.60",
        risk_message="Headbox is under-loaded — stock flow is too low relative to machine speed, causing non-uniform sheet formation.",
        safe_message="Headbox dilution is properly balanced for current machine speed.",
        icon="🚿",
        category="STOCK",
    ),
    "ash_basis_interaction": FeatureLanguage(
        operator_name="Filler × Basis Weight Loading",
        unit="g/m²·%",
        normal_range_low=0.0,
        normal_range_high=2000.0,
        normal_label="Normal: below 2000",
        risk_message="Combined effect of high filler content and heavy basis weight creates excessive loading stress on the dryer section.",
        safe_message="Filler and basis weight combination is within safe operating range.",
        icon="🧱",
        category="STOCK",
    ),
    "recipe_delta_magnitude": FeatureLanguage(
        operator_name="Overall Recipe Change Magnitude",
        unit="composite",
        normal_range_low=0.0,
        normal_range_high=150.0,
        normal_label="Normal: below 150",
        risk_message="The combined magnitude of all recipe changes (speed + basis weight + steam) is very large — this is a complex, high-risk grade change.",
        safe_message="Combined recipe change is within manageable transition range.",
        icon="📐",
        category="RECIPE",
    ),
    "basis_weight_per_flow": FeatureLanguage(
        operator_name="Basis Weight per Unit Flow",
        unit="g/m²/(L/min)",
        normal_range_low=0.1,
        normal_range_high=0.5,
        normal_label="Normal: 0.10 – 0.50",
        risk_message="Sheet is being formed with too little dilution water relative to basis weight target — risks thick spot and drainage issues.",
        safe_message="Stock dilution is appropriate for the target basis weight.",
        icon="🌡️",
        category="STOCK",
    ),
    "caliper_variance_proxy": FeatureLanguage(
        operator_name="Caliper Deviation from Median",
        unit="fraction",
        normal_range_low=0.0,
        normal_range_high=0.3,
        normal_label="Normal: within 30% of median",
        risk_message="Sheet thickness deviates significantly from the plant median — caliper specification will likely be missed.",
        safe_message="Sheet thickness is close to the typical operating range.",
        icon="📏",
        category="STOCK",
    ),
    "speed_per_caliper": FeatureLanguage(
        operator_name="Speed-to-Caliper Ratio",
        unit="m/min/µm",
        normal_range_low=3.0,
        normal_range_high=12.0,
        normal_label="Normal: 3.0 – 12.0",
        risk_message="Machine speed is very high relative to sheet thickness, creating high sheet tension that risks MD reel breaking.",
        safe_message="Machine speed and sheet thickness combination is within safe tension range.",
        icon="🎣",
        category="SPEED",
    ),
    "speed_pressure_interaction": FeatureLanguage(
        operator_name="Speed × Steam Interaction",
        unit="bar·m/min",
        normal_range_low=2000.0,
        normal_range_high=10000.0,
        normal_label="Normal: 2000 – 10000",
        risk_message="Combined effect of high machine speed and low steam is causing insufficient drying — the sheet cannot be dried fast enough.",
        safe_message="Speed and steam pressure interaction is within the drying design envelope.",
        icon="💥",
        category="DRYING",
    ),
}

# Fallback for any unmapped feature
_FALLBACK_LANGUAGE = FeatureLanguage(
    operator_name="Process Variable",
    unit="",
    normal_range_low=0.0,
    normal_range_high=100.0,
    normal_label="Normal operating range",
    risk_message="This process variable is contributing to the predicted quality deviation.",
    safe_message="This process variable is within acceptable limits.",
    icon="📊",
    category="OTHER",
)


def get_feature_language(feature_name: str) -> FeatureLanguage:
    """Return operator-friendly language for a given feature name."""
    return OPERATOR_LANGUAGE_MAP.get(feature_name, _FALLBACK_LANGUAGE)
