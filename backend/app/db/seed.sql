-- Seed Data for GradeSense AI Database

-- 1. Seed Roles
INSERT INTO roles (id, code, name, permissions) VALUES
('10000000-0000-0000-0000-000000000001', 'OPERATOR', 'Plant Machine Operator', '["view_telemetry", "execute_grade_change", "apply_recommendation"]'::jsonb),
('10000000-0000-0000-0000-000000000002', 'PROCESS_ENGINEER', 'Process Control Engineer', '["view_telemetry", "configure_recipes", "override_ai", "export_reports"]'::jsonb),
('10000000-0000-0000-0000-000000000003', 'PLANT_MANAGER', 'Mill Plant Manager', '["view_analytics", "view_reports", "manage_users"]'::jsonb),
('10000000-0000-0000-0000-000000000004', 'ADMIN', 'DCS System Administrator', '["*"]'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- 2. Seed Users
INSERT INTO users (id, role_id, username, email, full_name, hashed_password, plant_section) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'operator_01', 'j.miller@honeywell-paper.com', 'J. Miller (Process Lead)', '$2b$12$eImiTXuWVxfM37uY4JANjO5E.y8aVz4p8p9m0k2L1O3n5j6q7r8s9', 'Paper Mill #04 - PM-01 Line'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'engineer_01', 's.chen@honeywell-paper.com', 'S. Chen (Lead Process Engineer)', '$2b$12$eImiTXuWVxfM37uY4JANjO5E.y8aVz4p8p9m0k2L1O3n5j6q7r8s9', 'Control Engineering')
ON CONFLICT (username) DO NOTHING;

-- 3. Seed Machines
INSERT INTO machines (id, code, name, plant_location, max_speed_mpm) VALUES
('30000000-0000-0000-0000-000000000001', 'PM-01', 'Paper Machine #01 (Fine Writing & Copy)', 'Pineville Mill - Line 1', 1400.0),
('30000000-0000-0000-0000-000000000002', 'PM-02', 'Paper Machine #02 (Heavy Packaging Linerboard)', 'Pineville Mill - Line 2', 1200.0)
ON CONFLICT (code) DO NOTHING;

-- 4. Seed Paper Grades
INSERT INTO paper_grades (id, code, name, target_basis_weight_gsm, target_moisture_percent, target_tensile_md, target_caliper_microns) VALUES
('40000000-0000-0000-0000-000000000001', 'P-80GSM', 'Premium Offset Fine Paper 80g/m²', 80.0, 6.8, 4.8, 105.0),
('40000000-0000-0000-0000-000000000002', 'L-120GSM', 'Linerboard Packaging 120g/m²', 120.0, 7.5, 6.2, 160.0),
('40000000-0000-0000-0000-000000000003', 'K-150GSM', 'Kraft Unbleached Board 150g/m²', 150.0, 8.0, 7.5, 210.0)
ON CONFLICT (code) DO NOTHING;

-- 5. Seed Recipes
INSERT INTO recipes (id, machine_id, paper_grade_id, setpoint_targets) VALUES
('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '{"headbox_pressure_kPa": 142.0, "press_1_load_knm": 78.0, "dryer_group_3_bar": 3.57}'::jsonb),
('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', '{"headbox_pressure_kPa": 165.0, "press_1_load_knm": 92.0, "dryer_group_3_bar": 4.10}'::jsonb);

-- 6. Seed AI Models
INSERT INTO ai_models (id, name, version, model_type, accuracy_score, artifact_path) VALUES
('60000000-0000-0000-0000-000000000001', 'Moisture & Basis Weight Trajectory Predictor', 'v2.4.1-xgboost', 97.6, '/app/models/weights/moisture_v2.4.1.onnx')
ON CONFLICT (version) DO NOTHING;
