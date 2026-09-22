from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.application import Application
from app.models.event import Event


def get_applications(db: Session):
    return db.query(Application).all()


def get_application(db: Session, application_id: int):
    return db.query(Application).filter(
        Application.Application_ID == application_id
    ).first()


def create_application(db: Session, application):
    # Check duplicate application
    existing_application = db.query(Application).filter(
        Application.Volunteer_ID == application.Volunteer_ID,
        Application.Event_ID == application.Event_ID
    ).first()

    if existing_application:
        raise HTTPException(
            status_code=400,
            detail="Volunteer has already applied for this event"
        )

    # Get event
    event = db.query(Event).filter(
        Event.id== application.Event_ID
    ).first()

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    # Check completed event
    if event.Status == "Completed":
        raise HTTPException(
            status_code=400,
            detail="Event is completed"
        )

    # Count current applications
    application_count = db.query(Application).filter(
        Application.Event_ID == application.Event_ID
    ).count()

    # Check maximum volunteers
    if event.Maximum_Volunteers is not None:
        if application_count >= event.Maximum_Volunteers:
            event.Status = "Full"
            db.commit()

            raise HTTPException(
                status_code=400,
                detail="Event Full"
            )

    # Create application
    new_application = Application(
        Volunteer_ID=application.Volunteer_ID,
        Event_ID=application.Event_ID,
        Applied_Date=application.Applied_Date,
        Status=application.Status
    )

    db.add(new_application)

    # Update event status
    if event.Maximum_Volunteers is not None:
        if application_count + 1 >= event.Maximum_Volunteers:
            event.Status = "Full"
        else:
            event.Status = "Available"

    db.commit()
    db.refresh(new_application)

    return new_application


def update_application(db: Session, application_id: int, application):
    db_application = db.query(Application).filter(
        Application.Application_ID == application_id
    ).first()

    if not db_application:
        return None

    db_application.Volunteer_ID = application.Volunteer_ID
    db_application.Event_ID = application.Event_ID
    db_application.Applied_Date = application.Applied_Date
    db_application.Status = application.Status

    db.commit()
    db.refresh(db_application)

    return db_application


def delete_application(db: Session, application_id: int):
    db_application = db.query(Application).filter(
        Application.Application_ID == application_id
    ).first()

    if not db_application:
        return None

    db.delete(db_application)
    db.commit()

    return db_application