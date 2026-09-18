from sqlalchemy import Column, Integer, String

from app.core.database import Base


class Admin(Base):
    __tablename__ = "admin"

    Admin_ID = Column(Integer, primary_key=True, index=True)
    Name = Column(String(100), nullable=False)
    Email = Column(String(100), unique=True, nullable=False)
    Password = Column(String(255), nullable=False)