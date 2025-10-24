"""
Firebase Firestore connection for Dimentia Project
Replaces MongoDB due to persistent TLS handshake errors
"""

import os
from typing import Optional, Dict, Any, List
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
        
        # Test connection (but don't fail if Firestore API not enabled yet)
        try:
            _ = db.collection("_healthcheck").limit(1).get()
            print("✅ Successfully connected to Firebase Firestore!")
        except Exception as test_error:
            error_msg = str(test_error)
            if "PERMISSION_DENIED" in error_msg or "SERVICE_DISABLED" in error_msg or "403" in error_msg:
                print("⚠️ Firebase initialized but Firestore API not enabled yet")
                print("💡 Please enable Firestore:")
                print(f"   Visit: https://console.firebase.google.com/project/dpcs-67de3/firestore")
                print("   Or run: gcloud services enable firestore.googleapis.com --project=dpcs-67de3")
                print("✅ Server will start anyway - some features may not work until Firestore is enabled")
            else:
                raise test_error
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Failed to connect to Firebase: {error_msg[:300]}")
        
        # Check if it's just the Firestore API not being enabled
        if "PERMISSION_DENIED" in error_msg or "SERVICE_DISABLED" in error_msg or "403" in error_msg:
            print("⚠️ Firestore API needs to be enabled in Firebase Console")
            print("💡 Visit: https://console.firebase.google.com/project/dpcs-67de3/firestore")
            print("✅ Server starting in limited mode - enable Firestore for full functionality")
            # Don't raise - let server start
        else:
            print("💡 Troubleshooting hints:")
            print("   1. Check FIREBASE_* environment variables in .env file")
            print("   2. Verify Firebase service account credentials")
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
    return FirestoreCollection(client.collection(collection_name))


class FirestoreCollection:
    """Wrapper class to provide MongoDB-like interface for Firestore collections"""
    
    def __init__(self, collection_ref):
        self.collection_ref = collection_ref
    
    async def find_one(self, query: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Find a single document matching the query"""
        try:
            docs = self.collection_ref.limit(1)
            
            # Apply query filters
            for key, value in query.items():
                docs = docs.where(key, "==", value)
            
            results = docs.get()
            
            for doc in results:
                data = doc.to_dict()
                data["_id"] = doc.id
                return data
            
            return None
        except Exception as e:
            print(f"Error in find_one: {str(e)}")
            return None
    
    async def find(self, query: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Find all documents matching the query"""
        try:
            docs = self.collection_ref
            
            # Apply query filters if provided
            if query:
                for key, value in query.items():
                    docs = docs.where(key, "==", value)
            
            results = docs.get()
            
            documents = []
            for doc in results:
                data = doc.to_dict()
                data["_id"] = doc.id
                documents.append(data)
            
            return documents
        except Exception as e:
            print(f"Error in find: {str(e)}")
            return []
    
    async def insert_one(self, document: Dict[str, Any]) -> Any:
        """Insert a single document"""
        try:
            # Extract _id if present, otherwise Firestore will auto-generate
            doc_id = document.pop("_id", None)
            
            if doc_id:
                self.collection_ref.document(doc_id).set(document)
            else:
                doc_ref = self.collection_ref.add(document)
                doc_id = doc_ref[1].id
            
            return type('InsertResult', (), {'inserted_id': doc_id})()
        except Exception as e:
            print(f"Error in insert_one: {str(e)}")
            raise
    
    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any]) -> Any:
        """Update a single document matching the query"""
        try:
            # Find the document first
            doc = await self.find_one(query)
            
            if not doc:
                return type('UpdateResult', (), {'matched_count': 0, 'modified_count': 0})()
            
            doc_id = doc["_id"]
            
            # Extract update operations
            update_data = update.get("$set", update)
            
            self.collection_ref.document(doc_id).update(update_data)
            
            return type('UpdateResult', (), {'matched_count': 1, 'modified_count': 1})()
        except Exception as e:
            print(f"Error in update_one: {str(e)}")
            raise
    
    async def delete_one(self, query: Dict[str, Any]) -> Any:
        """Delete a single document matching the query"""
        try:
            # Find the document first
            doc = await self.find_one(query)
            
            if not doc:
                return type('DeleteResult', (), {'deleted_count': 0})()
            
            doc_id = doc["_id"]
            self.collection_ref.document(doc_id).delete()
            
            return type('DeleteResult', (), {'deleted_count': 1})()
        except Exception as e:
            print(f"Error in delete_one: {str(e)}")
            raise
    
    def limit(self, count: int):
        """Limit the number of results"""
        self.collection_ref = self.collection_ref.limit(count)
        return self
    
    def order_by(self, field: str, direction: str = "ASCENDING"):
        """Order results by a field"""
        dir_enum = firestore.Query.ASCENDING if direction == "ASCENDING" else firestore.Query.DESCENDING
        self.collection_ref = self.collection_ref.order_by(field, direction=dir_enum)
        return self

