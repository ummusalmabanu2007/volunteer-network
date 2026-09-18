from pydantic import BaseModel


class OrganizationCreate(BaseModel):
    Name: str
    Email: str
    Phone: str | None = None
    Address: str | None = None


class OrganizationResponse(OrganizationCreate):
    Organization_ID: int

    class Config:
        from_attributes = True