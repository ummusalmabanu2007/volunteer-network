from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import volunteer
from app.api.routes import event
from app.api.routes import organization
from app.api.routes import application
from app.api.routes import auth


app = FastAPI(
    title="Volunteer Community Network API"
)


# Allow React frontend to connect with FastAPI backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {
        "message": "Volunteer Community Network Backend is Running"
    }


# API Routes
app.include_router(volunteer.router)
app.include_router(event.router)
app.include_router(organization.router)
app.include_router(application.router)
app.include_router(auth.router)