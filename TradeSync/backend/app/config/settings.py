from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_HOURS: int = 24

    ENCRYPTION_KEY: str = "fallback_key_for_dev_change_me_in_prod!"
    UPSTOX_REDIRECT_URI: str = "http://localhost:8000/api/v1/trading-accounts/oauth/callback"
    FRONTEND_URL: str = "http://localhost:5173"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
