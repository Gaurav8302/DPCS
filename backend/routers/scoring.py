from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
import uuid

from database import get_collection, ResultCreate, ResultInDB
from utils.scoring import (
    score_trail_making,
    score_cube_copy,
    score_clock_drawing,
    score_naming,
    score_attention_forward,
    score_attention_backward,
    score_attention_vigilance,
    score_sentence_repetition,
    score_verbal_fluency,
    score_abstraction,
    score_delayed_recall
)

router = APIRouter()

# Trail Making Request/Response Models
class TrailMakingRequest(BaseModel):
    session_id: str
    user_id: str
    user_path: List[str]  # Ordered list of node IDs clicked
    node_positions: Dict[str, Dict[str, float]]  # {node_id: {x, y}}
    crossing_errors: int = 0

class TrailMakingResponse(BaseModel):
    score: int
    crossing_errors: int
    confidence: float
    requires_manual_review: bool

@router.post("/trail-making", response_model=TrailMakingResponse)
async def score_trail_making_test(data: TrailMakingRequest):
    """
    Score trail making test
    - 1 point for correct sequence with no crossings
    - 0 points otherwise
    """
    result = score_trail_making(
        data.user_path,
        data.node_positions,
        data.crossing_errors
    )
    
    # Store result
    results_collection = get_collection("results")
    result_doc = {
        "_id": str(uuid.uuid4()),
        "session_id": data.session_id,
        "user_id": data.user_id,
        "section_name": "trail_making",
        "raw_score": result["score"],
        "confidence": result["confidence"],
        "details": {
            "crossing_errors": result["crossing_errors"],
            "sequence_correct": result["sequence_correct"]
        },
        "requires_manual_review": result["requires_manual_review"],
        "created_at": datetime.utcnow()
    }
    await results_collection.insert_one(result_doc)
    
    return TrailMakingResponse(**result)

# Cube/Figure Copy Models
class CubeCopyRequest(BaseModel):
    session_id: str
    user_id: str
    image_data: str  # Base64 encoded image
    shapes_to_copy: List[str]  # ["square", "circle", "cone"]

class CubeCopyResponse(BaseModel):
    score: int  # 0-3 (one per shape)
    confidence: float
    shape_scores: Dict[str, int]
    requires_manual_review: bool

@router.post("/cube-copy", response_model=CubeCopyResponse)
async def score_cube_copy_test(data: CubeCopyRequest):
    """
    Score 2D figure and 3D cone copy
    - 1 point per correctly copied shape (max 3)
    """
    result = score_cube_copy(
        data.image_data,
        data.shapes_to_copy
    )
    
    # Store result
    results_collection = get_collection("results")
    result_doc = {
        "_id": str(uuid.uuid4()),
        "session_id": data.session_id,
        "user_id": data.user_id,
        "section_name": "cube_copy",
        "raw_score": result["score"],
        "confidence": result["confidence"],
        "details": {
            "shape_scores": result["shape_scores"],
            "shapes_tested": data.shapes_to_copy
        },
        "requires_manual_review": result["requires_manual_review"],
        "created_at": datetime.utcnow()
    }
    await results_collection.insert_one(result_doc)
    
    return CubeCopyResponse(**result)

# Clock Drawing Models
class ClockDrawingRequest(BaseModel):
    session_id: str
    user_id: str
    image_data: str
    target_time: str  # e.g., "10:10"

class ClockDrawingResponse(BaseModel):
    score: int  # 0-3
    scores: Dict[str, int]  # {contour: 1, numbers: 1, hands: 1}
    confidence: float
    requires_manual_review: bool

@router.post("/clock-drawing", response_model=ClockDrawingResponse)
async def score_clock_drawing_test(data: ClockDrawingRequest):
    """
    Score clock drawing test
    - 1 point for contour
    - 1 point for numbers
    - 1 point for hands showing correct time
    """
    result = score_clock_drawing(
        data.image_data,
        data.target_time
    )
    
    # Store result
    results_collection = get_collection("results")
    result_doc = {
        "_id": str(uuid.uuid4()),
        "session_id": data.session_id,
        "user_id": data.user_id,
        "section_name": "clock_drawing",
        "raw_score": result["score"],
        "confidence": result["confidence"],
        "details": {
            "contour_score": result["scores"]["contour"],
            "numbers_score": result["scores"]["numbers"],
            "hands_score": result["scores"]["hands"],
            "target_time": data.target_time
        },
        "requires_manual_review": result["requires_manual_review"],
        "created_at": datetime.utcnow()
    }
    await results_collection.insert_one(result_doc)
    
    return ClockDrawingResponse(**result)

# Naming Models
class NamingRequest(BaseModel):
    session_id: str
    user_id: str
    responses: List[Dict[str, str]]  # [{animal: "lion", user_answer: "lion"}]

class NamingResponse(BaseModel):
    score: int  # 0-3
    confidence: float
    individual_scores: List[Dict[str, Any]]

@router.post("/naming", response_model=NamingResponse)
async def score_naming_test(data: NamingRequest):
    """
    Score naming test with fuzzy matching
    - 1 point per correctly identified animal (max 3)
    - Accepts similar spellings (≥0.6 similarity)
    """
    result = score_naming(data.responses)
    
    # Store result
    results_collection = get_collection("results")
    result_doc = {
        "_id": str(uuid.uuid4()),
        "session_id": data.session_id,
        "user_id": data.user_id,
        "section_name": "naming",
        "raw_score": result["score"],
        "confidence": result["confidence"],
        "details": {
            "responses": data.responses,
            "individual_scores": result["individual_scores"]
        },
        "requires_manual_review": False,
        "created_at": datetime.utcnow()
    }
    await results_collection.insert_one(result_doc)
    
    return NamingResponse(**result)

# Attention Models
class AttentionRequest(BaseModel):
    session_id: str
    user_id: str
    user_response: List[int] | List[str]  # Depends on subtest
    correct_sequence: List[int] | str

class AttentionResponse(BaseModel):
    score: int
    confidence: float
    correct: bool

@router.post("/attention/forward", response_model=AttentionResponse)
async def score_attention_forward_test(data: AttentionRequest):
    """Score forward digit span - 1 point for correct sequence"""
    result = score_attention_forward(data.user_response, data.correct_sequence)
    
    results_collection = get_collection("results")
    result_doc = {
        "_id": str(uuid.uuid4()),
        "session_id": data.session_id,
        "user_id": data.user_id,
        "section_name": "attention_forward",
        "raw_score": result["score"],
        "confidence": result["confidence"],
        "details": {
            "user_response": data.user_response,
            "correct_sequence": data.correct_sequence
        },
        "requires_manual_review": False,
        "created_at": datetime.utcnow()
    }
    await results_collection.insert_one(result_doc)
    
    return AttentionResponse(**result)

@router.post("/attention/backward", response_model=AttentionResponse)
async def score_attention_backward_test(data: AttentionRequest):
    """Score backward digit span - 1 point for correct reversed sequence"""
    result = score_attention_backward(data.user_response, data.correct_sequence)
    
    results_collection = get_collection("results")
    result_doc = {
        "_id": str(uuid.uuid4()),
        "session_id": data.session_id,
        "user_id": data.user_id,
        "section_name": "attention_backward",
        "raw_score": result["score"],
        "confidence": result["confidence"],
        "details": {
            "user_response": data.user_response,
            "correct_sequence": data.correct_sequence
        },
        "requires_manual_review": False,
        "created_at": datetime.utcnow()
    }
    await results_collection.insert_one(result_doc)
    
    return AttentionResponse(**result)

class VigilanceRequest(BaseModel):
    session_id: str
    user_id: str
    taps: List[int]  # Indices where user tapped
    target_indices: List[int]  # Correct indices for target letter
    total_targets: int

class VigilanceResponse(BaseModel):
    score: int  # 0-3 points
    confidence: float
    hits: int
    misses: int
    false_alarms: int

@router.post("/attention/vigilance", response_model=VigilanceResponse)
async def score_attention_vigilance_test(data: VigilanceRequest):
    """
    Score vigilance test
    - 0 or 1 error: 3 points
    - 2 errors: 2 points
    - 3 errors: 1 point
    - >3 errors: 0 points
    """
    result = score_attention_vigilance(
        data.taps,
        data.target_indices,
        data.total_targets
    )
    
    results_collection = get_collection("results")
    result_doc = {
        "_id": str(uuid.uuid4()),
        "session_id": data.session_id,
        "user_id": data.user_id,
        "section_name": "attention_vigilance",
        "raw_score": result["score"],
        "confidence": result["confidence"],
        "details": {
            "hits": result["hits"],
            "misses": result["misses"],
            "false_alarms": result["false_alarms"]
        },
        "requires_manual_review": False,
        "created_at": datetime.utcnow()
    }
    await results_collection.insert_one(result_doc)
    
    return VigilanceResponse(**result)

# Language Models
class SentenceRepetitionRequest(BaseModel):
    session_id: str
    user_id: str
    sentences: List[Dict[str, str]]  # [{original: "...", user_answer: "..."}]

class SentenceRepetitionResponse(BaseModel):
    score: int  # 0-2
    confidence: float
    individual_scores: List[Dict[str, Any]]

@router.post("/language/sentence-repetition", response_model=SentenceRepetitionResponse)
async def score_sentence_repetition_test(data: SentenceRepetitionRequest):
    """
    Score sentence repetition with fuzzy matching
    - ≥0.8 similarity: 1 point
    - 0.7-0.8: 0.5 points
    - <0.7: 0 points
    """
    result = score_sentence_repetition(data.sentences)
    
    results_collection = get_collection("results")
    result_doc = {
        "_id": str(uuid.uuid4()),
        "session_id": data.session_id,
        "user_id": data.user_id,
        "section_name": "sentence_repetition",
        "raw_score": result["score"],
        "confidence": result["confidence"],
        "details": {
            "sentences": data.sentences,
            "individual_scores": result["individual_scores"]
        },
        "requires_manual_review": False,
        "created_at": datetime.utcnow()
    }
    await results_collection.insert_one(result_doc)
    
    return SentenceRepetitionResponse(**result)

class VerbalFluencyRequest(BaseModel):
    session_id: str
    user_id: str
    transcript: str
    duration_seconds: float

class VerbalFluencyResponse(BaseModel):
    score: int  # 0-2
    confidence: float
    word_count: int
    unique_words: int

@router.post("/language/verbal-fluency", response_model=VerbalFluencyResponse)
async def score_verbal_fluency_test(data: VerbalFluencyRequest):
    """
    Score verbal fluency
    - ≥11 words in 60s: 2 points
    - <11 words: 0 points
    """
    result = score_verbal_fluency(data.transcript)
    
    results_collection = get_collection("results")
    result_doc = {
        "_id": str(uuid.uuid4()),
        "session_id": data.session_id,
        "user_id": data.user_id,
        "section_name": "verbal_fluency",
        "raw_score": result["score"],
        "confidence": result["confidence"],
        "details": {
            "word_count": result["word_count"],
            "unique_words": result["unique_words"],
            "duration": data.duration_seconds
        },
        "requires_manual_review": False,
        "created_at": datetime.utcnow()
    }
    await results_collection.insert_one(result_doc)
    
    return VerbalFluencyResponse(**result)

# Abstraction Models
class AbstractionRequest(BaseModel):
    session_id: str
    user_id: str
    responses: List[Dict[str, str]]  # [{pair: "train-bicycle", answer: "means of transportation", correct: True}]

class AbstractionResponse(BaseModel):
    score: int  # 0-2
    confidence: float

@router.post("/abstraction", response_model=AbstractionResponse)
async def score_abstraction_test(data: AbstractionRequest):
    """
    Score abstraction test
    - 1 point per correct answer (max 2)
    """
    result = score_abstraction(data.responses)
    
    results_collection = get_collection("results")
    result_doc = {
        "_id": str(uuid.uuid4()),
        "session_id": data.session_id,
        "user_id": data.user_id,
        "section_name": "abstraction",
        "raw_score": result["score"],
        "confidence": result["confidence"],
        "details": {
            "responses": data.responses
        },
        "requires_manual_review": False,
        "created_at": datetime.utcnow()
    }
    await results_collection.insert_one(result_doc)
    
    return AbstractionResponse(**result)

# Delayed Recall Models
class DelayedRecallRequest(BaseModel):
    session_id: str
    user_id: str
    original_words: List[str]
    recalled_words: List[str]

class DelayedRecallResponse(BaseModel):
    score: int  # 0-4
    confidence: float
    matches: List[Dict[str, Any]]

@router.post("/delayed-recall", response_model=DelayedRecallResponse)
async def score_delayed_recall_test(data: DelayedRecallRequest):
    """
    Score delayed recall with fuzzy matching
    - 1 point per correctly recalled word (max 5 in MoCA, but PRD says 4)
    """
    result = score_delayed_recall(data.original_words, data.recalled_words)
    
    results_collection = get_collection("results")
    result_doc = {
        "_id": str(uuid.uuid4()),
        "session_id": data.session_id,
        "user_id": data.user_id,
        "section_name": "delayed_recall",
        "raw_score": result["score"],
        "confidence": result["confidence"],
        "details": {
            "original_words": data.original_words,
            "recalled_words": data.recalled_words,
            "matches": result["matches"]
        },
        "requires_manual_review": False,
        "created_at": datetime.utcnow()
    }
    await results_collection.insert_one(result_doc)
    
    return DelayedRecallResponse(**result)
