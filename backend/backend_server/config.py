from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DB_PASSWORD: str = (
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyanJtdWNqd3FrdHF0bXB2bm5rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjEzMDI5NywiZXhwIjoyMDYxNzA2Mjk3fQ.ihgxcTh56tRSd7zaDIz8BflYAOcwZp5wLivBW5x-utM"
    )
    DATABASE_URL: str = "https://wrjrmucjwqktqtmpvnnk.supabase.co"
    DIRECT_URL: str = (
        "postgresql://postgres.wrjrmucjwqktqtmpvnnk:RCaV2UN1TH3tg1%23@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require"
    )
    ANTHROPIC_BASE_URL: str = "https://api.deepseek.com/"
    ANTHROPIC_API_KEY: str = "sk-0915a43c6496424d84fd91d087e42e58"
    DEEPSEEK_BASE_URL: str = "https://api.deepseek.com/"
    DEEPSEEK_API_KEY: str = "sk-0915a43c6496424d84fd91d087e42e58"
    MAP_API: str = "yzax3zR8dQOlJDaNSDpK"


settings = Settings()
