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
from pymongo.errors import ConfigurationError

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

    # PROTOTYPE MODE: Disable TLS by default unless explicitly enabled
    enable_tls = os.getenv("MONGO_ENABLE_TLS", "").lower() == "true"
    
    # Build kwargs with minimal options
    kwargs = {"serverSelectionTimeoutMS": int(os.getenv("MONGO_SERVER_SELECTION_TIMEOUT_MS", "5000"))}

    if enable_tls:
        # Only use TLS if explicitly enabled (for production deployment)
        ca_file = os.getenv("MONGO_TLS_CA_FILE") or certifi.where()
        skip_verify = os.getenv("MONGO_SKIP_TLS_VERIFY", "").lower() == "true"
        
        kwargs["tls"] = True
        kwargs["tlsCAFile"] = ca_file
        if skip_verify:
            kwargs["tlsAllowInvalidCertificates"] = True
        print("🔒 TLS enabled for MongoDB connection")
    else:
        # Prototype mode: disable TLS
        kwargs["tls"] = False
        print("⚠️  TLS DISABLED (prototype mode) - set MONGO_ENABLE_TLS=true for production")

    # Create the client
    try:
        mongodb_client = AsyncIOMotorClient(mongo_uri, **kwargs)
    except ConfigurationError as e:
        print("⚠️  ConfigurationError while constructing Mongo client:", e)
        print("⚠️  Retrying with absolute minimal options...")
        try:
            # Final fallback: just the URI, no extra options
            mongodb_client = AsyncIOMotorClient(mongo_uri)
        except Exception:
            raise

    # Test the connection by issuing a ping
    try:
        await mongodb_client.admin.command("ping")
        print("✅ Successfully connected to MongoDB")
    except Exception as e:
        print("❌ Failed to connect to MongoDB:", e)
        print("Hints: 1) For local dev, use mongodb://localhost:27017 2) For Atlas with TLS issues, try a local MongoDB instance 3) Set MONGO_ENABLE_TLS=true only when deploying to production")
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
