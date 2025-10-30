"""
Firebase Firestore connection for Dimentia Project
Replaces MongoDB due to persistent TLS handshake errors
"""

import base64
import json
import logging
import os
from typing import Optional, Dict, Any, List, Tuple
import firebase_admin
from firebase_admin import credentials, firestore

logger = logging.getLogger(__name__)

db: Optional[firestore.Client] = None


def _decode_credentials_blob(raw_blob: str) -> Dict[str, Any]:
    """Decode a JSON credential string, supporting base64 payloads."""
    blob = raw_blob.strip()
    if not blob:
        raise ValueError("Empty FIREBASE_CREDENTIALS_JSON value provided")

    if not blob.startswith("{"):
        blob = base64.b64decode(blob).decode("utf-8")

    return json.loads(blob)


def _load_service_account(project_id: str) -> credentials.Certificate:
    """Load Firebase credentials from supported environment variables."""
    creds_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if creds_path:
        logger.info("Using GOOGLE_APPLICATION_CREDENTIALS for Firestore auth")
        return credentials.Certificate(creds_path)

    raw_blob = os.getenv("FIREBASE_CREDENTIALS_JSON")
    if raw_blob:
        logger.info("Using FIREBASE_CREDENTIALS_JSON for Firestore auth")
        cred_dict = _decode_credentials_blob(raw_blob)
        return credentials.Certificate(cred_dict)

    private_key = os.getenv("FIREBASE_PRIVATE_KEY")
    if private_key:
        logger.info("Using FIREBASE_PRIVATE_KEY/FIREBASE_CLIENT_EMAIL credentials for Firestore auth")
        cred_dict = {
            "type": "service_account",
            "project_id": project_id,
            "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID", ""),
            "private_key": private_key.replace("\\n", "\n"),
            "client_email": os.getenv("FIREBASE_CLIENT_EMAIL", ""),
            "client_id": os.getenv("FIREBASE_CLIENT_ID", ""),
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL", ""),
        }
        return credentials.Certificate(cred_dict)

    raise RuntimeError(
        "Firebase credentials not configured. Provide GOOGLE_APPLICATION_CREDENTIALS, "
        "FIREBASE_CREDENTIALS_JSON, or FIREBASE_PRIVATE_KEY.* environment variables."
    )


async def connect_to_firebase() -> None:
    """Initialize Firebase Admin SDK and Firestore client."""
    global db
    
    if db is not None:
        return

    project_id = os.getenv("FIREBASE_PROJECT_ID", "dpcs-67de3")
    emulator_host = os.getenv("FIRESTORE_EMULATOR_HOST")

    try:
        if emulator_host:
            logger.info("Connecting to Firestore emulator at %s", emulator_host)
            os.environ.setdefault("FIRESTORE_EMULATOR_HOST", emulator_host)
            os.environ.setdefault("GCLOUD_PROJECT", project_id)
            if not firebase_admin._apps:
                firebase_admin.initialize_app(options={"projectId": project_id})
        else:
            logger.info("Connecting to Firestore project %s", project_id)
            cred = _load_service_account(project_id)
            if not firebase_admin._apps:
                firebase_admin.initialize_app(cred)

        db = firestore.client()

        try:
            db.collection("_healthcheck").limit(1).get()
        except Exception as health_error:  # noqa: BLE001
            logger.warning("Firestore health check warning: %s", health_error)
    except Exception as exc:  # noqa: BLE001
        logger.error("Failed to connect to Firebase Firestore: %s", exc, exc_info=True)
        raise


async def close_firebase_connection() -> None:
    """Close Firebase connection."""
    global db
    if db:
        db = None
        logger.info("Firestore connection closed")


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
        except Exception as exc:
            logger.error("Error in find_one: %s", exc)
            return None
    
    async def find(
        self,
        query: Optional[Dict[str, Any]] = None,
        order_by: Optional[List[Tuple[str, str]]] = None,
        limit: Optional[int] = None,
    ) -> List[Dict[str, Any]]:
        """Find documents matching the query with optional ordering."""
        try:
            docs = self.collection_ref

            if query:
                for key, value in query.items():
                    docs = docs.where(key, "==", value)

            if order_by:
                for field, direction in order_by:
                    sort_dir = firestore.Query.ASCENDING if direction.upper() != "DESC" else firestore.Query.DESCENDING
                    docs = docs.order_by(field, direction=sort_dir)

            if limit:
                docs = docs.limit(limit)

            results = docs.get()

            documents: List[Dict[str, Any]] = []
            for doc in results:
                data = doc.to_dict()
                data["_id"] = doc.id
                documents.append(data)

            return documents
        except Exception as exc:  # noqa: BLE001
            logger.error("Error in find: %s", exc)
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
        except Exception as exc:
            logger.error("Error in insert_one: %s", exc)
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

            self.collection_ref.document(doc_id).set(update_data, merge=True)

            return type('UpdateResult', (), {'matched_count': 1, 'modified_count': 1})()
        except Exception as exc:
            logger.error("Error in update_one: %s", exc)
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
        except Exception as exc:
            logger.error("Error in delete_one: %s", exc)
            raise

    async def delete_many(self, query: Dict[str, Any]) -> Any:
        """Delete all documents matching the query."""
        try:
            documents = await self.find(query)
            deleted_count = 0
            for doc in documents:
                self.collection_ref.document(doc["_id"]).delete()
                deleted_count += 1
            return type('DeleteResult', (), {'deleted_count': deleted_count})()
        except Exception as exc:
            logger.error("Error in delete_many: %s", exc)
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

