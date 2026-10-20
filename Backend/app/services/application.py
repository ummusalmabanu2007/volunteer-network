
from datetime import date

from fastapi import HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.application import Application
from app.models.event import Event


def is_cancelled_status(status):
    return str(status or "").strip().lower() == "cancelled"


def get_active_application_count(db: Session, event_id: int):
    return (
        db.query(Application)
        .filter(
            Application.Event_ID == event_id,
            func.lower(
                func.trim(func.coalesce(Application.Status, ""))
            ) != "cancelled",
        )
        .count()
    )


def refresh_event_status(db: Session, event):
    if event is None:
        return

    if event.Date < date.today():
        event.Status = "Completed"
        return

    active_count = get_active_application_count(db, event.id)

    if (
        event.Maximum_Volunteers is not None
        and active_count >= event.Maximum_Volunteers
    ):
        event.Status = "Full"
    else:
        event.Status = "Available"


def get_applications(db: Session):
    return db.query(Application).all()


def get_application(db: Session, application_id: int):
    return (
        db.query(Application)
        .filter(Application.Application_ID == application_id)
        .first()
    )


def create_application(db: Session, application):
    event = (
        db.query(Event)
        .filter(Event.id == application.Event_ID)
        .first()
    )

    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")

    refresh_event_status(db, event)

    if event.Status == "Completed":
        raise HTTPException(status_code=400, detail="Event is completed")

    existing_applications = (
        db.query(Application)
        .filter(
            Application.Volunteer_ID == application.Volunteer_ID,
            Application.Event_ID == application.Event_ID,
        )
        .all()
    )

    if any(
        not is_cancelled_status(item.Status)
        for item in existing_applications
    ):
        raise HTTPException(
            status_code=400,
            detail="Volunteer has already applied for this event",
        )

    active_count = get_active_application_count(db, event.id)

    if (
        event.Maximum_Volunteers is not None
        and active_count >= event.Maximum_Volunteers
    ):
        event.Status = "Full"
        db.commit()
        raise HTTPException(status_code=400, detail="Event Full")

    new_application = Application(
        Volunteer_ID=application.Volunteer_ID,
        Event_ID=application.Event_ID,
        Applied_Date=application.Applied_Date or date.today(),
        Status="Pending",
    )

    try:
        db.add(new_application)
        db.flush()

        refresh_event_status(db, event)

        db.commit()
        db.refresh(new_application)

        return new_application

    except Exception:
        db.rollback()
        raise


def cancel_application(
    db: Session,
    application_id: int,
    volunteer_id: int,
):
    application = (
        db.query(Application)
        .filter(
            Application.Application_ID == application_id,
            Application.Volunteer_ID == volunteer_id,
        )
        .first()
    )

    if application is None:
        raise HTTPException(
            status_code=404,
            detail="Application not found",
        )

    if is_cancelled_status(application.Status):
        raise HTTPException(
            status_code=400,
            detail="Application is already cancelled",
        )

    event = (
        db.query(Event)
        .filter(Event.id == application.Event_ID)
        .first()
    )

    if event is None:
        raise HTTPException(
            status_code=404,
            detail="Related event not found",
        )

    refresh_event_status(db, event)

    if event.Status == "Completed":
        raise HTTPException(
            status_code=400,
            detail="Completed event application cannot be cancelled",
        )

    try:
        application.Status = "Cancelled"
        application.Cancelled_Date = date.today()

        db.flush()
        refresh_event_status(db, event)

        db.commit()
        db.refresh(application)

        return {"message": "Application cancelled successfully"}

    except Exception:
        db.rollback()
        raise
