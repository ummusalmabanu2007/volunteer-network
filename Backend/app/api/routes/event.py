from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.event import EventCreate, EventResponse
from app.services.event import (
    create_event,
    get_events,
    get_event,
    update_event,
    delete_event
)

router = APIRouter(prefix="/events", tags=["Events"])


@router.post("/", response_model=EventResponse)
def create(data: EventCreate, db: Session = Depends(get_db)):
    return create_event(db, data)


@router.get("/", response_model=list[EventResponse])
def read_all(db: Session = Depends(get_db)):
    return get_events(db)


@router.get("/{event_id}", response_model=EventResponse)
def read_one(event_id: int, db: Session = Depends(get_db)):
    event = get_event(db, event_id)

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    return event


@router.put("/{event_id}", response_model=EventResponse)
def update(event_id: int, data: EventCreate, db: Session = Depends(get_db)):
    event = update_event(db, event_id, data)

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    return event


@router.delete("/{event_id}")
def delete(event_id: int, db: Session = Depends(get_db)):
    event = delete_event(db, event_id)

    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    return {"message": "Event deleted successfully"}