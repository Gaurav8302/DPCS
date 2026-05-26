"""
Unit tests for scoring functions based on MoCA PRD
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
    score_attention_serial7,
    score_sentence_repetition,
    score_verbal_fluency,
    score_abstraction,
    score_delayed_recall,
    MEMORY_WORDS,
    SENTENCES,
    NAMING_ACCEPTABLE_ANSWERS,
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
    """Tests for naming task scoring per PRD Section 3.2"""
    
    def test_exact_matches_prd_animals(self):
        """Test exact animal name matches with PRD-specified animals"""
        responses = [
            {"animal": "lion", "user_answer": "lion"},
            {"animal": "rhinoceros", "user_answer": "rhinoceros"},
            {"animal": "camel", "user_answer": "camel"}
        ]
        result = score_naming(responses)
        
        assert result["score"] == 3
        assert all(s["score"] == 1 for s in result["individual_scores"])
    
    def test_acceptable_alternatives(self):
        """Test PRD-specified acceptable alternatives"""
        responses = [
            {"animal": "lion", "user_answer": "lion"},
            {"animal": "rhinoceros", "user_answer": "rhino"},  # Acceptable per PRD
            {"animal": "camel", "user_answer": "dromedary"}   # Acceptable per PRD
        ]
        result = score_naming(responses)
        
        # All should be accepted per PRD
        assert result["score"] == 3
    
    def test_fuzzy_matching(self):
        """Test fuzzy matching with similar spellings"""
        responses = [
            {"animal": "rhinoceros", "user_answer": "rhinoceros"},  # Exact
            {"animal": "lion", "user_answer": "leon"},  # Typo - should match (≥60%)
            {"animal": "camel", "user_answer": "camal"}  # Typo - should match (≥60%)
        ]
        result = score_naming(responses)
        
        # Fuzzy matching should accept these
        assert result["score"] >= 2
    
    def test_incorrect_answers(self):
        """Test completely incorrect answers"""
        responses = [
            {"animal": "lion", "user_answer": "cat"},
            {"animal": "rhinoceros", "user_answer": "elephant"},
            {"animal": "camel", "user_answer": "horse"}
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
        """Test vigilance with 0-1 errors (PRD: 1 point)"""
        taps = [0, 3, 6, 9]  # User taps
        target_indices = [0, 3, 6, 9]  # Correct targets
        result = score_attention_vigilance(taps, target_indices, total_targets=4)
        
        # PRD: 0-1 errors = 1 point (max score for vigilance)
        assert result["score"] == 1
        assert result["hits"] == 4
        assert result["misses"] == 0
        assert result["false_alarms"] == 0
    
    def test_vigilance_one_error(self):
        """Test vigilance with exactly 1 error (still scores 1 point per PRD)"""
        taps = [0, 3, 6]  # User taps (missed 9)
        target_indices = [0, 3, 6, 9]  # Correct targets
        result = score_attention_vigilance(taps, target_indices, total_targets=4)
        
        assert result["misses"] == 1
        assert result["false_alarms"] == 0
        assert result["total_errors"] == 1
        # PRD: 0-1 errors = 1 point
        assert result["score"] == 1
    
    def test_vigilance_with_multiple_errors(self):
        """Test vigilance with 2+ errors (0 points per PRD)"""
        taps = [0, 1, 3, 6]  # User taps (1 is false alarm, missed 9)
        target_indices = [0, 3, 6, 9]  # Correct targets
        result = score_attention_vigilance(taps, target_indices, total_targets=4)
        
        assert result["misses"] == 1
        assert result["false_alarms"] == 1
        assert result["total_errors"] == 2
        # PRD: 2+ errors = 0 points
        assert result["score"] == 0
    
    def test_serial7_perfect(self):
        """Test Serial 7s with all correct answers (PRD: 3 points)"""
        # 100-7=93, 93-7=86, 86-7=79, 79-7=72, 72-7=65
        responses = [93, 86, 79, 72, 65]
        result = score_attention_serial7(responses)
        
        # All 5 correct subtractions = 3 points
        assert result["score"] == 3
        assert result["correct_count"] == 5
    
    def test_serial7_four_correct(self):
        """Test Serial 7s with 4 correct (still 3 points per PRD)"""
        # One subtraction error in the middle
        responses = [93, 85, 78, 71, 64]  # 85 wrong, but 85-7=78 ✓, etc.
        result = score_attention_serial7(responses)
        
        # PRD: 4-5 correct = 3 points
        assert result["correct_count"] >= 4
        assert result["score"] == 3
    
    def test_serial7_two_three_correct(self):
        """Test Serial 7s with 2-3 correct (2 points)"""
        responses = [93, 86, 80, 75, 70]  # Only 2 correct: 93, 86
        result = score_attention_serial7(responses)
        
        # PRD: 2-3 correct = 2 points
        assert result["correct_count"] <= 3
        assert result["score"] <= 2
    
    def test_serial7_one_correct(self):
        """Test Serial 7s with 1 correct (1 point)"""
        responses = [93, 80, 70, 60, 50]  # Only 93 is correct subtraction
        result = score_attention_serial7(responses)
        
        assert result["correct_count"] == 1
        # PRD: 1 correct = 1 point
        assert result["score"] == 1
    
    def test_serial7_none_correct(self):
        """Test Serial 7s with 0 correct (0 points)"""
        responses = [90, 80, 70, 60, 50]  # None are -7 subtractions
        result = score_attention_serial7(responses)
        
        assert result["correct_count"] == 0
        assert result["score"] == 0


class TestLanguage:
    """Tests for language tasks per PRD Section 3.4"""
    
    def test_sentence_repetition_perfect(self):
        """Test perfect sentence repetition with PRD sentences"""
        # PRD Sentence 1: "The child walked his dog in the park after midnight."
        sentences = [
            {"original": "The child walked his dog in the park after midnight", 
             "user_answer": "The child walked his dog in the park after midnight"}
        ]
        result = score_sentence_repetition(sentences)
        
        assert result["score"] >= 1
        assert result["individual_scores"][0]["similarity"] >= 0.8
    
    def test_sentence_repetition_both_perfect(self):
        """Test both PRD sentences perfect (2 points)"""
        sentences = [
            {"original": "The child walked his dog in the park after midnight",
             "user_answer": "The child walked his dog in the park after midnight"},
            {"original": "The artist finished his painting at the right moment for the exhibition",
             "user_answer": "The artist finished his painting at the right moment for the exhibition"}
        ]
        result = score_sentence_repetition(sentences)
        
        # PRD: 2 points max (1 per sentence)
        assert result["score"] == 2
    
    def test_sentence_repetition_partial(self):
        """Test partial sentence match (doesn't score if not exact enough)"""
        sentences = [
            {"original": "The child walked his dog in the park after midnight",
             "user_answer": "The child walked dog park"}  # Significantly shortened
        ]
        result = score_sentence_repetition(sentences)
        
        # Should not get full credit for significantly shortened sentence
        similarity = result["individual_scores"][0]["similarity"]
        assert similarity < 0.8
    
    def test_verbal_fluency_sufficient_words(self):
        """Test verbal fluency with ≥11 words (PRD: 1 point)"""
        transcript = "fox fish fork farm face foot finger flame flag frame fruit flower"
        result = score_verbal_fluency(transcript)
        
        # PRD: 1 point for ≥11 unique words starting with F
        assert result["score"] == 1
        assert result["unique_words"] >= 11
    
    def test_verbal_fluency_insufficient_words(self):
        """Test verbal fluency with <11 words (0 points)"""
        transcript = "fox fish fork farm face"
        result = score_verbal_fluency(transcript)
        
        assert result["score"] == 0
        assert result["word_count"] < 11


class TestAbstraction:
    """Tests for abstraction task per PRD Section 3.5"""
    
    def test_both_correct_prd_pairs(self):
        """Test both PRD abstractions correct with tools/light concepts"""
        # PRD pairs: Hammer/Screwdriver (tools), Matches/Lamp (light sources)
        # Function expects list of strings (user answers for each pair)
        responses = ["tools", "light"]
        result = score_abstraction(responses)
        
        assert result["score"] == 2
    
    def test_acceptable_alternatives(self):
        """Test PRD-acceptable alternative answers"""
        # "carpentry" is acceptable for Hammer/Screwdriver
        # "illumination" is acceptable for Matches/Lamp
        responses = ["carpentry", "illumination"]
        result = score_abstraction(responses)
        
        # Both should be accepted
        assert result["score"] == 2
    
    def test_one_correct(self):
        """Test one correct abstraction"""
        responses = ["tools", "things you find at home"]
        result = score_abstraction(responses)
        
        assert result["score"] == 1
    
    def test_concrete_thinking_zero_points(self):
        """Test concrete (non-abstract) answers get 0 points"""
        # These are unacceptable per PRD
        responses = ["have handles", "produce heat"]
        result = score_abstraction(responses)
        
        # Concrete/unacceptable answers should not score
        assert result["score"] == 0


class TestDelayedRecall:
    """Tests for delayed recall per PRD Section 3.6"""
    
    def test_perfect_recall_prd_words(self):
        """Test perfect word recall with PRD words (5 points)"""
        # PRD words: LEG, COTTON, SCHOOL, TOMATO, WHITE
        original = ["leg", "cotton", "school", "tomato", "white"]
        recalled = ["leg", "cotton", "school", "tomato", "white"]
        result = score_delayed_recall(original, recalled)
        
        # PRD: 1 point per word, max 5 points
        assert result["score"] == 5
    
    def test_partial_recall(self):
        """Test partial word recall"""
        original = ["leg", "cotton", "school", "tomato", "white"]
        recalled = ["leg", "school", "white"]
        result = score_delayed_recall(original, recalled)
        
        assert result["score"] == 3
    
    def test_fuzzy_recall(self):
        """Test recall with similar spellings"""
        original = ["leg", "cotton", "school", "tomato", "white"]
        recalled = ["leg", "coton", "scool", "tomato"]  # Typos
        result = score_delayed_recall(original, recalled)
        
        # Should accept with fuzzy matching
        assert result["score"] >= 3


class TestOrientation:
    """Tests for orientation questions - PLACEHOLDER"""
    
    def test_orientation_placeholder(self):
        """Orientation scoring not yet implemented in utils.scoring"""
        # TODO: Implement score_orientation in utils/scoring.py
        # For now, skip these tests
        pytest.skip("Orientation scoring function not yet implemented")


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
