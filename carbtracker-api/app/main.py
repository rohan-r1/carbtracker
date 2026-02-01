from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import analysis, meals

settings = get_settings()

app = FastAPI(
    title="CarbTracker API",
    description="AI-powered carbohydrate estimation for Type 1 diabetics",
    version="0.1.0",
)

# CORS middleware for mobile app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to app domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analysis.router, prefix="/api/v1", tags=["analysis"])
app.include_router(meals.router, prefix="/api/v1", tags=["meals"])


@app.get("/")
def root():
    return {"message": "CarbTracker API", "version": "0.1.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
