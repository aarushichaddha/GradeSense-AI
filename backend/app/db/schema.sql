-- PostgreSQL Schema DDL for GradeSense AI
-- Production-Ready High-Scale Enterprise Database Structure

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_brin";

-- Timestamp Auto-Update Trigger Function
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================================
-- 1. ROLES
-- ============================================================================
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER update_roles_modtime BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE INDEX idx_roles_code ON roles(code) WHERE deleted_at IS NULL;

-- ============================================================================
-- 2. USERS
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    plant_section VARCHAR(100) DEFAULT 'Paper Mill #04',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role_id);

-- ============================================================================
-- 3. MACHINES
-- ============================================================================
CREATE TABLE machines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'PM-01'
    name VARCHAR(150) NOT NULL,
    plant_location VARCHAR(150) NOT NULL,
    max_speed_mpm DOUBLE PRECISION NOT NULL DEFAULT 1500.0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER update_machines_modtime BEFORE UPDATE ON machines FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE INDEX idx_machines_code ON machines(code) WHERE deleted_at IS NULL;

-- ============================================================================
-- 4. PAPER GRADED
-- ============================================================================
CREATE TABLE paper_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'P-80GSM'
    name VARCHAR(150) NOT NULL,
    target_basis_weight_gsm DOUBLE PRECISION NOT NULL,
    target_moisture_percent DOUBLE PRECISION NOT NULL,
    target_tensile_md DOUBLE PRECISION NOT NULL,
    target_caliper_microns DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER update_paper_grades_modtime BEFORE UPDATE ON paper_grades FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE INDEX idx_paper_grades_code ON paper_grades(code) WHERE deleted_at IS NULL;

-- ============================================================================
-- 5. RECIPES
-- ============================================================================
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    paper_grade_id UUID NOT NULL REFERENCES paper_grades(id) ON DELETE CASCADE,
    setpoint_targets JSONB NOT NULL, -- Machine DCS setpoints for wet end, dryer steam, press
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER update_recipes_modtime BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE INDEX idx_recipes_machine_grade ON recipes(machine_id, paper_grade_id);

-- ============================================================================
-- 6. SENSOR DATA (HIGH-THROUGHPUT RANGE PARTITIONED TABLE)
-- ============================================================================
CREATE TABLE sensor_data (
    id UUID DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    tag VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,
    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

-- BRIN Index for fast time range scans across millions of rows
CREATE INDEX idx_sensor_data_brin ON sensor_data USING BRIN (timestamp);
CREATE INDEX idx_sensor_data_tag_ts ON sensor_data (tag, timestamp DESC);
CREATE INDEX idx_sensor_data_machine ON sensor_data (machine_id, timestamp DESC);

-- Example Partition Table Setup (Current Year Initial Partition)
CREATE TABLE sensor_data_2026_q3 PARTITION OF sensor_data
    FOR VALUES FROM ('2026-07-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');

CREATE TABLE sensor_data_2026_q4 PARTITION OF sensor_data
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

-- ============================================================================
-- 7. GRADE TRANSITIONS
-- ============================================================================
CREATE TABLE grade_transitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE RESTRICT,
    source_grade_id UUID NOT NULL REFERENCES paper_grades(id) ON DELETE RESTRICT,
    target_grade_id UUID NOT NULL REFERENCES paper_grades(id) ON DELETE RESTRICT,
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED', -- SCHEDULED, IN_TRANSITION, COMPLETED, ABORTED
    progress_percent DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    predicted_waste_tons DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    estimated_completion_time TIMESTAMPTZ NULL,
    actual_completion_time TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER update_grade_transitions_modtime BEFORE UPDATE ON grade_transitions FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE INDEX idx_grade_transitions_machine_status ON grade_transitions(machine_id, status);

-- ============================================================================
-- 8. AI MODELS
-- ============================================================================
CREATE TABLE ai_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    version VARCHAR(50) UNIQUE NOT NULL,
    model_type VARCHAR(50) NOT NULL, -- e.g., 'XGBoostRegressor', 'LSTM'
    accuracy_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    artifact_path VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER update_ai_models_modtime BEFORE UPDATE ON ai_models FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE INDEX idx_ai_models_active ON ai_models(is_active) WHERE is_active = TRUE;

-- ============================================================================
-- 9. PREDICTIONS
-- ============================================================================
CREATE TABLE predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_transition_id UUID NOT NULL REFERENCES grade_transitions(id) ON DELETE CASCADE,
    ai_model_id UUID NOT NULL REFERENCES ai_models(id) ON DELETE RESTRICT,
    parameter_name VARCHAR(50) NOT NULL,
    predicted_value DOUBLE PRECISION NOT NULL,
    confidence_score DOUBLE PRECISION NOT NULL,
    horizon_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER update_predictions_modtime BEFORE UPDATE ON predictions FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE INDEX idx_predictions_transition ON predictions(grade_transition_id);

-- ============================================================================
-- 10. RECOMMENDATIONS
-- ============================================================================
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_transition_id UUID NOT NULL REFERENCES grade_transitions(id) ON DELETE CASCADE,
    prediction_id UUID NULL REFERENCES predictions(id) ON DELETE SET NULL,
    parameter_to_adjust VARCHAR(100) NOT NULL,
    current_setting VARCHAR(50) NOT NULL,
    recommended_setting VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    confidence_score DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- PENDING, ACCEPTED, REJECTED, AUTO_APPLIED
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER update_recommendations_modtime BEFORE UPDATE ON recommendations FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE INDEX idx_recommendations_transition_status ON recommendations(grade_transition_id, status);

-- ============================================================================
-- 11. ALERTS
-- ============================================================================
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grade_transition_id UUID NULL REFERENCES grade_transitions(id) ON DELETE CASCADE,
    prediction_id UUID NULL REFERENCES predictions(id) ON DELETE SET NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'WARNING', -- NORMAL, WARNING, CRITICAL
    parameter_name VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'DETECTED', -- DETECTED, ACKNOWLEDGED, MITIGATED
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER update_alerts_modtime BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE INDEX idx_alerts_status_severity ON alerts(status, severity);

-- ============================================================================
-- 12. HISTORICAL DATA (PARTITIONED BY RANGE FOR LONG TERM ANALYTICS)
-- ============================================================================
CREATE TABLE historical_data (
    id UUID DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    metric_name VARCHAR(100) NOT NULL,
    avg_value DOUBLE PRECISION NOT NULL,
    min_value DOUBLE PRECISION NOT NULL,
    max_value DOUBLE PRECISION NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL,
    PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);

CREATE INDEX idx_historical_data_brin ON historical_data USING BRIN (timestamp);

CREATE TABLE historical_data_2026 PARTITION OF historical_data
    FOR VALUES FROM ('2026-01-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

-- ============================================================================
-- 13. REPORTS
-- ============================================================================
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generated_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(150) NOT NULL,
    report_type VARCHAR(50) NOT NULL, -- e.g., 'SHIFT_YIELD', 'GRADE_CHANGE_SUMMARY'
    summary_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER update_reports_modtime BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

-- ============================================================================
-- 14. NOTIFICATIONS
-- ============================================================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER update_notifications_modtime BEFORE UPDATE ON notifications FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- ============================================================================
-- 15. AUDIT LOGS
-- ============================================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- e.g., 'APPLIED_AI_ADVISORY', 'LOGIN'
    target_entity VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE TRIGGER update_audit_logs_modtime BEFORE UPDATE ON audit_logs FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();
CREATE INDEX idx_audit_logs_user_action ON audit_logs(user_id, action);
