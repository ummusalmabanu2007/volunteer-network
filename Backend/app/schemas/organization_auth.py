from pydantic import BaseModel


class OrganizationLoginRequest(BaseModel):
    email: str
    password: str