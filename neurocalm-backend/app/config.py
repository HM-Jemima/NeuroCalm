from functools import lru_cache
from urllib.parse import quote_plus

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str | None = None
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "neurocalm"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    SECRET_KEY: str = "change-this-to-a-random-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 50
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    FRONTEND_URL: str = "http://localhost:5173"
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    MICROSOFT_CLIENT_ID: str = ""
    MICROSOFT_CLIENT_SECRET: str = ""
    MICROSOFT_TENANT_ID: str = "common"

    # ML Model settings
    MODEL_PATH: str = ""  # Path to exported Keras model (.h5 or SavedModel dir)
    MODEL_TYPE: str = "SALIENT"  # SALIENT | CNN_LSTM | Transformer
    SCALER_PATH: str = ""  # Path to exported StandardScaler (.pkl)
    MODEL_METADATA_PATH: str = ""  # Path to model_metadata.json

    # fNIRS preprocessing settings
    WINDOW_SIZE: int = 150  # Timesteps per window (30 sec at 5 Hz)
    WINDOW_STRIDE: int = 3  # Sliding window stride in timesteps
    N_CLASSES: int = 4  # Number of workload classes (0-back, 1-back, 2-back, 3-back)
    FNIRS_FEATURES: str = "AB_I_O,AB_PHI_O,AB_I_DO,AB_PHI_DO,CD_I_O,CD_PHI_O,CD_I_DO,CD_PHI_DO"

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

    @property
    def fnirs_feature_list(self) -> list[str]:
        return [f.strip() for f in self.FNIRS_FEATURES.split(",")]

    @property
    def frontend_oauth_callback_url(self) -> str:
        return f"{self.FRONTEND_URL.rstrip('/')}/oauth/callback"

    @property
    def database_url(self) -> str:
        if self.DATABASE_URL:
            return self.DATABASE_URL

        user = quote_plus(self.POSTGRES_USER)
        password = quote_plus(self.POSTGRES_PASSWORD)
        host = self.POSTGRES_HOST.strip()
        database = self.POSTGRES_DB.strip()

        return (
            f"postgresql+asyncpg://{user}:{password}"
            f"@{host}:{self.POSTGRES_PORT}/{database}"
        )

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()
