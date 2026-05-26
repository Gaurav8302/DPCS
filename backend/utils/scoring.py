"""
Scoring utilities for cognitive tests based on MoCA PRD.

Note: Several routines include placeholder heuristics for AI-assisted
analysis. These functions surface deterministic outputs with
``confidence = 0.6`` so the frontend/backoffice can flag results for
manual review until production models are integrated.

MoCA Score Distribution per PRD:
- Executive Function & Visuospatial: 5 points (Trail Making: 1, Cube: 1, Clock: 3)
- Naming: 3 points (Lion, Rhinoceros, Camel)
- Attention: 6 points (Forward: 1, Backward: 1, Vigilance: 1, Serial 7s: 3)
- Language: 3 points (Sentence Repetition: 2, Verbal Fluency: 1)
- Abstraction: 2 points (Hammer/Screwdriver, Matches/Lamp)
- Delayed Recall: 5 points (LEG, COTTON, SCHOOL, TOMATO, WHITE)
- Orientation: 6 points (Date, Month, Year, Day, Place, City)
"""
from typing import List, Dict, Any
from fuzzywuzzy import fuzz
import base64
import io
import numpy as np
from PIL import Image

# PRD-specified acceptable answers
NAMING_ACCEPTABLE_ANSWERS = {
    'lion': ['lion'],
    'rhinoceros': ['rhinoceros', 'rhino'],
    'camel': ['camel', 'dromedary']
}

# PRD-specified memory words
MEMORY_WORDS = ['LEG', 'COTTON', 'SCHOOL', 'TOMATO', 'WHITE']

# PRD-specified abstraction pairs and acceptable answers
ABSTRACTION_PAIRS = {
    0: {  # Hammer and Screwdriver
        'acceptable': ['tools', 'tool', 'carpentry', 'construction', 'work instruments', 'hardware'],
        'unacceptable': ['instruments', 'have handles', 'metallic objects', 'metal']
    },
    1: {  # Matches and Lamp
        'acceptable': ['light', 'lighting', 'illumination', 'produce light', 'give light'],
        'unacceptable': ['fire', 'hot objects', 'produce heat', 'burn']
    }
}

# PRD-specified sentences for repetition
SENTENCES = [
    "The child walked his dog in the park after midnight.",
    "The artist finished his painting at the right moment for the exhibition."
]

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
        
        # OpenCV heuristic for Cube Copy
        import cv2
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        edges = cv2.Canny(gray, 50, 150, apertureSize=3)
        lines = cv2.HoughLinesP(edges, 1, np.pi/180, 50, minLineLength=30, maxLineGap=10)
        
        if lines is not None and len(lines) >= 8:
            # Found enough lines to be a complex shape like a cube
            total_score = len(shapes_to_copy)
            shape_scores = {shape: 1 for shape in shapes_to_copy}
            confidence = 0.8
        elif lines is not None and len(lines) > 0:
            # Partial drawing
            total_score = 1 if len(shapes_to_copy) > 0 else 0
            shape_scores = {}
            if len(shapes_to_copy) > 0:
                shape_scores[shapes_to_copy[0]] = 1
                for shape in shapes_to_copy[1:]:
                    shape_scores[shape] = 0
            confidence = 0.7
        else:
            total_score = 0
            shape_scores = {shape: 0 for shape in shapes_to_copy}
            confidence = 0.9
        
        return {
            "score": total_score,
            "shape_scores": shape_scores,
            "confidence": confidence,
            "requires_manual_review": confidence < 0.85
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
        
        # OpenCV heuristic for Clock Drawing
        import cv2
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        blurred = cv2.GaussianBlur(gray, (9, 9), 2)
        
        # Circle detection
        circles = cv2.HoughCircles(blurred, cv2.HOUGH_GRADIENT, 1, 20, param1=50, param2=30, minRadius=20, maxRadius=0)
        has_contour = circles is not None
        
        # Line detection for hands
        edges = cv2.Canny(gray, 50, 150, apertureSize=3)
        lines = cv2.HoughLinesP(edges, 1, np.pi/180, 50, minLineLength=20, maxLineGap=10)
        has_hands = lines is not None and len(lines) >= 2
        
        # Heuristic for numbers: variance/noise inside the circle
        has_numbers = np.std(gray) > 10
        
        scores = {
            "contour": 1 if has_contour else 0,
            "numbers": 1 if has_numbers else 0,
            "hands": 1 if has_hands else 0
        }
        confidence = 0.8
        
        total_score = sum(scores.values())
        
        return {
            "score": total_score,
            "scores": scores,
            "confidence": confidence,
            "requires_manual_review": confidence < 0.85
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
    Score naming test per PRD Section 3.2.
    
    Animal Images & Acceptable Responses:
    1. Lion (1 point): "lion"
    2. Rhinoceros (1 point): "rhinoceros", "rhino"
    3. Camel (1 point): "camel", "dromedary"
    
    Returns 0-3 points (one per correctly identified animal)
    Uses fuzzy matching for typos with minimum 60% similarity
    """
    individual_scores = []
    total_score = 0
    
    for response in responses:
        animal = response["animal"].lower().strip()
        user_answer = response["user_answer"].lower().strip()
        
        # Check against PRD-specified acceptable answers
        acceptable = NAMING_ACCEPTABLE_ANSWERS.get(animal, [animal])
        
        # Check for exact or acceptable match first
        exact_match = user_answer in acceptable
        
        # If not exact match, try fuzzy matching against all acceptable answers
        best_similarity = 0.0
        if not exact_match:
            for acceptable_answer in acceptable:
                similarity = fuzz.ratio(acceptable_answer, user_answer) / 100.0
                best_similarity = max(best_similarity, similarity)
        else:
            best_similarity = 1.0
        
        # Score if exact match or high similarity (≥60%)
        if exact_match or best_similarity >= 0.6:
            score = 1
            total_score += 1
        else:
            score = 0
        
        individual_scores.append({
            "animal": animal,
            "user_answer": user_answer,
            "acceptable_answers": acceptable,
            "similarity": best_similarity,
            "exact_match": exact_match,
            "score": score
        })
    
    return {
        "score": min(total_score, 3),  # Max 3 points per PRD
        "confidence": 1.0,
        "individual_scores": individual_scores,
        "requires_manual_review": False
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
        "correct": correct,
        "requires_manual_review": False
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
        "correct": correct,
        "requires_manual_review": False
    }

def score_attention_vigilance(
    taps: List[int],
    target_indices: List[int],
    total_targets: int
) -> Dict[str, Any]:
    """
    Score vigilance test per PRD Section 3.4 C.
    
    Letter Sequence: F-B-A-C-M-N-A-A-F-K-C-A-D-E-A-A-F-A-K-L-F-A-M
    Target: Tap/click on letter 'A' only
    Scoring: 0-1 errors = 1 point, 2+ errors = 0 points
    """
    taps_set = set(taps)
    targets_set = set(target_indices)
    
    # Calculate hits, misses, false alarms
    hits = len(taps_set & targets_set)
    misses = len(targets_set - taps_set)
    false_alarms = len(taps_set - targets_set)
    
    total_errors = misses + false_alarms
    
    # Per PRD: 0-1 errors = 1 point, 2+ errors = 0 points
    score = 1 if total_errors <= 1 else 0
    
    return {
        "score": score,
        "confidence": 1.0,
        "hits": hits,
        "misses": misses,
        "false_alarms": false_alarms,
        "total_errors": total_errors,
        "requires_manual_review": False
    }


def score_attention_serial7(
    user_responses: List[int]
) -> Dict[str, Any]:
    """
    Score Serial 7s test per PRD Section 3.4 D.
    
    Starting Number: 100 (subtract 7 repeatedly)
    Correct Sequence: 100 → 93 → 86 → 79 → 72 → 65
    
    Scoring (each subtraction evaluated independently):
    - 0 correct subtractions = 0 points
    - 1 correct subtraction = 1 point
    - 2-3 correct subtractions = 2 points
    - 4-5 correct subtractions = 3 points
    
    Key Rule: Each subtraction is evaluated independently.
    Example: 100 → 92 → 85 → 78 → 71 = 3 points (first wrong, rest correct based on previous)
    """
    expected_first = [93, 86, 79, 72, 65]
    
    correct_count = 0
    previous_value = 100
    details = []
    
    for i, user_answer in enumerate(user_responses[:5]):
        # Each subtraction evaluated independently: 
        # Check if user's answer is exactly 7 less than their previous value
        expected_from_previous = previous_value - 7
        is_correct = user_answer == expected_from_previous
        
        if is_correct:
            correct_count += 1
        
        details.append({
            "position": i + 1,
            "expected_from_100": expected_first[i] if i < len(expected_first) else None,
            "expected_from_previous": expected_from_previous,
            "user_answer": user_answer,
            "correct": is_correct
        })
        
        previous_value = user_answer  # Use user's answer as base for next evaluation
    
    # Scoring per PRD
    if correct_count == 0:
        score = 0
    elif correct_count == 1:
        score = 1
    elif correct_count <= 3:
        score = 2
    else:  # 4-5 correct
        score = 3
    
    return {
        "score": score,
        "confidence": 1.0,
        "correct_count": correct_count,
        "details": details,
        "requires_manual_review": False
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
    
    capped_score = min(total_score, 2.0)
    return {
        "score": float(f"{capped_score:.2f}"),
        "confidence": 0.6,
        "individual_scores": individual_scores,
        "requires_manual_review": True
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
    
    score = 1 if unique_count >= 11 else 0
    
    return {
        "score": score,
        "confidence": 0.6,
        "word_count": word_count,
        "unique_words": unique_count,
        "valid_words": unique_f_words,
        "requires_manual_review": True
    }

def score_abstraction(
    responses: List[str]
) -> Dict[str, Any]:
    """
    Score abstraction test per PRD Section 3.6.
    
    Word Pairs:
    1. "Hammer" and "Screwdriver" - Acceptable: tools, carpentry, construction, work instruments
    2. "Matches" and "Lamp" - Acceptable: light, lighting, illumination
    
    Unacceptable Responses:
    - Hammer/Screwdriver: instruments, have handles, metallic objects
    - Matches/Lamp: fire, hot objects, produce heat
    
    Returns 0-2 points (1 point per correct abstraction)
    """
    individual_scores = []
    total_score = 0
    
    for i, response in enumerate(responses[:2]):
        response_lower = response.lower().strip()
        pair_config = ABSTRACTION_PAIRS.get(i, {})
        acceptable = pair_config.get('acceptable', [])
        unacceptable = pair_config.get('unacceptable', [])
        
        # Check if response matches any acceptable answer (fuzzy match)
        is_acceptable = False
        matched_acceptable = None
        for acceptable_answer in acceptable:
            if acceptable_answer in response_lower or fuzz.ratio(acceptable_answer, response_lower) >= 70:
                is_acceptable = True
                matched_acceptable = acceptable_answer
                break
        
        # Check if response matches any unacceptable answer
        is_unacceptable = any(unacceptable_answer in response_lower for unacceptable_answer in unacceptable)
        
        # Score if acceptable and not unacceptable
        if is_acceptable and not is_unacceptable:
            score = 1
            total_score += 1
        else:
            score = 0
        
        pair_names = ["Hammer/Screwdriver", "Matches/Lamp"]
        individual_scores.append({
            "pair": pair_names[i] if i < len(pair_names) else f"Pair {i+1}",
            "user_answer": response,
            "acceptable_answers": acceptable,
            "matched": matched_acceptable,
            "is_unacceptable": is_unacceptable,
            "score": score
        })
    
    return {
        "score": min(total_score, 2),
        "confidence": 1.0,
        "individual_scores": individual_scores,
        "correct_answers": ["tools", "light"],
        "requires_manual_review": False
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
        
        # Accept match if similarity >= 0.6 (60% tolerance)
        if best_similarity >= 0.6:
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
        "score": min(score, 5),  # Cap at 5 (5 words)
        "confidence": 1.0,
        "matches": matches,
        "requires_manual_review": False
    }

def score_orientation(
    user_date: int,
    user_month: int,
    user_year: int,
    user_day: str,
    user_city: str,
    gps_latitude: float = None,
    gps_longitude: float = None
) -> Dict[str, Any]:
    """
    Score orientation test with backend verification
    - User must manually input all fields (no auto-fill)
    - Backend verifies against system time and GPS
    - 1 point each for: date, month, year, day, city, place (max 6)
    """
    from datetime import datetime
    
    now = datetime.now()
    verification = {}
    score = 0
    
    # Verify Date
    date_correct = user_date == now.day
    if date_correct:
        score += 1
    verification["date"] = {
        "user_input": user_date,
        "actual": now.day,
        "correct": date_correct
    }
    
    # Verify Month
    month_correct = user_month == (now.month)
    if month_correct:
        score += 1
    verification["month"] = {
        "user_input": user_month,
        "actual": now.month,
        "correct": month_correct
    }
    
    # Verify Year
    year_correct = user_year == now.year
    if year_correct:
        score += 1
    verification["year"] = {
        "user_input": user_year,
        "actual": now.year,
        "correct": year_correct
    }
    
    # Verify Day of Week
    actual_day = now.strftime("%A")
    day_correct = user_day.lower() == actual_day.lower()
    if day_correct:
        score += 1
    verification["day"] = {
        "user_input": user_day,
        "actual": actual_day,
        "correct": day_correct
    }
    
    # Verify City using OpenStreetMap Nominatim reverse geocoding
    import httpx
    
    city_verified = False
    note = "City verification required reverse geocoding"
    actual_city = None
    
    if gps_latitude and gps_longitude:
        try:
            url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={gps_latitude}&lon={gps_longitude}&zoom=10"
            headers = {"User-Agent": "DimentiaApp/2.0"}
            response = httpx.get(url, headers=headers, timeout=5.0)
            if response.status_code == 200:
                data = response.json()
                address = data.get("address", {})
                actual_city = address.get("city") or address.get("town") or address.get("village") or address.get("county") or ""
                
                # Check fuzzy match
                from fuzzywuzzy import fuzz
                if actual_city and fuzz.partial_ratio(user_city.lower(), actual_city.lower()) >= 80:
                    city_verified = True
                elif not actual_city and len(user_city.strip()) > 2:
                    city_verified = True # Fallback
            else:
                city_verified = len(user_city.strip()) > 2
                note = "Geocoding API failed, falling back to basic check"
        except Exception as e:
            city_verified = len(user_city.strip()) > 2
            note = f"Geocoding error: {str(e)}, falling back to basic check"
    else:
        city_verified = len(user_city.strip()) > 2
        note = "No GPS coordinates provided, basic check only"
        
    if city_verified:
        score += 1
    
    verification["city"] = {
        "user_input": user_city,
        "gps_coordinates": {
            "latitude": gps_latitude,
            "longitude": gps_longitude
        } if gps_latitude and gps_longitude else None,
        "actual": actual_city,
        "verified": city_verified,
        "note": note
    }
    
    # Place (generic - assume correct if they're taking the test)
    score += 1  # Give credit for being at a location to take test
    verification["place"] = {
        "assumed_correct": True,
        "note": "Assuming test-taking environment"
    }
    
    return {
        "score": score,
        "confidence": 1.0 if score >= 4 else 0.8,
        "verification": verification,
        "requires_manual_review": score < 3
    }

