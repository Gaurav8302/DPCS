from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from datetime import datetime
import uuid

from database import (
    get_collection,
    UserCreate,
    UserInDB,
    classify_education_level,
    AuditLogCreate
)

router = APIRouter()

@router.post("/", response_model=UserInDB, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    """
    Create a new user with automatic education level classification
    """
    users_collection = get_collection("users")
    
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Classify education level
    education_level = classify_education_level(user.education_years)
    
    # Create user document
    user_id = str(uuid.uuid4())
    user_doc = {
        "_id": user_id,
        "email": user.email,
        "name": user.name,
        "education_years": user.education_years,
        "education_level": education_level.value,
        "created_at": datetime.utcnow()
    }
    
    # Insert into Firestore (this will pop the _id from user_doc)
    await users_collection.insert_one(user_doc.copy())
    
    # Log user creation
    audit_collection = get_collection("logs")
    audit_log = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "action": "user_created",
        "resource_type": "user",
        "resource_id": user_id,
        "timestamp": datetime.utcnow(),
        "details": {"email": user.email}
    }
    await audit_collection.insert_one(audit_log)
    
    # Return with the original user_doc that still has _id
    return UserInDB(**user_doc)

@router.get("/{user_id}", response_model=UserInDB)
async def get_user(user_id: str):
    """
    Get user by ID
    """
    users_collection = get_collection("users")
    user = await users_collection.find_one({"_id": user_id})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserInDB(**user)

@router.get("/email/{email}", response_model=UserInDB)
async def get_user_by_email(email: str):
    """
    Get user by email
    """
    users_collection = get_collection("users")
    user = await users_collection.find_one({"email": email})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserInDB(**user)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str):
    """
    Delete user (GDPR right to deletion)
    """
    users_collection = get_collection("users")
    sessions_collection = get_collection("sessions")
    results_collection = get_collection("results")
    
    # Delete user
    result = await users_collection.delete_one({"_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Delete associated sessions and results
    await sessions_collection.delete_many({"user_id": user_id})
    await results_collection.delete_many({"user_id": user_id})
    
    # Log deletion
    audit_collection = get_collection("logs")
    audit_log = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "action": "user_deleted",
        "resource_type": "user",
        "resource_id": user_id,
        "timestamp": datetime.utcnow(),
        "details": {"reason": "gdpr_deletion"}
    }
    await audit_collection.insert_one(audit_log)
    
    return None
