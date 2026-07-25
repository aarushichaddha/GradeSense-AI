# GradeSense AI — Training Data

This directory stores training datasets used by the ML pipeline.

## Generated Synthetic Data

When no real CSV is found, the training pipeline auto-generates:

- **`synthetic_training_data.csv`** — 5,000 physics-grounded grade transition events.

## Real Plant Data (Recommended)

Drop your historical SCADA/DCS CSV export here and run:

```bash
python -m app.ai.training_pipeline --data-path data/your_file.csv
```

## Required CSV Column Schema

Your CSV must contain the following 26 columns:

| Column | Type | Description |
|---|---|---|
| `stock_flow_lpm` | float | Headbox stock flow (L/min) |
| `steam_pressure_bar` | float | Dryer section steam pressure (bar) |
| `machine_speed_mpm` | float | Machine speed (m/min) |
| `moisture_pct` | float | Sheet moisture after press (%) |
| `basis_weight_gsm` | float | Basis weight measurement (g/m²) |
| `ash_pct` | float | Ash/filler content (%) |
| `caliper_um` | float | Sheet caliper / thickness (µm) |
| `transition_time_min` | float | Elapsed transition time (min) |
| `delta_basis_weight` | float | target_bw − source_bw |
| `delta_speed` | float | target_speed − source_speed |
| `delta_steam` | float | target_steam − source_steam |
| `delta_moisture_target` | float | target_moisture − source_moisture |
| `steam_per_speed` | float | steam_pressure / machine_speed |
| `basis_weight_per_flow` | float | basis_weight / stock_flow |
| `moisture_steam_ratio` | float | moisture / steam_pressure |
| `speed_per_caliper` | float | machine_speed / caliper |
| `ash_basis_interaction` | float | ash × basis_weight |
| `recipe_similarity_score` | float | 0–1, 1 = identical recipes |
| `transition_momentum` | float | \|delta_bw\| / transition_time |
| `historical_offspec_rate` | float | Rolling off-spec fraction [0, 1] |
| `caliper_variance_proxy` | float | abs(caliper − 110) / 110 |
| `drying_adequacy_ratio` | float | steam / (bw × speed × 1e-4) |
| `headbox_loading` | float | stock_flow / machine_speed |
| `recipe_delta_magnitude` | float | sqrt(Δbw² + Δspeed² + Δsteam²) |
| `speed_pressure_interaction` | float | machine_speed × steam_pressure |
| `off_spec` | int (0 or 1) | **Label**: 1 = off-spec transition |
