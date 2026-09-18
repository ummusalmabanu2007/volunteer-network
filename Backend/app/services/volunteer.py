from sqlalchemy.orm import Session
from app.models.volunteer import Volunteer
from app.schemas.volunteer import VolunteerCreate, VolunteerUpdate


def create_volunteer(db: Session, volunteer: VolunteerCreate):
    db_volunteer = Volunteer(**volunteer.model_dump())
    db.add(db_volunteer)
    db.commit()
    db.refresh(db_volunteer)
    return db_volunteer


def get_volunteers(db: Session):
    return db.query(Volunteer).all()


def get_volunteer(db: Session, volunteer_id: int):
    return db.query(Volunteer).filter(
        Volunteer.id == volunteer_id
    ).first()


def update_volunteer(db: Session, volunteer_id: int, data: VolunteerUpdate):
    volunteer = db.query(Volunteer).filter(
        Volunteer.id == volunteer_id
    ).first()

    if not volunteer:
        return None

    for key, value in data.model_dump().items():
        setattr(volunteer, key, value)

    db.commit()
    db.refresh(volunteer)
    return volunteer


def delete_volunteer(db: Session, volunteer_id: int):
    volunteer = db.query(Volunteer).filter(
        Volunteer.id == volunteer_id
    ).first()

    if not volunteer:
        return None

    db.delete(volunteer)
    db.commit()
    return volunteer