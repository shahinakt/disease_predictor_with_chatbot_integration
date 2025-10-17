from fastapi import APIRouter, Depends, HTTPException
from services import auth_service
from sqlmodel import Session
from database import engine

router = APIRouter()

def get_db():
    with Session(engine) as session:
        yield session

@router.post("/register")
def register(email: str, password: str, db=Depends(get_db)):
    return auth_service.register(db, email, password)

@router.post("/login")
def login(email: str, password: str, db=Depends(get_db)):
    return auth_service.login(db, email, password)