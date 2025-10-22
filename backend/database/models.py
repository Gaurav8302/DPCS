from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# Education Level Enum
class EducationLevel(str, Enum):
    NOT_EDUCATED = "not_educated"
    BASIC_SCHOOLING = "basic_schooling"
    COLLEGE_LEVEL = "college_level"

# User Schema
class UserBase(BaseModel):
    email: EmailStr
    name: str
    education_years: int = Field(ge=0, le=30)
    education_level: EducationLevel

class UserCreate(UserBase):
    pass

class UserInDB(UserBase):
    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "_id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "patient@example.com",
                "name": "John Doe",
                "education_years": 12,
                "education_level": "basic_schooling",
                "created_at": "2025-10-22T10:00:00Z"
            }
        }

# Session Schema
class SessionBase(BaseModel):
    user_id: str
    start_time: datetime = Field(default_factory=datetime.utcnow)
    completed_sections: List[str] = Field(default_factory=list)
    total_score: float = 0.0
    requires_manual_review: bool = False
    section_scores: Dict[str, Any] = Field(default_factory=dict)

class SessionCreate(SessionBase):
    pass

class SessionUpdate(BaseModel):
    completed_sections: Optional[List[str]] = None
    total_score: Optional[float] = None
    requires_manual_review: Optional[bool] = None
    section_scores: Optional[Dict[str, Any]] = None

class SessionInDB(SessionBase):
    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    
    class Config:
        populate_by_name = True

# Result Schema
class ResultBase(BaseModel):
    session_id: str
    user_id: str
    section_name: str
    raw_score: float
    confidence: float = Field(ge=0.0, le=1.0)
    details: Dict[str, Any] = Field(default_factory=dict)
    requires_manual_review: bool = False

class ResultCreate(ResultBase):
    pass

class ResultInDB(ResultBase):
    id: str = Field(alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True

# Audit Log Schema
class AuditLogBase(BaseModel):
    user_id: str
    action: str
    resource_type: str
    resource_id: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    details: Dict[str, Any] = Field(default_factory=dict)

class AuditLogCreate(AuditLogBase):
    pass

class AuditLogInDB(AuditLogBase):
    id: str = Field(alias="_id")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True

# Helper function to classify education level
def classify_education_level(education_years: int) -> EducationLevel:
    """
    Classify education level based on years of education
    - 0 years: not_educated
    - 1-12 years: basic_schooling
    - 13+ years: college_level
    """
    if education_years == 0:
        return EducationLevel.NOT_EDUCATED
    elif 1 <= education_years <= 12:
        return EducationLevel.BASIC_SCHOOLING
    else:
        return EducationLevel.COLLEGE_LEVEL
