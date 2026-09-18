from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.organization import OrganizationCreate, OrganizationResponse
from app.services.organization import (
    create_organization,
    get_organizations,
    get_organization,
    update_organization,
    delete_organization
)

router = APIRouter(prefix="/organizations", tags=["Organizations"])


@router.post("/", response_model=OrganizationResponse)
def create(data: OrganizationCreate, db: Session = Depends(get_db)):
    return create_organization(db, data)


@router.get("/", response_model=list[OrganizationResponse])
def read_all(db: Session = Depends(get_db)):
    return get_organizations(db)


@router.get("/{organization_id}", response_model=OrganizationResponse)
def read_one(organization_id: int, db: Session = Depends(get_db)):
    organization = get_organization(db, organization_id)

    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")

    return organization


@router.put("/{organization_id}", response_model=OrganizationResponse)
def update(
    organization_id: int,
    data: OrganizationCreate,
    db: Session = Depends(get_db)
):
    organization = update_organization(db, organization_id, data)

    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")

    return organization


@router.delete("/{organization_id}")
def delete(organization_id: int, db: Session = Depends(get_db)):
    organization = delete_organization(db, organization_id)

    if not organization:
        raise HTTPException(status_code=404, detail="Organization not found")

    return {"message": "Organization deleted successfully"}