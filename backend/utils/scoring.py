"""
Scoring utilities for cognitive tests
Implements deterministic and heuristic scoring with confidence metrics
"""
from typing import List, Dict, Any
from fuzzywuzzy import fuzz
import base64
import io
import numpy as np
from PIL import Image

def score_trail_making(
    user_path: List[str],
    node_positions: Dict[str, Dict[str, float]],
    crossing_errors: int
) -> Dict[str, Any]:
    """
    Score trail making test
    Returns 1 point if sequence is correct and no crossings, 0 otherwise
    """
    # Expected sequence: 1-A-2-B-3-C-4-D-5-E
    expected_sequence = ['1', 'A', '2', 'B', '3', 'C', '4', 'D', '5', 'E']
    
    sequence_correct = user_path == expected_sequence
    no_crossings = crossing_errors == 0
    
    score = 1 if (sequence_correct and no_crossings) else 0
    
    # Confidence based on partial correctness
    if sequence_correct and no_crossings:
        confidence = 1.0
    elif sequence_correct:
        confidence = 0.8
    elif len(user_path) == len(expected_sequence):
        confidence = 0.6
    else:
        confidence = 0.4
    
    return {
        "score": score,
        "crossing_errors": crossing_errors,
        "sequence_correct": sequence_correct,
        "confidence": confidence,
        "requires_manual_review": confidence < 0.7
    }

def score_cube_copy(
    image_data: str,
    shapes_to_copy: List[str]
) -> Dict[str, Any]:
    """
    Score 2D figure and 3D cone copy
    Returns 0-3 points (one per shape)
    
    This is a placeholder using deterministic heuristics
    In production, would use CV model
    """
    try:
        # Decode base64 image
        image_bytes = base64.b64decode(image_data.split(',')[1] if ',' in image_data else image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Heuristic: Check if image has content (non-white pixels)
        has_content = np.mean(img_array) < 250  # If mostly white, no drawing
        
        # Placeholder scoring: Give partial credit based on image complexity
        if not has_content:
            shape_scores = {shape: 0 for shape in shapes_to_copy}
            total_score = 0
            confidence = 0.9
        else:
            # Heuristic: If there's content, assume shapes are drawn
            # In production, use CV to detect each shape
            shape_scores = {shape: 1 for shape in shapes_to_copy}
            total_score = len(shapes_to_copy)
            confidence = 0.6  # Low confidence triggers manual review
        
        return {
            "score": total_score,
            "shape_scores": shape_scores,
            "confidence": confidence,
            "requires_manual_review": confidence < 0.7
        }
    except Exception as e:
        # Error in processing, require manual review
        return {
            "score": 0,
            "shape_scores": {shape: 0 for shape in shapes_to_copy},
            "confidence": 0.3,
            "requires_manual_review": True
        }

def score_clock_drawing(
    image_data: str,
    target_time: str
) -> Dict[str, Any]:
    """
    Score clock drawing test
    Returns 0-3 points: contour (1), numbers (1), hands (1)
    
    Placeholder implementation
    """
    try:
        # Decode image
        image_bytes = base64.b64decode(image_data.split(',')[1] if ',' in image_data else image_data)
        image = Image.open(io.BytesIO(image_bytes))
        img_array = np.array(image)
        
        # Heuristic scoring
        has_content = np.mean(img_array) < 250
        
        if not has_content:
            scores = {"contour": 0, "numbers": 0, "hands": 0}
            confidence = 0.9
        else:
            # Placeholder: assume all criteria met if drawing exists
            scores = {"contour": 1, "numbers": 1, "hands": 1}
            confidence = 0.7  # Borderline for manual review
        
        total_score = sum(scores.values())
        
        return {
            "score": total_score,
            "scores": scores,
            "confidence": confidence,
            "requires_manual_review": confidence < 0.7
        }
    except Exception as e:
        return {
            "score": 0,
            "scores": {"contour": 0, "numbers": 0, "hands": 0},
            "confidence": 0.3,
            "requires_manual_review": True
        }

def score_naming(
    responses: List[Dict[str, str]]
) -> Dict[str, Any]:
    """
    Score naming test with fuzzy matching
    Returns 0-3 points (one per animal)
    Accepts similarity >= 0.6
    """
    individual_scores = []
    total_score = 0
    
    for response in responses:
        animal = response["animal"].lower()
        user_answer = response["user_answer"].lower()
        
        # Fuzzy match using Levenshtein ratio
        similarity = fuzz.ratio(animal, user_answer) / 100.0
        
        if similarity >= 0.6:
            score = 1
            total_score += 1
        else:
            score = 0
        
        individual_scores.append({
            "animal": animal,
            "user_answer": user_answer,
            "similarity": similarity,
            "score": score
        })
    
    return {
        "score": total_score,
        "confidence": 1.0,
        "individual_scores": individual_scores
    }

def score_attention_forward(
    user_response: List[int],
    correct_sequence: List[int]
) -> Dict[str, Any]:
    """Score forward digit span"""
    correct = user_response == correct_sequence
    return {
        "score": 1 if correct else 0,
        "confidence": 1.0,
        "correct": correct
    }

def score_attention_backward(
    user_response: List[int],
    correct_sequence: List[int]
) -> Dict[str, Any]:
    """Score backward digit span (should be reversed)"""
    expected = list(reversed(correct_sequence))
    correct = user_response == expected
    return {
        "score": 1 if correct else 0,
        "confidence": 1.0,
        "correct": correct
    }

def score_attention_vigilance(
    taps: List[int],
    target_indices: List[int],
    total_targets: int
) -> Dict[str, Any]:
    """
    Score vigilance test
    0-1 error: 3 points
    2 errors: 2 points
    3 errors: 1 point
    >3 errors: 0 points
    """
    taps_set = set(taps)
    targets_set = set(target_indices)
    
    # Calculate hits, misses, false alarms
    hits = len(taps_set & targets_set)
    misses = len(targets_set - taps_set)
    false_alarms = len(taps_set - targets_set)
    
    total_errors = misses + false_alarms
    
    if total_errors <= 1:
        score = 3
    elif total_errors == 2:
        score = 2
    elif total_errors == 3:
        score = 1
    else:
        score = 0
    
    return {
        "score": score,
        "confidence": 1.0,
        "hits": hits,
        "misses": misses,
        "false_alarms": false_alarms
    }

def score_sentence_repetition(
    sentences: List[Dict[str, str]]
) -> Dict[str, Any]:
    """
    Score sentence repetition with fuzzy matching
    >= 0.8 similarity: 1 point
    0.7-0.8: 0.5 points
    < 0.7: 0 points
    """
    individual_scores = []
    total_score = 0.0
    
    for sentence in sentences:
        original = sentence["original"].lower()
        user_answer = sentence["user_answer"].lower()
        
        similarity = fuzz.ratio(original, user_answer) / 100.0
        
        if similarity >= 0.8:
            score = 1.0
        elif similarity >= 0.7:
            score = 0.5
        else:
            score = 0.0
        
        total_score += score
        
        individual_scores.append({
            "original": original,
            "user_answer": user_answer,
            "similarity": similarity,
            "score": score
        })
    
    return {
        "score": int(total_score),  # Round to nearest int
        "confidence": 1.0,
        "individual_scores": individual_scores
    }

def score_verbal_fluency(
    transcript: str
) -> Dict[str, Any]:
    """
    Score verbal fluency
    >= 11 words: 2 points
    < 11 words: 0 points
    """
    # Parse transcript and count words starting with 'F'
    words = transcript.lower().split()
    f_words = [w for w in words if w.startswith('f') and len(w) > 1]
    unique_f_words = list(set(f_words))
    
    word_count = len(f_words)
    unique_count = len(unique_f_words)
    
    score = 2 if word_count >= 11 else 0
    
    return {
        "score": score,
        "confidence": 0.8,  # ASR may have errors
        "word_count": word_count,
        "unique_words": unique_count
    }

def score_abstraction(
    responses: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Score abstraction test
    1 point per correct answer (max 2)
    """
    total_score = sum(1 for r in responses if r.get("correct", False))
    
    return {
        "score": total_score,
        "confidence": 1.0
    }

def score_delayed_recall(
    original_words: List[str],
    recalled_words: List[str]
) -> Dict[str, Any]:
    """
    Score delayed recall with fuzzy matching
    1 point per correctly recalled word
    """
    matches = []
    score = 0
    
    # Normalize words
    original_normalized = [w.lower() for w in original_words]
    recalled_normalized = [w.lower() for w in recalled_words]
    
    for orig_word in original_normalized:
        best_match = None
        best_similarity = 0.0
        
        for recall_word in recalled_normalized:
            similarity = fuzz.ratio(orig_word, recall_word) / 100.0
            if similarity > best_similarity:
                best_similarity = similarity
                best_match = recall_word
        
        # Accept match if similarity >= 0.7
        if best_similarity >= 0.7:
            score += 1
            matched = True
        else:
            matched = False
        
        matches.append({
            "original": orig_word,
            "recalled": best_match,
            "similarity": best_similarity,
            "matched": matched
        })
    
    return {
        "score": min(score, 4),  # Cap at 4 per PRD
        "confidence": 1.0,
        "matches": matches
    }
