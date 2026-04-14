import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "AI Resume Analyzer Service"
    app_version: str = "1.0.0"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000
    
    # Paths
    upload_dir: str = "./uploads"
    models_dir: str = "./models"
    
    # API Keys
    backend_url: str = "http://localhost:5000"
    
    class Config:
        env_file = ".env"
        case_sensitive = False

settings = Settings()
