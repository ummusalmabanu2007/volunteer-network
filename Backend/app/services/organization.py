from sqlalchemy.orm import Session
from app.models.organization import Organization
from app.schemas.organization import OrganizationCreate


def create_organization(db: Session, organization: OrganizationCreate):
    db_organization = Organization(**organization.model_dump())
    db.add(db_organization)
    db.commit()
    db.refresh(db_organization)
    return db_organization


def get_organizations(db: Session):
    return db.query(Organization).all()


def get_organization(db: Session, organization_id: int):
    return db.query(Organization).filter(
        Organization.Organization_ID == organization_id
    ).first()


def update_organization(
    db: Session,
    organization_id: int,
    organization: OrganizationCreate
):
    db_organization = db.query(Organization).filter(
        Organization.Organization_ID == organization_id
    ).first()

    if not db_organization:
        return None

    db_organization.Name = organization.Name
    db_organization.Email = organization.Email
    db_organization.Phone = organization.Phone
    db_organization.Address = organization.Address

    db.commit()
    db.refresh(db_organization)

    return db_organization


def delete_organization(db: Session, organization_id: int):
    db_organization = db.query(Organization).filter(
        Organization.Organization_ID == organization_id
    ).first()

    if not db_organization:
        return None

    db.delete(db_organization)
    db.commit()

    return db_organization