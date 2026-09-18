from sqlalchemy import Column, Integer, String
from app.core.database import Base


class Organization(Base):
    __tablename__ = "organization"

    Organization_ID = Column(Integer, primary_key=True, index=True)
    Name = Column(String(100), nullable=False)
    Email = Column(String(100), nullable=False, unique=True)
    Phone = Column(String(15))
    Address = Column(String(255))
    password = Column(String(255), nullable=True)