from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_route, symptom_routes, report_routes, ocr_routes, chat_routes
from database import engine  # For DB initialization
from sqlmodel import SQLModel
import os

app = FastAPI(title="Disease Predictor with Chatbot Integration")

# CORS setup
# Build CORS origins list from FRONTEND_URL if present
frontend_url = os.environ.get("FRONTEND_URL")
origins = [frontend_url.rstrip("/")] if frontend_url else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_route.router, prefix="/auth", tags=["auth"])
app.include_router(symptom_routes.router, prefix="/predict", tags=["predict"])
app.include_router(report_routes.router, prefix="/report", tags=["report"])
app.include_router(ocr_routes.router, prefix="/ocr", tags=["ocr"])
app.include_router(chat_routes.router, prefix="/chat", tags=["chat"])

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)  # Create DB tables

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", reload=True)