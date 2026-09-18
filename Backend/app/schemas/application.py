from pydantic import BaseModel
from datetime import date


class ApplicationCreate(BaseModel):
    Volunteer_ID: int
    Event_ID: int
    Applied_Date: date | None = None
    Status: str | None = None


class ApplicationResponse(ApplicationCreate):
    Application_ID: int

    class Config:
        from_attributes = True