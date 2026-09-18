from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.volunteer import VolunteerCreate, VolunteerResponse, VolunteerUpdate
from app.services.volunteer import (
    create_volunteer,
    get_volunteers,
    get_volunteer,
    update_volunteer,
    delete_volunteer,
)

router = APIRouter(prefix="/volunteers", tags=["Volunteers"])


@router.post("/", response_model=VolunteerResponse)
def create(data: VolunteerCreate, db: Session = Depends(get_db)):
    return create_volunteer(db, data)


@router.get("/", response_model=list[VolunteerResponse])
def read_all(db: Session = Depends(get_db)):
    return get_volunteers(db)


@router.get("/{volunteer_id}", response_model=VolunteerResponse)
def read_one(volunteer_id: int, db: Session = Depends(get_db)):
    volunteer = get_volunteer(db, volunteer_id)

    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    return volunteer


@router.put("/{volunteer_id}", response_model=VolunteerResponse)
def update(
    volunteer_id: int,
    data: VolunteerUpdate,
    db: Session = Depends(get_db)
):
    volunteer = update_volunteer(db, volunteer_id, data)

    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    return volunteer


@router.delete("/{volunteer_id}")
def delete(volunteer_id: int, db: Session = Depends(get_db)):
    volunteer = delete_volunteer(db, volunteer_id)

    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    return {"message": "Volunteer deleted successfully"}