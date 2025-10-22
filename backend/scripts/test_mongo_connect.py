"""Simple test runner for MongoDB connection helper.

Run: python backend/scripts/test_mongo_connect.py

It will read MONGO_URI and optional flags from the environment.
"""
import asyncio
import os
import sys

# Ensure backend package path
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from database.connection import connect_to_mongo, close_mongo_connection


async def main():
    try:
        await connect_to_mongo()
        print("Test: connection successful")
    except Exception as e:
        print("Test: connection failed ->", e)
    finally:
        await close_mongo_connection()


if __name__ == "__main__":
    asyncio.run(main())
