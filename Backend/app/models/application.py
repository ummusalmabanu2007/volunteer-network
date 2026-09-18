from sqlalchemy import Column, Integer, Date, String
from app.core.database import Base


class Application(Base):
    __tablename__ = "application"

    Application_ID = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    Volunteer_ID = Column(Integer, nullable=False)
    Event_ID = Column(Integer, nullable=False)
    Applied_Date = Column(Date, nullable=True)
    Status = Column(String(50), nullable=True)