from pydantic import BaseModel


class RegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    address: str
    skills: str
    password: str
    confirm_password: str


class LoginRequest(BaseModel):
    email: str
    password: str
    