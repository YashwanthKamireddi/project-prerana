"""
Application Configuration
========================
Central configuration management using Pydantic Settings.
Loads from environment variables with sensible defaults.
"""

import os
from typing import List
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "AADHAAR-PRERANA"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "development"

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 4

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://prerana.uidai.gov.in"
    ]

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/prerana_db"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    CACHE_TTL: int = 3600  # 1 hour

    # ML Models
    MODEL_PATH: str = "../ml_models"
    GENESIS_MODEL_VERSION: str = "v1.2.0"
    MOBILITY_MODEL_VERSION: str = "v1.1.5"
    INTEGRITY_MODEL_VERSION: str = "v2.0.1"

    # Analysis Parameters
    ZSCORE_THRESHOLD: float = 3.0
    ANOMALY_LOOKBACK_DAYS: int = 30
    MIGRATION_VELOCITY_THRESHOLD: float = 200.0  # % increase
    CHILD_GAP_THRESHOLD_YEARS: int = 5

    # Data Paths
    DATA_PATH: str = "../../"
    ENROLMENT_DATA_PATH: str = "api_data_aadhar_enrolment"
    DEMOGRAPHIC_DATA_PATH: str = "api_data_aadhar_demographic"
    BIOMETRIC_DATA_PATH: str = "api_data_aadhar_biometric"

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "%(asctime)s | %(levelname)s | %(name)s | %(message)s"

    # Security
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    API_KEY_HEADER: str = "X-API-Key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # External Services
    SMS_GATEWAY_URL: str = ""
    EMAIL_SERVICE_URL: str = ""
    NOTIFICATION_WEBHOOK_URL: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Singleton settings instance
settings = get_settings()
