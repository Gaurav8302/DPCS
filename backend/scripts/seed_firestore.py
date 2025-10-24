"""
Firestore seed script for Dimentia Project
Creates test data and indexes for development
"""
import sys
import os
import asyncio
from datetime import datetime, timedelta
import uuid

# Add parent directory to path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.connection import connect_to_firebase, get_firestore_client, get_collection
from database.models import classify_education_level

async def seed_database():
    """Seed Firestore with test data"""
    print("🌱 Starting Firestore seed process...")
    
    # Connect to Firebase
    await connect_to_firebase()
    
    # Get collections
    users_collection = get_collection("users")
    sessions_collection = get_collection("sessions")
    results_collection = get_collection("results")
    
    print("\n📝 Creating test users...")
    
    # Create test users
    test_users = [
        {
            "_id": str(uuid.uuid4()),
            "email": "john.doe@example.com",
            "name": "John Doe",
            "education_years": 16,
            "education_level": classify_education_level(16).value,
            "created_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "email": "jane.smith@example.com",
            "name": "Jane Smith",
            "education_years": 12,
            "education_level": classify_education_level(12).value,
            "created_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "email": "bob.wilson@example.com",
            "name": "Bob Wilson",
            "education_years": 8,
            "education_level": classify_education_level(8).value,
            "created_at": datetime.utcnow()
        },
        {
            "_id": str(uuid.uuid4()),
            "email": "alice.johnson@example.com",
            "name": "Alice Johnson",
            "education_years": 0,
            "education_level": classify_education_level(0).value,
            "created_at": datetime.utcnow()
        }
    ]
    
    for user in test_users:
        # Check if user exists
        existing = await users_collection.find_one({"email": user["email"]})
        if not existing:
            await users_collection.insert_one(user.copy())
            print(f"  ✅ Created user: {user['name']} ({user['email']}) - Education: {user['education_level']}")
        else:
            print(f"  ⏭️  User already exists: {user['email']}")
    
    print("\n🧪 Creating test sessions...")
    
    # Create test sessions with various scores
    test_sessions = [
        {
            "_id": str(uuid.uuid4()),
            "user_id": test_users[0]["_id"],
            "start_time": datetime.utcnow() - timedelta(days=1),
            "end_time": datetime.utcnow() - timedelta(days=1) + timedelta(hours=1),
            "completed_sections": ["trail_making", "cube_copy", "clock_drawing", "naming", "attention_forward", "attention_backward", "attention_vigilance", "sentence_repetition", "verbal_fluency", "abstraction", "delayed_recall", "orientation"],
            "total_score": 28.0,
            "requires_manual_review": False,
            "section_scores": {
                "trail_making": 1,
                "cube_copy": 3,
                "clock_drawing": 3,
                "naming": 3,
                "attention": 5,
                "language": 4,
                "abstraction": 2,
                "delayed_recall": 4,
                "orientation": 5
            },
            "created_at": datetime.utcnow() - timedelta(days=1),
            "updated_at": datetime.utcnow() - timedelta(days=1) + timedelta(hours=1)
        },
        {
            "_id": str(uuid.uuid4()),
            "user_id": test_users[1]["_id"],
            "start_time": datetime.utcnow() - timedelta(hours=3),
            "end_time": datetime.utcnow() - timedelta(hours=2),
            "completed_sections": ["trail_making", "cube_copy", "clock_drawing", "naming"],
            "total_score": 22.0,
            "requires_manual_review": True,
            "section_scores": {
                "trail_making": 1,
                "cube_copy": 2,
                "clock_drawing": 2,
                "naming": 2,
                "attention": 4,
                "language": 3,
                "abstraction": 1,
                "delayed_recall": 3,
                "orientation": 4
            },
            "created_at": datetime.utcnow() - timedelta(hours=3),
            "updated_at": datetime.utcnow() - timedelta(hours=2)
        },
        {
            "_id": str(uuid.uuid4()),
            "user_id": test_users[2]["_id"],
            "start_time": datetime.utcnow() - timedelta(hours=1),
            "end_time": None,  # In progress
            "completed_sections": ["trail_making", "cube_copy"],
            "total_score": 3.0,
            "requires_manual_review": False,
            "section_scores": {
                "trail_making": 1,
                "cube_copy": 2
            },
            "created_at": datetime.utcnow() - timedelta(hours=1),
            "updated_at": datetime.utcnow() - timedelta(minutes=30)
        }
    ]
    
    for session in test_sessions:
        # Check if session exists
        existing = await sessions_collection.find_one({"_id": session["_id"]})
        if not existing:
            await sessions_collection.insert_one(session.copy())
            status = "✅" if session.get("end_time") else "🔄"
            review_flag = "🔍 (needs review)" if session.get("requires_manual_review") else ""
            print(f"  {status} Created session: Score {session['total_score']}/30 {review_flag}")
    
    print("\n📊 Creating test results...")
    
    # Create sample results for first session
    test_results = [
        {
            "_id": str(uuid.uuid4()),
            "session_id": test_sessions[0]["_id"],
            "user_id": test_users[0]["_id"],
            "section_name": "trail_making",
            "raw_score": 1,
            "confidence": 1.0,
            "details": {
                "crossing_errors": 0,
                "sequence_correct": True
            },
            "requires_manual_review": False,
            "created_at": datetime.utcnow() - timedelta(days=1)
        },
        {
            "_id": str(uuid.uuid4()),
            "session_id": test_sessions[0]["_id"],
            "user_id": test_users[0]["_id"],
            "section_name": "naming",
            "raw_score": 3,
            "confidence": 1.0,
            "details": {
                "individual_scores": [
                    {"animal": "lion", "user_answer": "lion", "similarity": 1.0, "score": 1},
                    {"animal": "rhinoceros", "user_answer": "rhino", "similarity": 0.7, "score": 1},
                    {"animal": "camel", "user_answer": "camel", "similarity": 1.0, "score": 1}
                ]
            },
            "requires_manual_review": False,
            "created_at": datetime.utcnow() - timedelta(days=1)
        }
    ]
    
    for result in test_results:
        existing = await results_collection.find_one({"_id": result["_id"]})
        if not existing:
            await results_collection.insert_one(result.copy())
            print(f"  ✅ Created result: {result['section_name']} - Score: {result['raw_score']}")
    
    print("\n🔍 Creating indexes...")
    
    # Get Firestore client for index creation
    db = get_firestore_client()
    
    # Note: Firestore indexes are typically created automatically or via Firebase Console
    # Composite indexes must be created in Firebase Console or via firestore.indexes.json
    print("  ℹ️  Firestore creates indexes automatically for single-field queries")
    print("  ℹ️  For composite indexes, add them to firestore.indexes.json and deploy")
    
    print("\n✅ Seed process complete!")
    print("\n📝 Summary:")
    print(f"  - Users: {len(test_users)}")
    print(f"  - Sessions: {len(test_sessions)}")
    print(f"  - Results: {len(test_results)}")
    print("\n💡 Access the admin dashboard to view all data")
    print("   GET /api/admin/dashboard/stats")
    print("   GET /api/admin/sessions")

if __name__ == "__main__":
    asyncio.run(seed_database())
