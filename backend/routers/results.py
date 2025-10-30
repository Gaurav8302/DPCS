from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime

from database import get_collection, SessionInDB, UserInDB
from utils import MoCAScorer

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
    results = await results_collection.find(
        {"session_id": session_id},
        order_by=[("created_at", "ASC")]
    )

    individual_results = [
        {
            "section_name": result["section_name"],
            "raw_score": result["raw_score"],
            "confidence": result.get("confidence", 0.0),
            "details": result.get("details", {}),
            "requires_manual_review": result.get("requires_manual_review", False)
        }
        for result in results
    ]

    total_score = float(session.get("total_score", 0.0))
    interpretation = session.get("interpretation") or MoCAScorer.interpret_score(total_score)
    
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
    sessions = await sessions_collection.find(
        {"user_id": user_id},
        order_by=[("created_at", "DESC")]
    )

    history: List[ResultSummary] = []
    for session in sessions:
        total_score = float(session.get("total_score", 0.0))
        interpretation = session.get("interpretation") or MoCAScorer.interpret_score(total_score)

        history.append(ResultSummary(
            session_id=session["_id"],
            user_id=user_id,
            user_name=user["name"],
            education_level=user["education_level"],
            total_score=total_score,
            interpretation=interpretation or "Pending",
            section_scores=session.get("section_scores", {}),
            requires_manual_review=session.get("requires_manual_review", False),
            completed_at=session.get("updated_at", session["created_at"])
        ))

    return history
