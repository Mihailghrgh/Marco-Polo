from supabase import create_client
import os
import json
from pathlib import Path

DB_URL = "https://wrjrmucjwqktqtmpvnnk.supabase.co"
DB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyanJtdWNqd3FrdHF0bXB2bm5rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjEzMDI5NywiZXhwIjoyMDYxNzA2Mjk3fQ.ihgxcTh56tRSd7zaDIz8BflYAOcwZp5wLivBW5x-utM"
MAP_API = "yzax3zR8dQOlJDaNSDpK"

file_path = Path(
    "C:/Users/gawst/Map/marco/backend/backend_server/Old_Files/San_Francisco_Polygon_Data/san_francisco_polygon_data.json"
)

with open(file_path, "r") as f:
    data = json.load(f)
    supabase = create_client(DB_URL, DB_KEY)
    supabase.table("San_Francisco_Borough_Polygon").insert(data).execute()


