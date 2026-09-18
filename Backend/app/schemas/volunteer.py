from pydantic import BaseModel


class VolunteerCreate(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    skills: str


class VolunteerUpdate(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    skills: str


class VolunteerResponse(VolunteerCreate):
    id: int

    class Config:
        from_attributes = True