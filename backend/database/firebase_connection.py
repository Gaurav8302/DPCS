"""
Firebase Firestore connection for Dimentia Project
Replaces MongoDB due to persistent TLS handshake errors
"""

import os
from typing import Optional
import firebase_admin
from firebase_admin import credentials, firestore

db: Optional[firestore.Client] = None


async def connect_to_firebase() -> None:
    """Initialize Firebase Admin SDK and Firestore client."""
    global db
    
    try:
        print("🔌 Connecting to Firebase Firestore...")
        
        # Build service account credentials from environment variables
        cred_dict = {
            "type": "service_account",
            "project_id": os.getenv("FIREBASE_PROJECT_ID", "dpcs-67de3"),
            "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID", ""),
            "private_key": os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\\\n", "\\n"),
            "client_email": os.getenv("FIREBASE_CLIENT_EMAIL", ""),
            "client_id": os.getenv("FIREBASE_CLIENT_ID", ""),
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL", ""),
        }
        
        # Initialize Firebase if not already done
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_dict)
            firebase_admin.initialize_app(cred)
        
        # Get Firestore client
        db = firestore.client()
        
        # Test connection
        _ = db.collection("_healthcheck").limit(1).get()
        
        print("✅ Successfully connected to Firebase Firestore!")
        
    except Exception as e:
        print(f"❌ Failed to connect to Firebase: {str(e)[:300]}")
        print("💡 Troubleshooting hints:")
        print("   1. Download service account JSON from Firebase Console")
        print("   2. Set all FIREBASE_* environment variables from JSON file")
        print("   3. Ensure Firestore is enabled in Firebase project")
        raise


async def close_firebase_connection() -> None:
    """Close Firebase connection."""
    global db
    if db:
        db = None
        print("✅ Firebase connection closed")


def get_firestore_client() -> firestore.Client:
    """Return the Firestore client instance."""
    if db is None:
        raise RuntimeError("Firestore client not initialized. Call connect_to_firebase() first.")
    return db


def get_collection(collection_name: str):
    """Get a Firestore collection reference."""
    client = get_firestore_client()
    return client.collection(collection_name)
