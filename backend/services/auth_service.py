from passlib.context import CryptContext
from sqlmodel import Session
from models.user_model import User
from jose import JWTError, jwt
from datetime import datetime, timedelta
import os
import secrets
import logging

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
logger = logging.getLogger("auth_service")

# SECRET_KEY should be set in production through environment variables.
# If missing, fall back to a generated key but log a warning so the user can fix it.
# For development, default to a stable dev secret so the server can run without
# requiring an env var. In production, set the SECRET_KEY env var.
SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret")

# ACCESS_TOKEN_EXPIRE_MINUTES: default to 30 minutes if not provided or invalid
try:
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
except (TypeError, ValueError):
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
    logger.warning("ACCESS_TOKEN_EXPIRE_MINUTES env var invalid. Falling back to 30 minutes.")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")
    return encoded_jwt

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def register(db: Session, email: str, password: str):
    db_user = User(email=email, hashed_password=get_password_hash(password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User registered successfully"}

def login(db: Session, email: str, password: str):
    db_user = db.query(User).filter(User.email == email).first()
    if not db_user or not verify_password(password, db_user.hashed_password):
        raise ValueError("Invalid credentials")
    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}