from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime

from database import get_collection, SessionInDB, UserInDB

router = APIRouter()

class SessionSummary(BaseModel):
    session_id: str
    user_id: str
    user_name: str
    user_email: str
    education_level: str
    total_score: float
    interpretation: str
    requires_manual_review: bool
    completed_sections: List[str]
    start_time: datetime
    end_time: Optional[datetime]

class AdminDashboardStats(BaseModel):
    total_sessions: int
    sessions_requiring_review: int
    total_users: int
    avg_score: float
    interpretation_distribution: Dict[str, int]

@router.get("/dashboard/stats", response_model=AdminDashboardStats)
async def get_dashboard_stats():
    """
    Get overall dashboard statistics
    """
    sessions_collection = get_collection("sessions")
    users_collection = get_collection("users")
    
    # Get all sessions
    all_sessions = await sessions_collection.find({})
    
    total_sessions = len(all_sessions)
    sessions_requiring_review = sum(1 for s in all_sessions if s.get("requires_manual_review", False))
    
    # Calculate average score
    scores = [s.get("total_score", 0.0) for s in all_sessions if s.get("total_score", 0.0) > 0]
    avg_score = sum(scores) / len(scores) if scores else 0.0
    
    # Interpretation distribution
    interpretation_dist = {
        "Normal": 0,
        "Mild": 0,
        "Moderate": 0,
        "Severe": 0
    }
    
    for session in all_sessions:
        # Use stored interpretation if available
        interpretation = session.get("interpretation")
        if interpretation:
            interp_key = interpretation if interpretation in interpretation_dist else "Severe"
            interpretation_dist[interp_key] += 1
        else:
            # Fallback to score-based calculation
            score = session.get("total_score", 0.0)
            if score >= 26:
                interpretation_dist["Normal"] += 1
            elif score >= 18:
                interpretation_dist["Mild"] += 1
            elif score >= 10:
                interpretation_dist["Moderate"] += 1
            else:
                interpretation_dist["Severe"] += 1
    
    # Get total users
    all_users = await users_collection.find({})
    total_users = len(all_users)
    
    return AdminDashboardStats(
        total_sessions=total_sessions,
        sessions_requiring_review=sessions_requiring_review,
        total_users=total_users,
        avg_score=round(avg_score, 2),
        interpretation_distribution=interpretation_dist
    )

@router.get("/sessions", response_model=List[SessionSummary])
async def get_all_sessions(
    requires_review: Optional[bool] = Query(None, description="Filter by manual review flag"),
    limit: int = Query(100, description="Maximum number of sessions to return"),
    skip: int = Query(0, description="Number of sessions to skip")
):
    """
    Get all sessions with optional filters
    Admin endpoint to view all test sessions
    """
    sessions_collection = get_collection("sessions")
    users_collection = get_collection("users")
    
    # Build query
    query = {}
    if requires_review is not None:
        query["requires_manual_review"] = requires_review
    
    # Get sessions (sorted by most recent first)
    sessions = await sessions_collection.find(query)
    sessions = sorted(sessions, key=lambda x: x.get("created_at", datetime.min), reverse=True)
    
    # Apply pagination
    sessions = sessions[skip:skip + limit]
    
    # Get user details for each session
    session_summaries = []
    for session in sessions:
        user = await users_collection.find_one({"_id": session["user_id"]})
        
        if not user:
            continue
        
        # Use stored values from session aggregation
        total_score = float(session.get("total_score", 0.0))
        interpretation = session.get("interpretation") or "Pending"
        
        session_summaries.append(SessionSummary(
            session_id=session["_id"],
            user_id=session["user_id"],
            user_name=user["name"],
            user_email=user["email"],
            education_level=user["education_level"],
            total_score=total_score,
            interpretation=interpretation,
            requires_manual_review=session.get("requires_manual_review", False),
            completed_sections=session.get("completed_sections", []),
            start_time=session["start_time"],
            end_time=session.get("end_time")
        ))
    
    return session_summaries

@router.get("/sessions/{session_id}/detailed", response_model=Dict[str, Any])
async def get_session_detailed(session_id: str):
    """
    Get detailed session information including all individual test results
    Admin endpoint for manual review
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
    individual_results = await results_collection.find({"session_id": session_id})
    
    # Organize results by section
    results_by_section = {}
    for result in individual_results:
        section_name = result["section_name"]
        results_by_section[section_name] = {
            "raw_score": result["raw_score"],
            "confidence": result["confidence"],
            "details": result.get("details", {}),
            "requires_manual_review": result.get("requires_manual_review", False),
            "created_at": result["created_at"]
        }
    
    total_score = session.get("total_score", 0.0)
    
    # Apply education adjustment
    if user.get("education_level") != "college_level":
        adjusted_score = min(total_score + 1, 30)
    else:
        adjusted_score = total_score
    
    return {
        "session": {
            "session_id": session["_id"],
            "start_time": session["start_time"],
            "end_time": session.get("end_time"),
            "completed_sections": session.get("completed_sections", []),
            "total_score": total_score,
            "adjusted_score": adjusted_score,
            "requires_manual_review": session.get("requires_manual_review", False)
        },
        "user": {
            "user_id": user["_id"],
            "name": user["name"],
            "email": user["email"],
            "education_years": user["education_years"],
            "education_level": user["education_level"]
        },
        "results_by_section": results_by_section
    }

@router.put("/sessions/{session_id}/review", response_model=Dict[str, Any])
async def update_manual_review(
    session_id: str,
    requires_review: bool,
    notes: Optional[str] = None
):
    """
    Update manual review flag for a session
    Admin endpoint to mark sessions as reviewed or requiring review
    """
    sessions_collection = get_collection("sessions")
    
    session = await sessions_collection.find_one({"_id": session_id})
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    update_data = {
        "requires_manual_review": requires_review,
        "updated_at": datetime.utcnow()
    }
    
    if notes:
        update_data["review_notes"] = notes
    
    await sessions_collection.update_one(
        {"_id": session_id},
        {"$set": update_data}
    )
    
    return {
        "success": True,
        "session_id": session_id,
        "requires_manual_review": requires_review,
        "message": "Manual review status updated successfully"
    }
