export const APP_CONFIG = {
  appName: "GradeSense AI",
  companyName: "Honeywell Process Solutions",
  plantName: "Pineville Paper Mill #04",
  systemVersion: "v3.15.0-DCS",
  activeLine: "PM-01 Paper Machine (Fine Writing & Packaging)",
};

export const MOCK_TELEMETRY_TAGS = [
  { tag: "DCS_WE_VAC_01", name: "Wet End Vacuum #1", value: 45.2, unit: "kPa", minLimit: 38, maxLimit: 52, status: "NORMAL" },
  { tag: "DCS_DRY_STEAM_03", name: "Dryer Section 3 Steam Press", value: 3.82, unit: "bar", minLimit: 3.2, maxLimit: 4.1, status: "WARNING" },
  { tag: "DCS_REEL_BW_01", name: "Basis Weight Reel Scanner", value: 78.4, unit: "g/m²", minLimit: 75, maxLimit: 82, status: "NORMAL" },
  { tag: "DCS_MOIST_SENS_02", name: "Reel Moisture Sensor", value: 6.8, unit: "%", minLimit: 6.0, maxLimit: 7.2, status: "CRITICAL" },
];
