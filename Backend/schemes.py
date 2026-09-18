from pydantic import BaseModel

class VolunteerCreate(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    skills: str