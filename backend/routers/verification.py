from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

router = APIRouter()

class LocationRequest(BaseModel):
    session_id: str
    user_id: str
    city: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class LocationResponse(BaseModel):
    city_correct: bool
    confidence: float
    detected_city: Optional[str] = None

@router.post("/location", response_model=LocationResponse)
async def verify_location(data: LocationRequest):
    """
    Verify user's location (city)
    
    In production, this would use geolocation APIs to verify
    For now, we accept the city provided
    """
    # Placeholder: Accept any city
    # In production: Use reverse geocoding API
    return LocationResponse(
        city_correct=True,
        confidence=0.8,
        detected_city=data.city
    )

class DateTimeRequest(BaseModel):
    session_id: str
    user_id: str
    date: str  # User's answer
    month: str
    year: str
    day_of_week: str

class DateTimeResponse(BaseModel):
    date_correct: bool
    month_correct: bool
    year_correct: bool
    day_correct: bool
    score: int  # 0-4 (one per field)
    confidence: float

@router.post("/datetime", response_model=DateTimeResponse)
async def verify_datetime(data: DateTimeRequest):
    """
    Verify date, month, year, day of week against server time
    """
    now = datetime.utcnow()
    
    date_correct = str(now.day) == data.date
    month_correct = str(now.month) == data.month or now.strftime("%B").lower() == data.month.lower()
    year_correct = str(now.year) == data.year
    day_correct = now.strftime("%A").lower() == data.day_of_week.lower()
    
    score = sum([date_correct, month_correct, year_correct, day_correct])
    
    return DateTimeResponse(
        date_correct=date_correct,
        month_correct=month_correct,
        year_correct=year_correct,
        day_correct=day_correct,
        score=score,
        confidence=1.0
    )
