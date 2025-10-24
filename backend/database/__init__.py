# Database package initialization - Firebase Firestore
from .connection import (
    connect_to_firebase,
    close_firebase_connection,
    get_firestore_client,
    get_collection
)
from .models import (
    UserBase,
    UserCreate,
    UserInDB,
    SessionBase,
    SessionCreate,
    SessionUpdate,
    SessionInDB,
    ResultBase,
    ResultCreate,
    ResultInDB,
    AuditLogCreate,
    AuditLogInDB,
    EducationLevel,
    classify_education_level
)

__all__ = [
    "connect_to_firebase",
    "close_firebase_connection",
    "get_firestore_client",
    "get_collection",
    "UserBase",
    "UserCreate",
    "UserInDB",
    "SessionBase",
    "SessionCreate",
    "SessionUpdate",
    "SessionInDB",
    "ResultBase",
    "ResultCreate",
    "ResultInDB",
    "AuditLogCreate",
    "AuditLogInDB",
    "EducationLevel",
    "classify_education_level"
]
