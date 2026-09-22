from sqlalchemy import Column, Integer, String, Date
from app.core.database import Base


class Event(Base):
    __tablename__ = "event"

    id = Column("Event_ID", Integer, primary_key=True, index=True)
    Event_Name = Column(String(150), nullable=False)
    Date = Column(Date, nullable=False)
    Location = Column(String(255))
    Description = Column(String(500))
    Organization_ID = Column(Integer)
    Maximum_Volunteers = Column(Integer)
    Status = Column(String(20), nullable=False, default="Available")