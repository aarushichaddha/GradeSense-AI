from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "GradeSense AI"
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    # PostgreSQL Database
    DATABASE_URL: str = "postgresql+asyncpg://gradesense_user:gradesense_secret_password@localhost:5432/gradesense_db"

    # JWT Authentication
    SECRET_KEY: str = "super_secret_jwt_key_for_industrial_gradesense_ai_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hour plant shift duration

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
