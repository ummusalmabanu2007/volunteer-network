from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.application import ApplicationCreate, ApplicationResponse
from app.services.application import (
    get_applications,
    get_application,
    create_application,
    cancel_application
)


router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)


# Get all applications
@router.get("/", response_model=list[ApplicationResponse])
def read_applications(db: Session = Depends(get_db)):
    return get_applications(db)


# Get cancelled applications
@router.get("/cancelled", response_model=list[ApplicationResponse])
def read_cancelled_applications(db: Session = Depends(get_db)):
    applications = get_applications(db)

    return [
        application
        for application in applications
        if application.Status == "Cancelled"
    ]


# Get application by ID
@router.get("/{application_id}", response_model=ApplicationResponse)
def read_application(
    application_id: int,
    db: Session = Depends(get_db)
):
    application = get_application(db, application_id)

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    return application


# Create application
@router.post("/", response_model=ApplicationResponse)
def create_new_application(
    application: ApplicationCreate,
    db: Session = Depends(get_db)
):
    return create_application(db, application)


# Cancel application
@router.delete("/{application_id}/{volunteer_id}")
def cancel_application_route(
    application_id: int,
    volunteer_id: int,
    db: Session = Depends(get_db)
):
    return cancel_application(
        db,
        application_id,
        volunteer_id
    )