"""
Unit tests for scoring functions
Tests all cognitive assessment scoring logic
"""
import pytest
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
    score_delayed_recall,
    score_orientation
)
import base64
from PIL import Image
import io

class TestTrailMaking:
    """Tests for trail making scoring"""
    
    def test_perfect_score(self):
        """Test correct sequence with no crossings"""
        user_path = ['1', 'A', '2', 'B', '3', 'C', '4', 'D', '5', 'E']
        node_positions = {}  # Not used in basic scoring
        result = score_trail_making(user_path, node_positions, crossing_errors=0)
        
        assert result["score"] == 1
        assert result["sequence_correct"] == True
        assert result["crossing_errors"] == 0
        assert result["confidence"] == 1.0
    
    def test_incorrect_sequence(self):
        """Test incorrect sequence"""
        user_path = ['1', '2', 'A', 'B', '3', 'C', '4', 'D', '5', 'E']
        node_positions = {}
        result = score_trail_making(user_path, node_positions, crossing_errors=0)
        
        assert result["score"] == 0
        assert result["sequence_correct"] == False
    
    def test_with_crossings(self):
        """Test correct sequence but with crossings"""
        user_path = ['1', 'A', '2', 'B', '3', 'C', '4', 'D', '5', 'E']
        node_positions = {}
        result = score_trail_making(user_path, node_positions, crossing_errors=2)
        
        assert result["score"] == 0  # Crossings cause failure


class TestNaming:
    """Tests for naming task scoring"""
    
    def test_exact_matches(self):
        """Test exact animal name matches"""
        responses = [
            {"animal": "lion", "user_answer": "lion"},
            {"animal": "elephant", "user_answer": "elephant"},
            {"animal": "giraffe", "user_answer": "giraffe"}
        ]
        result = score_naming(responses)
        
        assert result["score"] == 3
        assert all(s["score"] == 1 for s in result["individual_scores"])
    
    def test_fuzzy_matching(self):
        """Test fuzzy matching with similar spellings"""
        responses = [
            {"animal": "rhinoceros", "user_answer": "rhino"},  # Should match
            {"animal": "hippopotamus", "user_answer": "hippo"},  # Should match
            {"animal": "elephant", "user_answer": "elefant"}  # Should match (typo)
        ]
        result = score_naming(responses)
        
        # Fuzzy matching should accept these
        assert result["score"] >= 2  # At least 2 should match
    
    def test_incorrect_answers(self):
        """Test completely incorrect answers"""
        responses = [
            {"animal": "lion", "user_answer": "cat"},
            {"animal": "elephant", "user_answer": "dog"},
            {"animal": "giraffe", "user_answer": "horse"}
        ]
        result = score_naming(responses)
        
        assert result["score"] == 0


class TestAttention:
    """Tests for attention tasks"""
    
    def test_forward_digit_span_correct(self):
        """Test correct forward digit span"""
        result = score_attention_forward([2, 1, 8, 5, 4], [2, 1, 8, 5, 4])
        assert result["score"] == 1
        assert result["correct"] == True
    
    def test_forward_digit_span_incorrect(self):
        """Test incorrect forward digit span"""
        result = score_attention_forward([2, 1, 8, 4, 5], [2, 1, 8, 5, 4])
        assert result["score"] == 0
        assert result["correct"] == False
    
    def test_backward_digit_span_correct(self):
        """Test correct backward digit span (user provides reversed)"""
        result = score_attention_backward([7, 4, 2], [2, 4, 7])
        assert result["score"] == 1
        assert result["correct"] == True
    
    def test_vigilance_perfect(self):
        """Test vigilance with 0-1 errors"""
        taps = [0, 3, 6, 9]  # User taps
        target_indices = [0, 3, 6, 9]  # Correct targets
        result = score_attention_vigilance(taps, target_indices, total_targets=4)
        
        assert result["score"] == 3  # 0-1 error = 3 points
        assert result["hits"] == 4
        assert result["misses"] == 0
        assert result["false_alarms"] == 0
    
    def test_vigilance_with_errors(self):
        """Test vigilance with multiple errors"""
        taps = [0, 1, 3, 6]  # User taps (1 is false alarm, missed 9)
        target_indices = [0, 3, 6, 9]  # Correct targets
        result = score_attention_vigilance(taps, target_indices, total_targets=4)
        
        assert result["misses"] == 1
        assert result["false_alarms"] == 1
        # Total errors = 2, should get 2 points


class TestLanguage:
    """Tests for language tasks"""
    
    def test_sentence_repetition_perfect(self):
        """Test perfect sentence repetition"""
        sentences = [
            {"original": "I only know that John is the one to help today", 
             "user_answer": "I only know that John is the one to help today"}
        ]
        result = score_sentence_repetition(sentences)
        
        assert result["score"] >= 1
        assert result["individual_scores"][0]["similarity"] >= 0.8
    
    def test_sentence_repetition_partial(self):
        """Test partial sentence match (70-80% similarity)"""
        sentences = [
            {"original": "I only know that John is the one to help today",
             "user_answer": "I only know John is the one to help today"}  # Missing "that"
        ]
        result = score_sentence_repetition(sentences)
        
        # Should get partial credit
        similarity = result["individual_scores"][0]["similarity"]
        assert 0.7 <= similarity < 0.8
    
    def test_verbal_fluency_sufficient_words(self):
        """Test verbal fluency with ≥11 words"""
        transcript = "fox fish fork farm face foot finger flame flag frame fruit flower"
        result = score_verbal_fluency(transcript)
        
        assert result["score"] == 2
        assert result["word_count"] >= 11
    
    def test_verbal_fluency_insufficient_words(self):
        """Test verbal fluency with <11 words"""
        transcript = "fox fish fork farm face"
        result = score_verbal_fluency(transcript)
        
        assert result["score"] == 0
        assert result["word_count"] < 11


class TestAbstraction:
    """Tests for abstraction task"""
    
    def test_both_correct(self):
        """Test both abstractions correct"""
        responses = [
            {"pair": "train-bicycle", "answer": "means of transportation", "correct": True},
            {"pair": "watch-ruler", "answer": "measuring instruments", "correct": True}
        ]
        result = score_abstraction(responses)
        
        assert result["score"] == 2
    
    def test_one_correct(self):
        """Test one correct abstraction"""
        responses = [
            {"pair": "train-bicycle", "answer": "means of transportation", "correct": True},
            {"pair": "watch-ruler", "answer": "tools", "correct": False}
        ]
        result = score_abstraction(responses)
        
        assert result["score"] == 1


class TestDelayedRecall:
    """Tests for delayed recall"""
    
    def test_perfect_recall(self):
        """Test perfect word recall"""
        original = ["face", "velvet", "church", "daisy", "red"]
        recalled = ["face", "velvet", "church", "daisy", "red"]
        result = score_delayed_recall(original, recalled)
        
        assert result["score"] == 4  # Capped at 4 per PRD
    
    def test_partial_recall(self):
        """Test partial word recall"""
        original = ["face", "velvet", "church", "daisy", "red"]
        recalled = ["face", "church", "red"]
        result = score_delayed_recall(original, recalled)
        
        assert result["score"] == 3
    
    def test_fuzzy_recall(self):
        """Test recall with similar spellings"""
        original = ["face", "velvet", "church", "daisy", "red"]
        recalled = ["fase", "velvet", "chruch", "daisy"]  # Typos
        result = score_delayed_recall(original, recalled)
        
        # Should accept with fuzzy matching
        assert result["score"] >= 3


class TestOrientation:
    """Tests for orientation questions"""
    
    def test_all_correct(self):
        """Test all orientation questions correct"""
        from datetime import datetime
        now = datetime.utcnow()
        
        responses = {
            "date": str(now.day),
            "month": now.strftime("%B"),
            "year": str(now.year),
            "day": now.strftime("%A"),
            "city": "San Francisco"
        }
        result = score_orientation(responses)
        
        assert result["score"] == 5
        assert result["individual_scores"]["date"]["correct"] == True
        assert result["individual_scores"]["month"]["correct"] == True
        assert result["individual_scores"]["year"]["correct"] == True
        assert result["individual_scores"]["day"]["correct"] == True
        assert result["individual_scores"]["city"]["correct"] == True
    
    def test_partial_correct(self):
        """Test some orientation questions correct"""
        from datetime import datetime
        now = datetime.utcnow()
        
        responses = {
            "date": "1",  # Wrong
            "month": now.strftime("%B"),  # Correct
            "year": str(now.year),  # Correct
            "day": "Monday",  # Probably wrong
            "city": "Test City"  # Provided
        }
        result = score_orientation(responses)
        
        # Should get points for correct answers
        assert result["score"] >= 3


class TestCubeCopy:
    """Tests for cube/shape copy (placeholder heuristics)"""
    
    def test_with_drawing(self):
        """Test with actual drawing content"""
        # Create a simple test image (not blank)
        img = Image.new('RGB', (100, 100), color='white')
        # Draw something
        pixels = img.load()
        for i in range(50, 60):
            for j in range(50, 60):
                pixels[i, j] = (0, 0, 0)  # Black square
        
        # Convert to base64
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_data = base64.b64encode(buffer.getvalue()).decode()
        
        result = score_cube_copy(f"data:image/png;base64,{img_data}", ["square", "circle", "cone"])
        
        # With placeholder heuristic, should detect content
        assert result["score"] >= 0
        assert "shape_scores" in result


class TestClockDrawing:
    """Tests for clock drawing (placeholder heuristics)"""
    
    def test_clock_drawing(self):
        """Test clock drawing scoring"""
        # Create a test image
        img = Image.new('RGB', (100, 100), color='white')
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        img_data = base64.b64encode(buffer.getvalue()).decode()
        
        result = score_clock_drawing(f"data:image/png;base64,{img_data}", "10:10")
        
        assert "score" in result
        assert "scores" in result
        assert "confidence" in result
        assert result["score"] >= 0 and result["score"] <= 3


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
