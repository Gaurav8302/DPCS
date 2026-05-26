<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# **DETAILED PRODUCT REQUIREMENTS DOCUMENT (PRD)**

# AI-Powered Digital MoCA Dementia Screening Platform


***

## **1. EXECUTIVE SUMMARY**

### **Product Vision**

A comprehensive web-based digital platform that accurately replicates the Montreal Cognitive Assessment (MoCA) test for early dementia screening, featuring AI-powered scoring, automated analysis, and seamless user experience for both patients and healthcare providers.

### **Product Objectives**

- Provide clinically accurate digital MoCA screening accessible via web browsers
- Implement automated scoring with 95%+ accuracy compared to paper-based assessments
- Enable remote cognitive screening for healthcare providers and self-assessment for individuals
- Maintain HIPAA compliance and medical data security standards
- Generate actionable insights and recommendations based on test results

***

## **2. DETAILED TECHNICAL SPECIFICATIONS**

### **Technology Stack**

- **Frontend**: Next.js 14+ with TypeScript, Tailwind CSS
- **Backend**: Python (FastAPI), PostgreSQL database
- **Drawing Components**: React Canvas Draw, Konva.js for interactive elements
- **Authentication**: NextAuth.js with OAuth support
- **Deployment**: Vercel (frontend), AWS/GCP (backend)
- **Security**: End-to-end encryption, HIPAA-compliant data handling

***

## **3. COMPREHENSIVE MoCA TEST IMPLEMENTATION**

### **3.1 EXECUTIVE FUNCTION \& VISUOSPATIAL (5 Points Total)**

#### **A. Alternating Trail Making (1 Point)**

**Digital Implementation:**

```
Display Pattern: 1 - A - 2 - B - 3 - C - 4 - D - 5 - E
User Interface: Interactive canvas with drag-and-drop functionality
```

**Administration Logic:**

- Present numbered circles and lettered circles on screen
- User draws lines connecting 1→A→2→B→3→C→4→D→5→E
- Real-time validation prevents crossing lines
- Auto-detection of completion

**Scoring Algorithm:**

```python
def score_trail_making(user_path):
    correct_sequence = ['1', 'A', '2', 'B', '3', 'C', '4', 'D', '5', 'E']
    if user_path == correct_sequence and no_line_crossings(user_path):
        return 1
    return 0
```

**UI Components:**

- Canvas with pre-positioned circles
- Line drawing tool with touch/mouse support
- Visual feedback for correct/incorrect connections
- Undo functionality for user corrections

***

#### **B. Cube Copying (1 Point)**

**Digital Implementation:**

- Display reference 3D cube image
- Provide drawing canvas below
- Touch/stylus drawing support with line smoothing

**Scoring Criteria (All Must Be Met):**

1. Drawing must be three-dimensional
2. All lines are drawn (12 lines total)
3. All lines meet with little or no space
4. No extra lines added
5. Lines relatively parallel with similar length
6. 3D orientation preserved

**Automated Scoring Logic:**

```python
def score_cube_drawing(image_data):
    # Basic computer vision analysis
    detected_lines = detect_lines(image_data)
    if (len(detected_lines) >= 10 and 
        is_3d_structure(detected_lines) and
        no_extra_elements(detected_lines)):
        return 1
    return 0  # Manual review flagged
```


***

#### **C. Clock Drawing (3 Points)**

**Digital Implementation:**

- Large circular drawing area
- Number placement tools or freehand drawing
- Hand placement interface (drag/rotate)
- Time setting: "5 past 10" (10:05)

**Detailed Scoring Breakdown:**

**Contour (1 Point):**

- Clock face must be circle or square
- Minor distortions acceptable
- If numbers arranged circularly but no contour = 0 points

**Numbers (1 Point):**

- All 12 numbers present, no extras
- Correct order (1-12 clockwise)
- Placed in appropriate quadrants
- Roman numerals acceptable
- All inside OR all outside contour (not mixed)

**Hands (1 Point):**

- Two hands present
- Hour hand shorter than minute hand
- Hands indicate 10:05 correctly
- Junction centered in clock face

**Automated Scoring Algorithm:**

```python
def score_clock_drawing(image_data):
    scores = {'contour': 0, 'numbers': 0, 'hands': 0}
    
    # Contour detection
    if detect_circular_shape(image_data):
        scores['contour'] = 1
    
    # Number recognition
    numbers = detect_numbers(image_data)
    if len(numbers) == 12 and in_correct_positions(numbers):
        scores['numbers'] = 1
    
    # Hand analysis
    hands = detect_lines_as_hands(image_data)
    if validate_hand_positions(hands, target_time="10:05"):
        scores['hands'] = 1
    
    return sum(scores.values())
```


***

### **3.2 NAMING (3 Points Total)**

**Digital Implementation:**

- Display three animal images sequentially
- Text input field for each animal
- Voice-to-text option for accessibility

**Animal Images \& Acceptable Responses:**

1. **Lion** (1 point): "lion"
2. **Rhinoceros** (1 point): "rhinoceros", "rhino"
3. **Camel** (1 point): "camel", "dromedary"

**Scoring Logic:**

```python
def score_naming(user_responses):
    acceptable_answers = {
        'animal1': ['lion'],
        'animal2': ['rhinoceros', 'rhino'],
        'animal3': ['camel', 'dromedary']
    }
    score = 0
    for i, response in enumerate(user_responses):
        if response.lower().strip() in acceptable_answers[f'animal{i+1}']:
            score += 1
    return score
```


***

### **3.3 MEMORY (0 Points During Administration, 5 Points at Recall)**

**Word List:** LEG, COTTON, SCHOOL, TOMATO, WHITE

**Digital Implementation:**

- Audio playback of words (1 per second)
- Text display optional
- Two learning trials with input collection
- Delayed recall after other sections

**Administration Flow:**

1. **Trial 1**: Read words, user recalls immediately
2. **Trial 2**: Repeat words, user recalls again
3. **Store for later**: "I will ask you to recall these words at the end"

**Memory Index Score (MIS) System:**

- **Free Recall**: 3 points per word (×5 = 15 max)
- **Category Cue**: 2 points per word
- **Multiple Choice**: 1 point per word

**Cue System:**


| Word | Category Cue | Multiple Choice |
| :-- | :-- | :-- |
| LEG | body part | hand, leg, face |
| COTTON | type of fabric | silk, cotton, nylon |
| SCHOOL | public building | school, hospital, library |
| TOMATO | type of food | lettuce, tomato, carrot |
| WHITE | color | purple, white, green |


***

### **3.4 ATTENTION (6 Points Total)**

#### **A. Forward Digit Span (1 Point)**

**Test Sequence:** 5-2-9-4-8
**Digital UI:** Display numbers sequentially, audio playback
**Input Method:** Number pad or voice input

#### **B. Backward Digit Span (1 Point)**

**Test Sequence:** 4-2-7 (Correct response: 7-2-4)
**Implementation:** Clear instruction display, separate input field

#### **C. Vigilance Task (1 Point)**

**Letter Sequence:** F-B-A-C-M-N-A-A-F-K-C-A-D-E-A-A-F-A-K-L-F-A-M
**Target:** Tap/click on letter 'A' only
**Scoring:** 0-1 errors = 1 point, 2+ errors = 0 points

**Digital Implementation:**

```javascript
// Vigilance test component
const vigilanceSequence = ['F','B','A','C','M','N','A','A','F','K','C','A','D','E','A','A','F','A','K','L','F','A','M'];
let errors = 0;
let currentIndex = 0;

function displayLetter() {
    // Show letter for 1 second
    // Track user taps
    // Calculate errors
}
```


#### **D. Serial 7s (3 Points)**

**Starting Number:** 100 (subtract 7 repeatedly)
**Correct Sequence:** 100 → 93 → 86 → 79 → 72 → 65

**Scoring System:**

- 0 correct subtractions = 0 points
- 1 correct subtraction = 1 point
- 2-3 correct subtractions = 2 points
- 4-5 correct subtractions = 3 points

**Key Scoring Rule:** Each subtraction evaluated independently
**Example:** 100 → 92 → 85 → 78 → 71 = 3 points (first wrong, rest correct)

***

### **3.5 LANGUAGE (3 Points Total)**

#### **A. Sentence Repetition (2 Points)**

**Sentences:**

1. "The child walked his dog in the park after midnight."
2. "The artist finished his painting at the right moment for the exhibition."

**Scoring Requirements:**

- Must be EXACT repetition
- No omissions, substitutions, or additions
- Grammar must be preserved
- 1 point per sentence

**Common Errors to Detect:**

- Omitting words ("right", "after")
- Substitutions ("at" → "after")
- Plural changes ("painting" → "paintings")


#### **B. Verbal Fluency (1 Point)**

**Task:** Generate words beginning with letter "F" (or "B" depending on version)
**Time Limit:** 60 seconds
**Scoring:** 11+ words = 1 point

**Exclusions:**

- Proper nouns (Bob, Boston)
- Numbers
- Same word with different suffixes (love, lover, loving)

**Digital Implementation:**

```python
def score_verbal_fluency(word_list, target_letter):
    valid_words = []
    excluded_words = load_excluded_words()
    
    for word in word_list:
        if (word[^0].lower() == target_letter.lower() and 
            word.lower() not in excluded_words and
            is_valid_dictionary_word(word)):
            valid_words.append(word)
    
    return 1 if len(valid_words) >= 11 else 0
```


***

### **3.6 ABSTRACTION (2 Points Total)**

**Word Pairs:**

1. "Hammer" and "Screwdriver"
2. "Matches" and "Lamp"

**Acceptable Responses:**

- **Hammer/Screwdriver:** tools, carpentry, construction, work instruments
- **Matches/Lamp:** light, lighting, illumination

**Unacceptable Responses:**

- **Hammer/Screwdriver:** instruments, have handles, metallic objects
- **Matches/Lamp:** fire, hot objects, produce heat

**Scoring Algorithm:**

```python
def score_abstraction(response1, response2):
    acceptable_1 = ['tools', 'carpentry', 'construction', 'work instruments']
    acceptable_2 = ['light', 'lighting', 'illumination']
    
    score = 0
    if any(term in response1.lower() for term in acceptable_1):
        score += 1
    if any(term in response2.lower() for term in acceptable_2):
        score += 1
    return score
```


***

### **3.7 DELAYED RECALL (5 Points)**

**Word List:** LEG, COTTON, SCHOOL, TOMATO, WHITE
**Scoring:** 1 point per word recalled without cues
**Implementation:** Text input with fuzzy matching for minor typos

***

### **3.8 ORIENTATION (6 Points Total)**

**Questions:**

1. What is today's date? (1 point)
2. What month is it? (1 point)
3. What year is it? (1 point)
4. What day of the week is it? (1 point)
5. What is the name of this place? (1 point)
6. What city are we in? (1 point)

**Scoring Requirements:**

- Must be exact
- No margin for error (even 1 day off = 0 points)
- Date validation against system date

***

## **4. COMPREHENSIVE SCORING SYSTEM**

### **Score Calculation**

```python
class MoCAScorer:
    def calculate_total_score(self, section_scores, education_years):
        total = sum([
            section_scores['trail_making'],      # 1 point
            section_scores['cube_copy'],         # 1 point  
            section_scores['clock_drawing'],     # 3 points
            section_scores['naming'],            # 3 points
            section_scores['attention'],         # 6 points
            section_scores['language'],          # 3 points
            section_scores['abstraction'],       # 2 points
            section_scores['delayed_recall'],    # 5 points
            section_scores['orientation']        # 6 points
        ])
        
        # Education adjustment
        if education_years <= 12:
            total += 1
            
        return min(total, 30)  # Maximum 30 points
```


### **Interpretation Guidelines**

- **26-30 points:** Normal cognition
- **18-25 points:** Mild cognitive impairment
- **10-17 points:** Moderate cognitive impairment
- **<10 points:** Severe cognitive impairment


### **Alternative Cut-off Considerations**

- Some populations use 23/24 as cut-off[^1][^2]
- Cultural and educational adjustments may apply[^2][^3]

***

## **5. USER INTERFACE SPECIFICATIONS**

### **5.1 Test Flow Architecture**

```
Home Page → Consent/Profile → Instructions → Test Sections (1-8) → Results → Export
```


### **5.2 Section-by-Section UI Requirements**

#### **Progress Indicators**

- Progress bar showing: Section X of 8
- Point accumulation: X/30 points
- Time elapsed (for monitoring)


#### **Navigation**

- "Next" button after each section
- "Previous" button for review (if allowed)
- "Save and Continue Later" option


#### **Accessibility Features**

- Screen reader compatibility
- High contrast mode
- Large font options
- Voice command support
- Keyboard navigation

***

## **6. BACKEND API SPECIFICATIONS**

### **6.1 Core Endpoints**

```python
# Test session management
POST /api/sessions          # Create new test session
GET /api/sessions/{id}      # Retrieve session
PUT /api/sessions/{id}      # Update session

# Section scoring
POST /api/score/trail-making     # Score trail making
POST /api/score/clock-drawing    # Score clock drawing  
POST /api/score/naming          # Score naming
POST /api/score/attention       # Score attention tasks
POST /api/score/language        # Score language tasks
POST /api/score/abstraction     # Score abstraction
POST /api/score/recall          # Score delayed recall
POST /api/score/orientation     # Score orientation

# Results and reporting
GET /api/results/{session_id}   # Get complete results
POST /api/results/export        # Export to PDF/CSV
```


### **6.2 Data Models**

```python
class TestSession(BaseModel):
    session_id: str
    user_id: Optional[str]
    start_time: datetime
    completion_time: Optional[datetime]
    education_years: int
    sections_completed: List[str]
    total_score: Optional[int]
    
class SectionResult(BaseModel):
    session_id: str
    section_name: str
    raw_response: Dict
    score: int
    max_score: int
    completion_time: datetime
    requires_manual_review: bool
```


***

## **7. AI/ML IMPLEMENTATION STRATEGY**

### **7.1 Automated Scoring Models**

#### **Clock Drawing Analysis**

```python
# Computer vision pipeline
def analyze_clock_drawing(image_data):
    # Preprocessing
    image = preprocess_image(image_data)
    
    # Feature extraction
    contour = detect_clock_face(image)
    numbers = detect_numbers_ocr(image)  
    hands = detect_hand_lines(image)
    
    # Scoring logic
    scores = {
        'contour': score_contour(contour),
        'numbers': score_numbers(numbers),
        'hands': score_hands(hands, target_time="10:05")
    }
    
    confidence = calculate_confidence(scores)
    return scores, confidence
```


#### **Drawing Quality Assessment**

- Use pre-trained CNN for shape recognition
- Template matching for geometric accuracy
- Confidence scoring for manual review flagging


### **7.2 Natural Language Processing**

#### **Sentence Repetition Scoring**

```python
def score_sentence_repetition(original, user_input):
    # Exact matching with fuzzy tolerance
    similarity = calculate_similarity(original, user_input)
    exact_match = (similarity >= 0.95)
    return 1 if exact_match else 0
```


#### **Verbal Fluency Analysis**

- Dictionary validation
- Proper noun detection
- Suffix variation filtering

***

## **8. DATA PRIVACY \& SECURITY**

### **8.1 Compliance Requirements**

- **HIPAA Compliance**: Encrypted storage, audit logs
- **GDPR Compliance**: Right to deletion, data portability
- **FERPA Compliance**: Educational data protection (if applicable)


### **8.2 Data Handling**

- End-to-end encryption in transit
- AES-256 encryption at rest
- No PHI stored without explicit consent
- Session-based storage with auto-expiration


### **8.3 Security Measures**

```python
# Data encryption
def encrypt_session_data(data):
    key = get_encryption_key()
    return fernet.encrypt(json.dumps(data).encode())

# Audit logging
def log_access(user_id, action, session_id):
    audit_log.info({
        'timestamp': datetime.now(),
        'user_id': hash_user_id(user_id),
        'action': action,
        'session_id': session_id
    })
```


***

## **9. QUALITY ASSURANCE \& VALIDATION**

### **9.1 Accuracy Validation**

- Cross-validation with paper MoCA results
- Inter-rater reliability testing
- Clinical validation studies


### **9.2 Testing Strategy**

- Unit tests for each scoring algorithm
- Integration tests for complete workflows
- User acceptance testing with healthcare providers
- Load testing for concurrent users


### **9.3 Performance Metrics**

- Scoring accuracy vs. human raters (target: >95%)
- Test completion rate (target: >90%)
- System availability (target: 99.9%)
- Response time (target: <2s per action)

***

## **10. DEPLOYMENT \& SCALABILITY**

### **10.1 Infrastructure**

- **Frontend**: Vercel with CDN
- **Backend**: AWS ECS with auto-scaling
- **Database**: AWS RDS PostgreSQL with read replicas
- **File Storage**: AWS S3 for drawings/images
- **Monitoring**: CloudWatch, Sentry for error tracking


### **10.2 Scalability Planning**

- Horizontal scaling for API servers
- Database sharding by geographic region
- CDN for global content delivery
- Caching layer (Redis) for session data

***

## **11. SUCCESS METRICS \& KPIs**

### **11.1 Clinical Metrics**

- Sensitivity/Specificity vs. paper MoCA
- False positive/negative rates
- Correlation with neuropsychological assessments


### **11.2 User Experience Metrics**

- Test completion rates
- Time to complete (target: 10-15 minutes)
- User satisfaction scores
- Healthcare provider adoption rates


### **11.3 Technical Metrics**

- System uptime (99.9%+)
- API response times (<2s)
- Error rates (<0.1%)
- Concurrent user capacity (1000+ simultaneous tests)

***

## **12. REGULATORY \& COMPLIANCE**

### **12.1 Medical Device Considerations**

- FDA guidance for digital therapeutics
- Clinical validation requirements
- Software as Medical Device (SaMD) classification


### **12.2 International Standards**

- ISO 27001 for information security
- ISO 13485 for medical devices quality management
- IEC 62304 for medical device software

***

## **13. FUTURE ENHANCEMENTS**

### **13.1 Phase 2 Features**

- Multi-language support (100+ languages)[^4][^1]
- Tablet/mobile app versions
- Integration with EHR systems
- Longitudinal tracking and analytics


### **13.2 Advanced AI Features**

- Eye-tracking integration for attention assessment
- Voice analysis for speech patterns
- Behavioral pattern recognition
- Predictive modeling for dementia progression

***

This comprehensive PRD provides the complete technical, clinical, and business requirements for developing a production-ready digital MoCA platform. The detailed scoring algorithms, UI specifications, and implementation guidelines ensure clinical accuracy while maintaining user experience standards.
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.smchealth.org/sites/main/files/file-attachments/moca-instructions-english_2010.pdf

[^2]: https://geriatrictoolkit.missouri.edu/cog/MoCA-8.3-English-Instructions-2018-02.pdf

[^3]: https://mocacognition.com/faq/

[^4]: https://mocacognition.com/paper/

[^5]: https://www.medicalnewstoday.com/articles/moca-test-for-dementia

[^6]: https://www.verywellhealth.com/alzheimers-and-montreal-cognitive-assessment-moca-98617

[^7]: https://catch-on.org/wp-content/uploads/2016/12/MoCA-Basic-Instructions.pdf

[^8]: https://www.sciencedirect.com/topics/neuroscience/montreal-cognitive-assessment

[^9]: https://www.youtube.com/watch?v=wO7n19KMveU

[^10]: https://sense-cog.eu/wp-content/uploads/2022/08/MoCA-H-English-Test-Instructions_V2.0.pdf

[^11]: https://geriatrictoolkit.missouri.edu/cog/MoCA-8.3-English-Test-2018-04.pdf

[^12]: https://files.alz.washington.edu/UDS4/preview-forms/FormC2Worksheets-Preview-April2024.pdf

[^13]: https://pmc.ncbi.nlm.nih.gov/articles/PMC8075065/

[^14]: https://catch-on.org/wp-content/uploads/2016/12/MOCA-Basic.pdf

[^15]: https://talkbank.org/dementia/protocol/materials/MOCA-instructions.docx

[^16]: https://www.mdcalc.com/calc/10044/montreal-cognitive-assessment-moca

[^17]: https://pubmed.ncbi.nlm.nih.gov/15817019/

[^18]: https://mocacognition.com

[^19]: https://pmc.ncbi.nlm.nih.gov/articles/PMC7554137/

[^20]: https://www.healthcare.uiowa.edu/familymedicine/fpinfo/residency/MoCA-8.3-English-Test-2020.pdf

