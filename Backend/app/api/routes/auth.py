from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import hash_password, verify_password

from app.models.volunteer import Volunteer
from app.models.organization import Organization
from app.models.admin import Admin

from app.schemas.auth import RegisterRequest, LoginRequest
from app.schemas.organization_auth import OrganizationLoginRequest
from app.schemas.admin_auth import AdminLoginRequest


router = APIRouter(prefix="/auth", tags=["Authentication"])


# =========================
# VOLUNTEER REGISTER
# =========================

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):

    if data.password != data.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match"
        )

    existing_volunteer = db.query(Volunteer).filter(
        Volunteer.email == data.email
    ).first()

    if existing_volunteer:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_volunteer = Volunteer(
        name=data.name,
        email=data.email,
        phone=data.phone,
        address=data.address,
        skills=data.skills,
        password=hash_password(data.password)
    )

    db.add(new_volunteer)
    db.commit()
    db.refresh(new_volunteer)

    return {
        "message": "Registration successful",
        "volunteer_id": new_volunteer.id
    }


# =========================
# VOLUNTEER LOGIN
# =========================

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    volunteer = db.query(Volunteer).filter(
        Volunteer.email == data.email
    ).first()

    if not volunteer:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not volunteer.password:
        raise HTTPException(
            status_code=401,
            detail="Please register again with a password"
        )

    if not verify_password(data.password, volunteer.password):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "volunteer_id": volunteer.id,
        "name": volunteer.name
    }


# =========================
# ORGANIZATION LOGIN
# =========================

@router.post("/organization-login")
def organization_login(
    data: OrganizationLoginRequest,
    db: Session = Depends(get_db)
):

    organization = db.query(Organization).filter(
        Organization.Email == data.email
    ).first()

    if not organization:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not organization.password:
        raise HTTPException(
            status_code=401,
            detail="Organization password is not set"
        )

    if not verify_password(
        data.password,
        organization.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Organization login successful",
        "organization_id": organization.Organization_ID,
        "name": organization.Name
    }


# =========================
# ADMIN LOGIN
# =========================

@router.post("/admin-login")
def admin_login(
    data: AdminLoginRequest,
    db: Session = Depends(get_db)
):

    admin = db.query(Admin).filter(
        Admin.Email == data.email
    ).first()

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        data.password,
        admin.Password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Admin login successful",
        "admin_id": admin.Admin_ID,
        "name": admin.Name
    }