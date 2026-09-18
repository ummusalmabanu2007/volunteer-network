from sqlalchemy import Column, Integer, String
from app.core.database import Base


class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20))
    address = Column(String(255))
    skills = Column(String(255))
    password = Column(String(255), nullable=True)