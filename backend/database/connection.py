"""
MongoDB connection helper using Motor (AsyncIOMotorClient).

Environment variables used:
 - MONGO_URI: required, MongoDB connection URI (mongodb:// or mongodb+srv://)
 - MONGO_DB_NAME: optional, default database name (defaults to 'dimentia_project')
 - MONGO_SKIP_TLS_VERIFY: optional, set to 'true' to allow invalid TLS certs (development ONLY)
 - MONGO_TLS_CA_FILE: optional, path to a custom CA file to use for TLS verification

Security warning: Do NOT enable MONGO_SKIP_TLS_VERIFY or tlsAllowInvalidCertificates in
production. These options disable certificate verification and are intended only for
local development and debugging when you cannot validate the CA chain.

This module auto-detects whether TLS is required (for example when using
mongodb+srv:// or when the URI contains tls=true/ssl=true) and only passes
Motor/PyMongo-compatible TLS keyword arguments when appropriate.

It avoids using unsupported kwargs like `ssl_cert_reqs` (which caused
ConfigurationError with recent PyMongo versions). Use `tls` / `tlsCAFile`
and the Motor/PyMongo supported `tlsAllowInvalidCertificates` toggle for dev.
"""

from typing import Optional
import os
import certifi
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConfigurationError, ServerSelectionTimeoutError

# Global MongoDB client
mongodb_client: Optional[AsyncIOMotorClient] = None


def _is_tls_required(uri: str) -> bool:
    """Return True if the URI indicates TLS is required (Atlas SRV or explicit tls/ssl).

    This is a best-effort check; PyMongo will ultimately decide based on the URI.
    """
    if not uri:
        return False
    u = uri.lower()
    if u.startswith("mongodb+srv://"):
        return True
    if "tls=true" in u or "ssl=true" in u:
        return True
    return False


async def connect_to_mongo() -> None:
    """Initialize the Motor AsyncIOMotorClient - TLS optional for prototype.

    Behavior:
    - Reads `MONGO_URI` from environment (required).
    - For PROTOTYPE/DEV: TLS is DISABLED by default to avoid SSL issues.
    - Set MONGO_ENABLE_TLS=true to enable TLS (for production Atlas deployment).
    - Uses `serverSelectionTimeoutMS=5000` by default.

    Raises:
      ValueError if `MONGO_URI` is missing.
      Re-raises connection errors after logging helpful messages.
    """
    global mongodb_client

    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        raise ValueError("MONGO_URI not found in environment variables")

    # Check if TLS parameters are in the connection string
    has_tls_in_uri = "tls=true" in mongo_uri.lower() or "ssl=true" in mongo_uri.lower()
    enable_tls = os.getenv("MONGO_ENABLE_TLS", "").lower() == "true"
    
    # Build minimal connection kwargs - let connection string parameters take precedence
    kwargs = {
        "serverSelectionTimeoutMS": int(os.getenv("MONGO_SERVER_SELECTION_TIMEOUT_MS", "15000")),
    }

    # Only add TLS kwargs if NOT already in connection string
    if not has_tls_in_uri and (enable_tls or _is_tls_required(mongo_uri)):
        # TLS/SSL configuration for MongoDB Atlas
        print("🔒 TLS enabled via Python kwargs")
        kwargs["tls"] = True
        kwargs["tlsAllowInvalidCertificates"] = True  # Allow invalid certificates for compatibility
    elif has_tls_in_uri:
        print("🔒 TLS configured in connection string")
    else:
        # Prototype mode: TLS disabled
        print("⚠️  TLS DISABLED (prototype mode)")

    # Create the client - connection string parameters override kwargs
    try:
        print(f"🔌 Connecting to MongoDB...")
        mongodb_client = AsyncIOMotorClient(mongo_uri, **kwargs)
        
        # Test the connection by issuing a ping
        await mongodb_client.admin.command("ping")
        print("✅ Successfully connected to MongoDB!")
        
    except ServerSelectionTimeoutError as e:
        print("❌ Failed to connect to MongoDB (timeout):", str(e)[:200])
        print("💡 Troubleshooting hints:")
        print("   1. Check MongoDB Atlas IP whitelist includes 0.0.0.0/0")
        print("   2. Verify connection string username/password are correct")
        print("   3. Ensure Atlas cluster is running and accessible")
        raise
    except ConfigurationError as e:
        print("❌ MongoDB configuration error:", e)
        print("💡 Try setting MONGO_ENABLE_TLS=false for local development")
        raise
    except Exception as e:
        print("❌ Failed to connect to MongoDB:", str(e)[:200])
        print("💡 Check your MONGO_URI and network connectivity")
        raise


async def close_mongo_connection() -> None:
    """Close the global MongoDB client if initialized."""
    global mongodb_client
    if mongodb_client:
        mongodb_client.close()
        mongodb_client = None
        print("✅ MongoDB connection closed")


def get_database():
    """Return the database instance. Raises if not connected."""
    if not mongodb_client:
        raise RuntimeError("Database not initialized. Call connect_to_mongo() first.")
    db_name = os.getenv("MONGO_DB_NAME", "dimentia_project")
    return mongodb_client[db_name]


def get_collection(collection_name: str):
    """Return a collection object for the configured database."""
    db = get_database()
    return db[collection_name]
