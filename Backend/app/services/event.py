from sqlalchemy.orm import Session
from app.models.event import Event
from app.models.application import Application


def get_events(db: Session):
    return db.query(Event).all()


def get_event(db: Session, event_id: int):
    return db.query(Event).filter(
        Event.id == event_id
    ).first()


def create_event(db: Session, event):
    db_event = Event(
        Event_Name=event.Event_Name,
        Date=event.Date,
        Location=event.Location,
        Description=event.Description,
        Organization_ID=event.Organization_ID,
        Maximum_Volunteers=event.Maximum_Volunteers,
        Status="Available"
    )

    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    return db_event


def update_event(db: Session, event_id: int, event):
    db_event = db.query(Event).filter(
        Event.id == event_id
    ).first()

    if not db_event:
        return None

    db_event.Event_Name = event.Event_Name
    db_event.Date = event.Date
    db_event.Location = event.Location
    db_event.Description = event.Description
    db_event.Organization_ID = event.Organization_ID
    db_event.Maximum_Volunteers = event.Maximum_Volunteers

    application_count = db.query(Application).filter(
        Application.Event_ID == event_id
    ).count()

    if db_event.Maximum_Volunteers is not None:
        if application_count >= db_event.Maximum_Volunteers:
            db_event.Status = "Full"
        else:
            db_event.Status = "Available"

    db.commit()
    db.refresh(db_event)

    return db_event


def delete_event(db: Session, event_id: int):
    db_event = db.query(Event).filter(
        Event.id == event_id
    ).first()

    if not db_event:
        return None

    db.delete(db_event)
    db.commit()

    return db_event