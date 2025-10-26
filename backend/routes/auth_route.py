from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from ..database import get_db
from ..services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])

class RegisterRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    try:
        return auth_service.register(db, request.email, request.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Register route error: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail="Registration failed")

@router.post("/login")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    try:
        return auth_service.login(db, request.email, request.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Login route error: {str(e)}")  # Debug log
        raise HTTPException(status_code=500, detail="Login failed")