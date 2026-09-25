"""Application Configuration Settings."""
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "local"
    app_version: str = "0.1.0"
    debug: bool = True

    host: str = "0.0.0.0"
    port: int = 8000
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    database_url: str = "postgresql+asyncpg://vetri_user:vetri_secret_password@localhost:5432/vetri_cases_db"

    storage_provider: str = "local"
    local_storage_dir: str = "./data/uploads"

    aws_region: str = "ap-south-1"
    s3_bucket_name: str = "vetri-case-bundles-ap-south-1"
    aws_access_key_id: str | None = None
    aws_secret_access_key: str | None = None

    use_local_ollama: bool = False
    ollama_base_url: str = "http://localhost:11434"
    anthropic_api_key: str | None = None
    openai_api_key: str | None = None
    gemini_api_key: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
