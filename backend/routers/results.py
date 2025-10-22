from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime

from database import get_collection, SessionInDB, UserInDB

router = APIRouter()

class ResultSummary(BaseModel):
    session_id: str
    user_id: str
    user_name: str
    education_level: str
    total_score: float
    max_score: int = 30
    interpretation: str
    section_scores: Dict[str, Any]
    requires_manual_review: bool
    completed_at: datetime
    
class DetailedResult(ResultSummary):
    individual_results: List[Dict[str, Any]]

@router.get("/{session_id}", response_model=DetailedResult)
async def get_results(session_id: str):
    """
    Get aggregated results for a session
    """
    sessions_collection = get_collection("sessions")
    users_collection = get_collection("users")
    results_collection = get_collection("results")
    
    # Get session
    session = await sessions_collection.find_one({"_id": session_id})
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Get user
    user = await users_collection.find_one({"_id": session["user_id"]})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get all results for this session
    individual_results = []
    async for result in results_collection.find({"session_id": session_id}):
        individual_results.append({
            "section_name": result["section_name"],
            "raw_score": result["raw_score"],
            "confidence": result["confidence"],
            "details": result.get("details", {}),
            "requires_manual_review": result.get("requires_manual_review", False)
        })
    
    # Calculate total score with education adjustment
    total_score = session["total_score"]
    
    # Apply education adjustment (+1 if not college level)
    if user["education_level"] != "college_level":
        total_score = min(total_score + 1, 30)  # Cap at 30
    
    # Determine interpretation
    if total_score >= 26:
        interpretation = "Normal"
    elif total_score >= 18:
        interpretation = "Mild Cognitive Impairment"
    elif total_score >= 10:
        interpretation = "Moderate Cognitive Impairment"
    else:
        interpretation = "Severe Cognitive Impairment"
    
    return DetailedResult(
        session_id=session_id,
        user_id=session["user_id"],
        user_name=user["name"],
        education_level=user["education_level"],
        total_score=total_score,
        max_score=30,
        interpretation=interpretation,
        section_scores=session.get("section_scores", {}),
        requires_manual_review=session.get("requires_manual_review", False),
        completed_at=session.get("updated_at", session["created_at"]),
        individual_results=individual_results
    )

@router.get("/user/{user_id}/history", response_model=List[ResultSummary])
async def get_user_history(user_id: str):
    """
    Get all test results for a user
    """
    sessions_collection = get_collection("sessions")
    users_collection = get_collection("users")
    
    # Get user
    user = await users_collection.find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get all sessions
    history = []
    async for session in sessions_collection.find({"user_id": user_id}).sort("created_at", -1):
        total_score = session["total_score"]
        
        # Apply education adjustment
        if user["education_level"] != "college_level":
            total_score = min(total_score + 1, 30)
        
        # Determine interpretation
        if total_score >= 26:
            interpretation = "Normal"
        elif total_score >= 18:
            interpretation = "Mild Cognitive Impairment"
        elif total_score >= 10:
            interpretation = "Moderate Cognitive Impairment"
        else:
            interpretation = "Severe Cognitive Impairment"
        
        history.append(ResultSummary(
            session_id=session["_id"],
            user_id=user_id,
            user_name=user["name"],
            education_level=user["education_level"],
            total_score=total_score,
            interpretation=interpretation,
            section_scores=session.get("section_scores", {}),
            requires_manual_review=session.get("requires_manual_review", False),
            completed_at=session.get("updated_at", session["created_at"])
        ))
    
    return history
