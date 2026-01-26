from typing import Union
from fastapi import FastAPI, Path
from config import settings
from ORM.London_Crime_Map import London_Crime_Database
from ORM.San_Francisco_Crime_Map import San_Francisco_Data_Base
from ORM.London_Polygon_Map import London_Polygon_Database
from ORM.San_Francisco_Polygon_Map import San_Francisco_Polygon_Database
from sqlmodel import Field, Session, SQLModel, create_engine, select
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/earthquakes/{parameters}")
def read_root(parameters: str):
    return {"Hello": "World"}


@app.get("/DEFAULT_MAP")
def read_item():
    try:
        map_Style = requests.get(
            f"https://api.maptiler.com/maps/streets-v4/style.json?key={settings.MAP_API}"
        )
        data = map_Style.json()
        return data
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.get("/REALISTIC_MAP")
def read_item():
    try:
        map_Style = requests.get(
            f"https://api.maptiler.com/maps/satellite/style.json?key={settings.MAP_API}"
        )
        data = map_Style.json()
        return data
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.get("/DARK_MAP")
def read_item():
    try:
        map_Style = requests.get(
            f"https://api.maptiler.com/maps/019ae664-d223-7a00-9a67-e52c5bc63fac/style.json?key={settings.MAP_API}"
        )
        data = map_Style.json()
        return data
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.get("/items/{item_id}")
def read_item(item_id: int = Path(..., description="item id for this person")):
    return {"item_id": item_id}


@app.get("/test-db")
def test_db():
    try:
        engine = create_engine(settings.DIRECT_URL1)
        with Session(engine) as session:
            result = session.exec(select(London_Crime_Database).limit(1))
            return {"status": "success", "message": "Database connection works!"}
    except Exception as e:
        return {"status": "error", "error": str(e)}


@app.get("/LONDON_CRIME")
def read_item(crime: str = Query(...), date: str = Query(...)):
    engine = create_engine(settings.DIRECT_URL)
    with Session(engine) as session:
        crime_Param = crime.replace("+", " ")
        print("===========>", crime_Param)
        statement = select(London_Crime_Database).where(
            London_Crime_Database.major_Crime == crime_Param,
        )
        results = session.exec(statement).all()
    return results


@app.get("/LONDON_POLYGON")
def read_item():
    engine = create_engine(settings.DIRECT_URL)
    with Session(engine) as session:
        print("Fetching data ===========>")
        statement = select(
            London_Polygon_Database.Borough_Name, London_Polygon_Database.coordinates
        )
        result = session.exec(statement).all()
    return [
        {"Borough_Name": borough_name, "coordinates": coordinates}
        for borough_name, coordinates in result
    ]


@app.get("/SAN_FRANCISCO_CRIME")
def read_item(crime: str = Query(...), date: str = Query(...)):
    print("We are here =========>")
    engine = create_engine(settings.DIRECT_URL)
    with Session(engine) as session:
        crime_Param = crime.replace("+", " ")
        print("===========>", crime_Param)
        statement = select(San_Francisco_Data_Base).where(
            San_Francisco_Data_Base.major_Crime == crime_Param,
        )
        results = session.exec(statement).all()
    return results


@app.get("/SAN_FRANCISCO_POLYGON")
def read_item():
    engine = create_engine(settings.DIRECT_URL)
    with Session(engine) as session:
        print("Fetching data ===========>")
        statement = select(
            San_Francisco_Polygon_Database.Borough_Name,
            San_Francisco_Polygon_Database.coordinates,
        )
        result = session.exec(statement).all()
    return [
        {"Borough_Name": borough_name, "coordinates": coordinates}
        for borough_name, coordinates in result
    ]
