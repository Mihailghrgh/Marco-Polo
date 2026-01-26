from typing import List
from typing import Optional
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy import JSON
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlmodel import SQLModel, Field, Column, JSON
from uuid import UUID
from sqlalchemy.dialects.postgresql import JSONB


type Coords = list[list[float, float]]


class San_Francisco_Polygon_Database(SQLModel, table=True):
    __tablename__ = "San_Francisco_Borough_Polygon"

    id: int | None = Field(default=None, primary_key=True)
    Borough_Name: str
    coordinates: Coords = Field(sa_column=Column(JSONB))
    latitude: str
    longitude: str
