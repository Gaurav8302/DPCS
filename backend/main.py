from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from database.connection import connect_to_firebase, close_firebase_connection
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
    # Startup: Connect to Firebase
    await connect_to_firebase()
    yield
    # Shutdown: Close Firebase connection
    await close_firebase_connection()

app = FastAPI(
    title="Dimentia Project API",
    version="2.0.0",
    description="AI-powered cognitive assessment platform API",
    lifespan=lifespan
)

# CORS Configuration - Allow local development origins
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

# Add common local development origins if not already present
default_local_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

# Merge with environment origins
all_origins = list(set([origin.strip() for origin in allowed_origins] + default_local_origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=all_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    from database.connection import get_firestore_client
    
    try:
        # Check Firestore connection
        db = get_firestore_client()
        _ = db.collection("_healthcheck").limit(1).get()
        db_status = "connected"
    except RuntimeError as e:
        # Firestore client not initialized
        db_status = "not_initialized"
    except Exception as e:
        # Firestore API might not be enabled
        error_msg = str(e)
        if "PERMISSION_DENIED" in error_msg or "SERVICE_DISABLED" in error_msg or "403" in error_msg:
            db_status = "firestore_api_not_enabled"
        else:
            db_status = f"error: {str(e)[:100]}"
    
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
