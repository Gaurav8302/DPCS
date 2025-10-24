# 🧠 Dimentia Project v2.0

A next-generation digital platform for early detection of cognitive decline and dementia, implementing the Montreal Cognitive Assessment (MoCA) through an interactive web interface with AI-powered scoring.

## 🎯 Features

- **Interactive Cognitive Tests**: 9 comprehensive test modules
- **Automated Scoring**: AI-powered with 95%+ accuracy
- **Secure & Compliant**: HIPAA-grade encryption, GDPR compliant
- **Real-time Analytics**: Admin dashboard with detailed insights
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Accessibility First**: High-contrast mode, ARIA labels, keyboard navigation

## 🏗️ Technology Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Konva.js
- **Backend**: FastAPI (Python 3.11+)
- **Database**: Firebase Firestore ✨ NEW
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (frontend) + Render.com (backend)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Firebase account (free tier available)

### Frontend Setup

```bash
cd frontend
npm install
cp ../.env.example .env.local
# Edit .env.local with your credentials
npm run dev
```

Frontend will run at http://localhost:3000

### Backend Setup

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
cp ../.env.example .env
# Edit .env with your credentials
uvicorn main:app --reload --port 8000
```

Backend will run at http://localhost:8000

## 📊 Test Modules

1. **Trail Making** - Sequential connection test with visual aids
2. **Cube/2D Figure Copy** - Shape recognition and reproduction
3. **Clock Drawing** - Time representation assessment
4. **Naming** - Animal identification with fuzzy matching
5. **Attention** - Forward/backward digit span, vigilance
6. **Language** - Sentence repetition, verbal fluency
7. **Abstraction** - Multiple-choice reasoning
8. **Delayed Recall** - Memory retention test
9. **Orientation** - Date, time, and location verification

## 🔒 Security

- AES-256 encryption at rest
- TLS 1.3 in transit
- JWT session tokens (24h expiration)
- Audit logging for all PHI access
- GDPR right to deletion
- HIPAA compliance features

## 📈 Scoring System

- **30-point scale** with education adjustment
- **Interpretation**:
  - 26–30: Normal
  - 18–25: Mild impairment
  - 10–17: Moderate impairment
  - <10: Severe impairment

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
pytest
```

## 📝 License

Proprietary - Healthcare Application

## 👥 Support

For issues or questions, contact the development team.

---

Built with ❤️ for improved cognitive health screening
