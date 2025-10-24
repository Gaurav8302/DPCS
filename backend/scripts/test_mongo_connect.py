"""Simple test runner for Firebase Firestore connection helper.

Run: python backend/scripts/test_mongo_connect.py

It will read Firebase credentials from the environment.
"""
import asyncio
import os
import sys

# Ensure backend package path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from database.connection import connect_to_firebase, close_firebase_connection


async def main():
    try:
        await connect_to_firebase()
        print("Test: Firebase connection successful")
    except Exception as e:
        print("Test: Firebase connection failed ->", e)
    finally:
        await close_firebase_connection()


if __name__ == "__main__":
    asyncio.run(main())
