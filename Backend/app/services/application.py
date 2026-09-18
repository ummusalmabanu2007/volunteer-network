from sqlalchemy.orm import Session
from app.models.application import Application


def get_applications(db: Session):
    return db.query(Application).all()


def get_application(db: Session, application_id: int):
    return db.query(Application).filter(
        Application.Application_ID == application_id
    ).first()


def create_application(db: Session, application):
    new_application = Application(
        Volunteer_ID=application.Volunteer_ID,
        Event_ID=application.Event_ID,
        Applied_Date=application.Applied_Date,
        Status=application.Status
    )

    db.add(new_application)
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