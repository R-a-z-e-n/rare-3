from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "RARE Face Analysis API"
    database_url: str = "postgresql+psycopg://postgres:1234@localhost:5432/rare_fa"
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:8000", "null"]

    deepseek_api_key: str | None = None
    deepseek_model: str = "deepseek-chat"
    deepseek_base_url: str = "https://api.deepseek.com"

    groq_api_key: str | None = None
    groq_model: str = "llama-3.1-8b-instant"
    groq_base_url: str = "https://api.groq.com/openai/v1"

    use_real_skin_model: bool = False
    skin_model_source: str = "local"
    skin_model_path: str = "model.keras"
    skin_model_backend: str = "jax"
    skin_model_input_size: int = 512
    skin_model_confidence_threshold: float = 0.20
    skin_model_api_url: str | None = None
    skin_model_api_timeout: float = 30.0
    debug_llm_payloads: bool = False

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    return Settings()
