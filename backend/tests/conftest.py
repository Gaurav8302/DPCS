"""
PyTest configuration and fixtures
"""
import pytest
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

@pytest.fixture
def sample_session_data():
    """Sample session data for tests"""
    return {
        "user_id": "test-user-123",
        "start_time": "2024-01-01T00:00:00",
        "completed_sections": [],
        "total_score": 0.0,
        "requires_manual_review": False,
        "section_scores": {}
    }

@pytest.fixture
def sample_user_data():
    """Sample user data for tests"""
    return {
        "email": "test@example.com",
        "name": "Test User",
        "education_years": 16,
        "education_level": "college_level"
    }
