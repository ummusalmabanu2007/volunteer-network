
from datetime import date
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.event import Event
from app.models.application import Application


def update_event_status(db: Session, event):
    if event.Date < date.today():
        event.Status = "Completed"
        return

    active_count = (
        db.query(Application)
        .filter(
            Application.Event_ID == event.id,
            func.lower(
                func.trim(func.coalesce(Application.Status, ""))
            ) != "cancelled",
        )
        .count()
    )

    if (
        event.Maximum_Volunteers is not None
        and active_count >= event.Maximum_Volunteers
    ):
        event.Status = "Full"
    else:
        event.Status = "Available"


def get_events(db: Session):
    events = db.query(Event).all()

    for event in events:
        update_event_status(db, event)

    db.commit()
    return events


def get_event(db: Session, event_id: int):
    event = db.query(Event).filter(Event.id == event_id).first()

    if event is None:
        return None

    update_event_status(db, event)
    db.commit()
    return event


def create_event(db: Session, event):
    maximum = event.Maximum_Volunteers

    if maximum is not None and maximum < 1:
        raise ValueError("Maximum Volunteers must be at least 1")

    db_event = Event(
        Event_Name=event.Event_Name,
        Date=event.Date,
        Location=event.Location,
        Description=event.Description,
        Organization_ID=event.Organization_ID,
        Maximum_Volunteers=maximum,
        Status="Available",
    )

    db.add(db_event)
    db.flush()
    update_event_status(db, db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def update_event(db: Session, event_id: int, event):
    db_event = db.query(Event).filter(Event.id == event_id).first()

    if db_event is None:
        return None

    maximum = event.Maximum_Volunteers

    if maximum is not None and maximum < 1:
        raise ValueError("Maximum Volunteers must be at least 1")

    db_event.Event_Name = event.Event_Name
    db_event.Date = event.Date
    db_event.Location = event.Location
    db_event.Description = event.Description
    db_event.Organization_ID = event.Organization_ID
    db_event.Maximum_Volunteers = maximum

    update_event_status(db, db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def delete_event(db: Session, event_id: int):
    db_event = db.query(Event).filter(Event.id == event_id).first()

    if db_event is None:
        return None

    db.delete(db_event)
    db.commit()
    return db_event
