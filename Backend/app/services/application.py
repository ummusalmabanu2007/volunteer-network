from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.application import Application
from app.models.event import Event
from datetime import date


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
        Application.Event_ID == application.Event_ID,
        Application.Status != "Cancelled"
    ).first()

    if existing_application:
        raise HTTPException(
            status_code=400,
            detail="Volunteer has already applied for this event"
        )

    # Find event
    event = db.query(Event).filter(
        Event.id == application.Event_ID
    ).first()

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    # Completed event cannot be applied
    if event.Status == "Completed":
        raise HTTPException(
            status_code=400,
            detail="Event is completed"
        )

    # Count only active applications
    application_count = db.query(Application).filter(
        Application.Event_ID == application.Event_ID,
        Application.Status != "Cancelled"
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


# Cancel Application
def cancel_application(
    db: Session,
    application_id: int,
    volunteer_id: int
):

    application = db.query(Application).filter(
        Application.Application_ID == application_id,
        Application.Volunteer_ID == volunteer_id
    ).first()

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    # Already cancelled application
    if application.Status == "Cancelled":
        raise HTTPException(
            status_code=400,
            detail="Application is already cancelled"
        )

    # Find related event
    event = db.query(Event).filter(
        Event.id == application.Event_ID
    ).first()

    # Do not allow cancellation after event completion
    if event and event.Status == "Completed":
        raise HTTPException(
            status_code=400,
            detail="Completed event application cannot be cancelled"
        )

    # Mark application as cancelled
    application.Status = "Cancelled"
    application.Cancelled_Date = date.today()

    # Update event status after cancellation
    if event:

        remaining_applications = db.query(Application).filter(
            Application.Event_ID == event.id,
            Application.Application_ID != application_id,
            Application.Status != "Cancelled"
        ).count()

        if event.Maximum_Volunteers is not None:

            if remaining_applications < event.Maximum_Volunteers:
                event.Status = "Available"
            else:
                event.Status = "Full"

    db.commit()
    db.refresh(application)

    return {
        "message": "Application cancelled successfully"
    }