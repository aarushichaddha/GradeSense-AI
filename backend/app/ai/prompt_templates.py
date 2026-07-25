from typing import Dict, Any


class IndustrialPromptBuilder:
    """Formats DCS telemetry state into structured prompts for LLM operational advisory synthesis."""

    @staticmethod
    def build_prescriptive_prompt(
        deviation_type: str, current_telemetry: Dict[str, Any], target_specs: Dict[str, Any]
    ) -> str:
        return f"""[INDUSTRIAL DCS ADVISORY SYSTEM]
Act as an expert Paper Machine Process Control Specialist.
Current Machine Telemetry: {current_telemetry}
Target Specifications: {target_specs}
Detected Deviation: {deviation_type}

Provide a concise, safety-bounded corrective action for the plant operator:
1. Exact parameter to adjust (e.g. Dryer Steam Pressure, Wet End Vacuum)
2. Incremental delta adjustment
3. Expected time to stabilization
4. Safety override warnings
"""
