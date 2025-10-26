from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routes import auth_route, symptom_routes, report_routes, ocr_routes, chat_routes

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Disease Predictor API",
    description="disease prediction and health monitoring system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_route.router)
app.include_router(symptom_routes.router)
app.include_router(report_routes.router)
app.include_router(ocr_routes.router)
app.include_router(chat_routes.router)

@app.get("/")
def read_root():
    return {"message": "Disease Predictor API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", reload=True)