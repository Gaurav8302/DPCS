from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from database.connection import connect_to_mongo, close_mongo_connection
from routers import (
    sessions,
    scoring,
    verification,
    results,
    users
)

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifespan events"""
    # Startup: Connect to MongoDB
    await connect_to_mongo()
    yield
    # Shutdown: Close MongoDB connection
    await close_mongo_connection()

app = FastAPI(
    title="Dimentia Project API",
    version="2.0.0",
    description="AI-powered cognitive assessment platform API",
    lifespan=lifespan
)

# CORS Configuration
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    from database.connection import get_database
    
    try:
        # Check database connection
        db = await get_database()
        await db.command("ping")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    return {
        "status": "healthy",
        "version": "2.0.0",
        "service": "dimentia-api",
        "database": db_status
    }

# Root endpoint
@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "message": "Dimentia Project API v2.0",
        "docs": "/docs",
        "health": "/health"
    }

# Include routers
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(sessions.router, prefix="/api/sessions", tags=["Sessions"])
app.include_router(scoring.router, prefix="/api/score", tags=["Scoring"])
app.include_router(verification.router, prefix="/api/verify", tags=["Verification"])
app.include_router(results.router, prefix="/api/results", tags=["Results"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
