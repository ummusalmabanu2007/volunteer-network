from datetime import date
from pydantic import BaseModel


class EventCreate(BaseModel):
    Event_Name: str
    Date: date | None = None
    Location: str | None = None
    Description: str | None = None
    Organization_ID: int | None = None


class EventResponse(EventCreate):
    id: int

    class Config:
        from_attributes = True