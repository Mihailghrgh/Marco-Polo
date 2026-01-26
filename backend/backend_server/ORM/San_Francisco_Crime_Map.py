print("LOADED SAN FRANCISCO MODEL FILE")
from typing import List
from typing import Optional
from sqlalchemy import ForeignKey
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship
from sqlmodel import SQLModel, Field
from uuid import UUID
from sqlmodel import SQLModel, Field
from typing import ClassVar

class San_Francisco_Data_Base(SQLModel, table=True):
    __tablename__ = "San_Francisco_Database_2024_2025"

    id: UUID | None = Field(default=None, primary_key=True)

    major_Crime: str
    borough_Name: str
    specific_Crime: str
    longitude: str
    latitude: str
    jan_2024: str
    feb_2024: str
    mar_2024: str
    apr_2024: str
    may_2024: str
    jun_2024: str
    jul_2024: str
    aug_2024: str
    sep_2024: str
    oct_2024: str
    nov_2024: str
    dec_2024: str

    jan_2025: str
    feb_2025: str
    mar_2025: str
    apr_2025: str
    may_2025: str
    jun_2025: str
    jul_2025: str
    aug_2025: str
    sep_2025: str
    oct_2025: str
