from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.application import ApplicationCreate, ApplicationResponse
from app.services.application import (
    create_application,
    get_applications,
    get_application,
    update_application,
    delete_application
)

router = APIRouter(prefix="/applications", tags=["Applications"])


@router.post("/", response_model=ApplicationResponse)
def create(data: ApplicationCreate, db: Session = Depends(get_db)):
    return create_application(db, data)


@router.get("/", response_model=list[ApplicationResponse])
def read_all(db: Session = Depends(get_db)):
    return get_applications(db)


@router.get("/{application_id}", response_model=ApplicationResponse)
def read_one(application_id: int, db: Session = Depends(get_db)):
    application = get_application(db, application_id)

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    return application


@router.put("/{application_id}", response_model=ApplicationResponse)
def update(
    application_id: int,
    data: ApplicationCreate,
    db: Session = Depends(get_db)
):
    application = update_application(db, application_id, data)

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    return application


@router.delete("/{application_id}")
def delete(application_id: int, db: Session = Depends(get_db)):
    application = delete_application(db, application_id)

    if not application:
        raise HTTPException(status_code=404, detail="Application not found")

    return {"message": "Application deleted successfully"}