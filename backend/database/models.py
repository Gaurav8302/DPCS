"""
Pydantic models for Firebase Firestore
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class EducationLevel(str, Enum):
    """Education level classification based on years of education per PRD"""
    NOT_EDUCATED = "not_educated"          # 0 years or "none"
    BASIC_SCHOOLING = "basic_schooling"    # 1-12 years
    COLLEGE_LEVEL = "college_level"        # 13+ years


def classify_education_level(education_years: int) -> EducationLevel:
    """
    Classify education level based on years of education per PRD requirements
    - not_educated: 0 years or "none"
    - basic_schooling: 1-12 years
    - college_level: 13+ years
    """
    if education_years == 0:
        return EducationLevel.NOT_EDUCATED
    elif education_years <= 12:
        return EducationLevel.BASIC_SCHOOLING
    else:
        return EducationLevel.COLLEGE_LEVEL


# User Models
class UserBase(BaseModel):
    """Base user model"""
    email: EmailStr
    name: str
    education_years: int = Field(ge=0, le=30, description="Years of formal education")


class UserCreate(UserBase):
    """User creation model"""
    pass


class UserInDB(UserBase):
    """User model as stored in database"""
    id: str = Field(alias="_id")
    education_level: str
    created_at: datetime

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "user-123",
                "email": "john.doe@example.com",
                "name": "John Doe",
                "education_years": 16,
                "education_level": "college_level",
                "created_at": "2024-01-01T00:00:00"
            }
        }


# Session Models
class SessionBase(BaseModel):
    """Base session model"""
    user_id: str
    education_level: Optional[str] = None


class SessionCreate(SessionBase):
    """Session creation model"""
    pass


class SessionUpdate(BaseModel):
    """Session update model"""
    completed_sections: Optional[List[str]] = None
    total_score: Optional[float] = None
    requires_manual_review: Optional[bool] = None
    section_scores: Optional[Dict[str, float]] = None
    subsection_scores: Optional[Dict[str, Any]] = None
    interpretation: Optional[str] = None


class SessionInDB(SessionBase):
    """Session model as stored in database"""
    id: str = Field(alias="_id")
    start_time: datetime
    end_time: Optional[datetime] = None
    completed_sections: List[str] = Field(default_factory=list)
    total_score: float = 0.0
    requires_manual_review: bool = False
    section_scores: Dict[str, float] = Field(default_factory=dict)
    subsection_scores: Dict[str, Any] = Field(default_factory=dict)
    interpretation: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "session-123",
                "user_id": "user-123",
                "start_time": "2024-01-01T00:00:00",
                "education_level": "college_level",
                "completed_sections": ["trail_making", "attention"],
                "total_score": 25.5,
                "requires_manual_review": False,
                "section_scores": {"trail_making": 1, "attention": 5},
                "subsection_scores": {"attention": {"forward": 1, "backward": 1, "vigilance": 3}},
                "interpretation": "Mild",
                "created_at": "2024-01-01T00:00:00"
            }
        }


# Result Models
class ResultBase(BaseModel):
    """Base result model"""
    session_id: str
    section_name: str
    raw_score: float
    normalized_score: float
    max_score: float
    user_responses: Dict[str, Any] = {}


class ResultCreate(ResultBase):
    """Result creation model"""
    pass


class ResultInDB(ResultBase):
    """Result model as stored in database"""
    id: str = Field(alias="_id")
    created_at: datetime

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "result-123",
                "session_id": "session-123",
                "section_name": "memory",
                "raw_score": 12.5,
                "normalized_score": 0.83,
                "max_score": 15.0,
                "user_responses": {"q1": "correct", "q2": "incorrect"},
                "created_at": "2024-01-01T00:00:00"
            }
        }


# Audit Log Models
class AuditLogCreate(BaseModel):
    """Audit log creation model"""
    action: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    details: Dict[str, Any] = {}


class AuditLogInDB(AuditLogCreate):
    """Audit log model as stored in database"""
    id: str = Field(alias="_id")
    timestamp: datetime
    ip_address: Optional[str] = None

    class Config:
        populate_by_name = True
