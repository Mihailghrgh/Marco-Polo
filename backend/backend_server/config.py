from pydantic_settings import BaseSettings
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


class Settings:
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DATABASE_URL = os.getenv("DATABASE_URL")
    DIRECT_URL = os.getenv("DIRECT_URL")
    MAP_API = os.getenv("MAP_API")

    @staticmethod
    def validate():
        required = ["DB_PASSWORD", "DATABASE_URL", "DIRECT_URL", "MAP_API"]
        missing = [key for key in required if not os.getenv(key)]
        if missing:
            raise EnvironmentError(f"Missing environment variables: {missing}")


settings = Settings()
settings.validate()
