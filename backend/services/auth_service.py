from passlib.context import CryptContext
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from ..models.user_model import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def register(db: Session, email: str, password: str):
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise ValueError("Email already registered")
    
    try:
        # Hash password and create user
        hashed_password = get_password_hash(password)
        db_user = User(email=email, hashed_password=hashed_password)
        
        # Add to database
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        # Return success response
        return {
            "message": "User registered successfully",
            "user_id": db_user.id,
            "email": db_user.email
        }
    except IntegrityError:
        db.rollback()
        raise ValueError("Email already registered")
    except Exception as e:
        db.rollback()
        print(f"Registration error: {str(e)}")  # Debug log
        raise Exception(f"Registration failed: {str(e)}")

def login(db: Session, email: str, password: str):
    # Find user by email
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        raise ValueError("Invalid email or password")
    
    # Verify password
    if not verify_password(password, user.hashed_password):
        raise ValueError("Invalid email or password")
    
    # Return user info and token (you can add JWT token generation here)
    return {
        "access_token": "dummy-token-" + str(user.id),
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email
    }