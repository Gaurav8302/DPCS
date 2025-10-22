from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from datetime import datetime
import uuid

from database import (
    get_collection,
    SessionCreate,
    SessionUpdate,
    SessionInDB
)

router = APIRouter()

@router.post("/", response_model=SessionInDB, status_code=status.HTTP_201_CREATED)
async def create_session(session: SessionCreate):
    """
    Create a new test session
    """
    sessions_collection = get_collection("sessions")
    users_collection = get_collection("users")
    
    # Verify user exists
    user = await users_collection.find_one({"_id": session.user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Create session document
    session_id = str(uuid.uuid4())
    session_doc = {
        "_id": session_id,
        "user_id": session.user_id,
        "start_time": datetime.utcnow(),
        "completed_sections": [],
        "total_score": 0.0,
        "requires_manual_review": False,
        "section_scores": {},
        "created_at": datetime.utcnow(),
        "updated_at": None
    }
    
    await sessions_collection.insert_one(session_doc)
    
    return SessionInDB(**session_doc)

@router.get("/{session_id}", response_model=SessionInDB)
async def get_session(session_id: str):
    """
    Get session by ID
    """
    sessions_collection = get_collection("sessions")
    session = await sessions_collection.find_one({"_id": session_id})
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    return SessionInDB(**session)

@router.put("/{session_id}", response_model=SessionInDB)
async def update_session(session_id: str, session_update: SessionUpdate):
    """
    Update session progress
    """
    sessions_collection = get_collection("sessions")
    
    # Check if session exists
    existing_session = await sessions_collection.find_one({"_id": session_id})
    if not existing_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Prepare update data
    update_data = {
        "updated_at": datetime.utcnow()
    }
    
    if session_update.completed_sections is not None:
        update_data["completed_sections"] = session_update.completed_sections
    if session_update.total_score is not None:
        update_data["total_score"] = session_update.total_score
    if session_update.requires_manual_review is not None:
        update_data["requires_manual_review"] = session_update.requires_manual_review
    if session_update.section_scores is not None:
        update_data["section_scores"] = session_update.section_scores
    
    # Update session
    await sessions_collection.update_one(
        {"_id": session_id},
        {"$set": update_data}
    )
    
    # Retrieve updated session
    updated_session = await sessions_collection.find_one({"_id": session_id})
    return SessionInDB(**updated_session)

@router.get("/user/{user_id}", response_model=List[SessionInDB])
async def get_user_sessions(user_id: str):
    """
    Get all sessions for a user
    """
    sessions_collection = get_collection("sessions")
    
    sessions = []
    async for session in sessions_collection.find({"user_id": user_id}).sort("created_at", -1):
        sessions.append(SessionInDB(**session))
    
    return sessions

@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(session_id: str):
    """
    Delete a session and its results
    """
    sessions_collection = get_collection("sessions")
    results_collection = get_collection("results")
    
    # Delete session
    result = await sessions_collection.delete_one({"_id": session_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Delete associated results
    await results_collection.delete_many({"session_id": session_id})
    
    return None
