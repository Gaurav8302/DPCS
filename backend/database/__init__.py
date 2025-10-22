# Database package initialization
from .connection import (
    connect_to_mongo,
    close_mongo_connection,
    get_database,
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
    "connect_to_mongo",
    "close_mongo_connection",
    "get_database",
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
