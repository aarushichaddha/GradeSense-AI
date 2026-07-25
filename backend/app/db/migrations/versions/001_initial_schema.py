"""001_initial_schema

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-07-25 16:44:34.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # 1. Create Roles
    op.create_table(
        'roles',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('code', sa.String(50), nullable=False, unique=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('permissions', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )

    # 2. Create Users
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('role_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('roles.id'), nullable=False),
        sa.Column('username', sa.String(50), nullable=False, unique=True),
        sa.Column('email', sa.String(100), nullable=False, unique=True),
        sa.Column('full_name', sa.String(150), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('plant_section', sa.String(100), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )

    # 3. Create Machines
    op.create_table(
        'machines',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('code', sa.String(50), nullable=False, unique=True),
        sa.Column('name', sa.String(150), nullable=False),
        sa.Column('plant_location', sa.String(150), nullable=False),
        sa.Column('max_speed_mpm', sa.Float(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )

    # 4. Create Paper Grades
    op.create_table(
        'paper_grades',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('code', sa.String(50), nullable=False, unique=True),
        sa.Column('name', sa.String(150), nullable=False),
        sa.Column('target_basis_weight_gsm', sa.Float(), nullable=False),
        sa.Column('target_moisture_percent', sa.Float(), nullable=False),
        sa.Column('target_tensile_md', sa.Float(), nullable=False),
        sa.Column('target_caliper_microns', sa.Float(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )

    # 5. Create Recipes
    op.create_table(
        'recipes',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('machine_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('machines.id', ondelete='CASCADE'), nullable=False),
        sa.Column('paper_grade_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('paper_grades.id', ondelete='CASCADE'), nullable=False),
        sa.Column('setpoint_targets', sa.JSON(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )

    # 6. Create Sensor Data (Range Partitioned DDL executed via raw SQL)
    op.execute("""
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
        
        CREATE INDEX idx_sensor_data_brin ON sensor_data USING BRIN (timestamp);
        CREATE TABLE sensor_data_default PARTITION OF sensor_data DEFAULT;
    """)

    # 7. Create Grade Transitions
    op.create_table(
        'grade_transitions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('machine_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('machines.id'), nullable=False),
        sa.Column('source_grade_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('paper_grades.id'), nullable=False),
        sa.Column('target_grade_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('paper_grades.id'), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, default='SCHEDULED'),
        sa.Column('progress_percent', sa.Float(), nullable=False, default=0.0),
        sa.Column('predicted_waste_tons', sa.Float(), nullable=False, default=0.0),
        sa.Column('start_time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('estimated_completion_time', sa.DateTime(timezone=True), nullable=True),
        sa.Column('actual_completion_time', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )

    # 8. Create AI Models
    op.create_table(
        'ai_models',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('version', sa.String(50), nullable=False, unique=True),
        sa.Column('model_type', sa.String(50), nullable=False),
        sa.Column('accuracy_score', sa.Float(), nullable=False, default=0.0),
        sa.Column('artifact_path', sa.String(255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, default=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )

    # 9. Create Predictions
    op.create_table(
        'predictions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('grade_transition_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('grade_transitions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('ai_model_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('ai_models.id'), nullable=False),
        sa.Column('parameter_name', sa.String(50), nullable=False),
        sa.Column('predicted_value', sa.Float(), nullable=False),
        sa.Column('confidence_score', sa.Float(), nullable=False),
        sa.Column('horizon_time', sa.DateTime(timezone=True), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )

    # 10. Create Recommendations
    op.create_table(
        'recommendations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('grade_transition_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('grade_transitions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('prediction_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('predictions.id', ondelete='SET NULL'), nullable=True),
        sa.Column('parameter_to_adjust', sa.String(100), nullable=False),
        sa.Column('current_setting', sa.String(50), nullable=False),
        sa.Column('recommended_setting', sa.String(50), nullable=False),
        sa.Column('unit', sa.String(20), nullable=False),
        sa.Column('confidence_score', sa.Float(), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, default='PENDING'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )

    # 11. Create Alerts
    op.create_table(
        'alerts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('grade_transition_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('grade_transitions.id', ondelete='CASCADE'), nullable=True),
        sa.Column('prediction_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('predictions.id', ondelete='SET NULL'), nullable=True),
        sa.Column('severity', sa.String(20), nullable=False, default='WARNING'),
        sa.Column('parameter_name', sa.String(50), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, default='DETECTED'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )

    # 12. Create Historical Data
    op.execute("""
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
        CREATE TABLE historical_data_default PARTITION OF historical_data DEFAULT;
    """)

    # 13. Create Reports
    op.create_table(
        'reports',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('generated_by_user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('title', sa.String(150), nullable=False),
        sa.Column('report_type', sa.String(50), nullable=False),
        sa.Column('summary_data', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )

    # 14. Create Notifications
    op.create_table(
        'notifications',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('title', sa.String(150), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('is_read', sa.Boolean(), nullable=False, default=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )

    # 15. Create Audit Logs
    op.create_table(
        'audit_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('action', sa.String(100), nullable=False),
        sa.Column('target_entity', sa.String(100), nullable=False),
        sa.Column('details', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True),
    )


def downgrade():
    op.drop_table('audit_logs')
    op.drop_table('notifications')
    op.drop_table('reports')
    op.drop_table('historical_data')
    op.drop_table('alerts')
    op.drop_table('recommendations')
    op.drop_table('predictions')
    op.drop_table('ai_models')
    op.drop_table('grade_transitions')
    op.drop_table('sensor_data')
    op.drop_table('recipes')
    op.drop_table('paper_grades')
    op.drop_table('machines')
    op.drop_table('users')
    op.drop_table('roles')
