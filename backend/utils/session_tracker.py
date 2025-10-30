"""Helpers for recording section results and updating session aggregates.
"""
from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional
import uuid

from fastapi import HTTPException, status

from database import get_collection

# Section configuration describing how raw section names map to aggregate buckets
SECTION_CONFIG: Dict[str, Dict[str, Any]] = {
    "trail_making": {"aggregate": "trail_making", "max": 1.0},
    "cube_copy": {"aggregate": "cube_copy", "max": 3.0},
    "clock_drawing": {"aggregate": "clock_drawing", "max": 3.0},
    "naming": {"aggregate": "naming", "max": 3.0},
    "attention_forward": {"aggregate": "attention", "sub_key": "forward", "max": 1.0},
    "attention_backward": {"aggregate": "attention", "sub_key": "backward", "max": 1.0},
    "attention_vigilance": {"aggregate": "attention", "sub_key": "vigilance", "max": 3.0},
    "sentence_repetition": {"aggregate": "language", "sub_key": "sentence_repetition", "max": 2.0},
    "verbal_fluency": {"aggregate": "language", "sub_key": "verbal_fluency", "max": 2.0},
    "abstraction": {"aggregate": "abstraction", "max": 2.0},
    "delayed_recall": {"aggregate": "delayed_recall", "max": 4.0},
    "orientation": {"aggregate": "orientation", "max": 5.0},
}

AGGREGATE_MAX: Dict[str, float] = {
    "trail_making": 1.0,
    "cube_copy": 3.0,
    "clock_drawing": 3.0,
    "naming": 3.0,
    "attention": 5.0,
    "language": 4.0,
    "abstraction": 2.0,
    "delayed_recall": 4.0,
    "orientation": 5.0,
}

AGGREGATE_EXPECTED_SUBSECTIONS: Dict[str, set[str]] = {
    "attention": {"forward", "backward", "vigilance"},
    "language": {"sentence_repetition", "verbal_fluency"},
}


class MoCAScorer:
    """Utility helpers for MoCA total score and interpretation."""

    INTERPRETATION_RANGES = (
        (26, 30, "Normal"),
        (18, 25, "Mild"),
        (10, 17, "Moderate"),
        (0, 9, "Severe"),
    )

    @classmethod
    def calculate_total_score(cls, section_scores: Dict[str, float]) -> float:
        total = 0.0
        for section, max_points in AGGREGATE_MAX.items():
            total += min(float(section_scores.get(section, 0.0)), max_points)
        # Keep totals within 30 point scale
        return min(total, 30.0)

    @classmethod
    def interpret_score(cls, total_score: float) -> Optional[str]:
        if total_score <= 0:
            return None
        for lower, upper, label in cls.INTERPRETATION_RANGES:
            if lower <= total_score <= upper:
                return label
        # Fallback in case of rounding issues
        return cls.INTERPRETATION_RANGES[-1][2]


class SessionScoreAggregator:
    """Apply section scores to a session document and compute aggregates."""

    def __init__(self, session_doc: Dict[str, Any]):
        self.session = session_doc

    def _prepare_state(self) -> tuple[Dict[str, float], Dict[str, Dict[str, float]]]:
        section_scores = dict(self.session.get("section_scores") or {})
        subsection_scores = dict(self.session.get("subsection_scores") or {})
        return section_scores, subsection_scores

    def _round_score(self, value: float) -> float:
        return float(f"{value:.2f}")

    def apply(
        self,
        *,
        section_name: str,
        raw_score: float,
        requires_manual_review: bool,
    ) -> Dict[str, Any]:
        config = SECTION_CONFIG.get(section_name)
        aggregate_key = config["aggregate"] if config else section_name
        per_section_max = config.get("max") if config else AGGREGATE_MAX.get(aggregate_key, raw_score)

        section_scores, subsection_scores = self._prepare_state()

        # Clamp score within expected range for the section
        sanitized_score = max(0.0, min(float(raw_score), per_section_max))

        if config and config.get("sub_key"):
            sub_key = config["sub_key"]
            aggregate_meta = dict(subsection_scores.get(aggregate_key) or {})
            aggregate_meta[sub_key] = sanitized_score
            subsection_scores[aggregate_key] = aggregate_meta
            aggregate_total = sum(aggregate_meta.values())
            aggregate_total = min(aggregate_total, AGGREGATE_MAX[aggregate_key])
            section_scores[aggregate_key] = self._round_score(aggregate_total)
        else:
            subsection_scores.pop(aggregate_key, None)
            section_scores[aggregate_key] = self._round_score(sanitized_score)

        completed_sections = set(self.session.get("completed_sections") or [])
        if aggregate_key in AGGREGATE_EXPECTED_SUBSECTIONS:
            expected = AGGREGATE_EXPECTED_SUBSECTIONS[aggregate_key]
            observed = set(subsection_scores.get(aggregate_key, {}).keys())
            if expected.issubset(observed):
                completed_sections.add(aggregate_key)
        else:
            completed_sections.add(aggregate_key)

        total_score = MoCAScorer.calculate_total_score(section_scores)
        interpretation = MoCAScorer.interpret_score(total_score)

        requires_review = bool(self.session.get("requires_manual_review")) or requires_manual_review

        # Persist updated state back into local session snapshot for consecutive operations
        self.session["section_scores"] = section_scores
        self.session["subsection_scores"] = subsection_scores
        self.session["completed_sections"] = sorted(completed_sections)
        self.session["total_score"] = total_score
        self.session["interpretation"] = interpretation
        self.session["requires_manual_review"] = requires_review
        self.session["updated_at"] = datetime.utcnow()

        return {
            "section_scores": section_scores,
            "subsection_scores": subsection_scores,
            "completed_sections": sorted(completed_sections),
            "total_score": total_score,
            "interpretation": interpretation,
            "requires_manual_review": requires_review,
            "updated_at": self.session["updated_at"],
        }


async def _ensure_session_has_education_level(session: Dict[str, Any], user_id: str) -> Optional[str]:
    if session.get("education_level"):
        return session["education_level"]

    users_collection = get_collection("users")
    user = await users_collection.find_one({"_id": user_id})
    if user and user.get("education_level"):
        sessions_collection = get_collection("sessions")
        await sessions_collection.update_one(
            {"_id": session["_id"]},
            {"$set": {"education_level": user["education_level"]}},
        )
        session["education_level"] = user["education_level"]
        return user["education_level"]
    return None


async def record_section_result(
    *,
    session_id: str,
    user_id: str,
    section_name: str,
    raw_score: float,
    confidence: float,
    requires_manual_review: bool,
    details: Dict[str, Any],
    max_score: Optional[float] = None,
) -> Dict[str, Any]:
    """Persist a section result and update the owning session aggregates."""

    sessions_collection = get_collection("sessions")
    session = await sessions_collection.find_one({"_id": session_id})
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Session not found")
    if session.get("user_id") != user_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Session does not belong to user")

    await _ensure_session_has_education_level(session, user_id)

    results_collection = get_collection("results")
    result_id = str(uuid.uuid4())

    sanitized_confidence = max(0.0, min(float(confidence), 1.0))
    result_doc = {
        "_id": result_id,
        "session_id": session_id,
        "user_id": user_id,
        "section_name": section_name,
        "raw_score": float(raw_score),
        "max_score": float(max_score) if max_score is not None else None,
        "confidence": sanitized_confidence,
        "requires_manual_review": bool(requires_manual_review),
        "details": details,
        "created_at": datetime.utcnow(),
    }
    await results_collection.insert_one(result_doc.copy())

    aggregator = SessionScoreAggregator(session)
    updated_fields = aggregator.apply(
        section_name=section_name,
        raw_score=raw_score,
        requires_manual_review=requires_manual_review,
    )

    await sessions_collection.update_one({"_id": session_id}, {"$set": updated_fields})

    return {
        "result_id": result_id,
        "session_update": updated_fields,
        "total_score": updated_fields["total_score"],
        "interpretation": updated_fields["interpretation"],
    }


__all__ = [
    "MoCAScorer",
    "record_section_result",
]
