# LinguaSense AI 🧠
### Smart Multilingual Language Detection for Roman Urdu & Code-Mixed Text

A production-ready AI SaaS platform for multilingual text analysis, specializing in Roman Urdu and code-mixed South Asian text.

---

## ✨ Features

- 🌐 **Multilingual Detection** — English, Urdu, Roman Urdu, Hindi, Arabic, French
- ⚡ **Real-Time Analysis** — Instant word-level language tagging
- 🔀 **Code-Mixed Detection** — Specialized Roman Urdu + English detection
- 🛡 **Toxicity Detection** — Word-level offensive content highlighting
- 😊 **Sentiment Analysis** — Positive / Neutral / Negative
- 📊 **Analytics Dashboard** — Charts, trends, history
- 🔐 **JWT Authentication** — Secure signup/login
- 📤 **Export** — CSV download of analysis history

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, Recharts |
| Backend | Python FastAPI, Uvicorn, SQLAlchemy ORM |
| AI/NLP | scikit-learn, TF-IDF, Naive Bayes, Logistic Regression |
| Database | MySQL 8.0 |
| Auth | JWT (python-jose + passlib bcrypt) |
| Deploy | Docker, Docker Compose |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- Python 3.10+
- MySQL 8.0

### 1. Clone & Setup

```bash
git clone <repo-url>
cd LinguaSense
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env with your MySQL credentials

# Start backend
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Train AI Models (Optional)

```bash
cd ai_models
python train_models.py
```

### 5. MySQL Database

Create the database:
```sql
CREATE DATABASE linguasense CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Tables are auto-created on first backend startup via SQLAlchemy.

---

## 🐳 Docker Deployment

```bash
# Copy and configure environment
copy .env.example .env

# Build and start all services
docker-compose up --build

# Access:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## 📁 Project Structure

```
LinguaSense/
├── frontend/                  # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx    # Landing page
│   │   │   ├── auth/          # Login, Signup, ForgotPassword
│   │   │   └── dashboard/     # Dashboard, Workspace, History, Settings
│   │   ├── components/
│   │   │   └── layout/        # DashboardLayout with sidebar
│   │   ├── context/           # AuthContext (JWT)
│   │   └── lib/               # Axios API client
│   └── Dockerfile
│
├── backend/                   # FastAPI backend
│   ├── app/
│   │   ├── api/               # auth.py, analysis.py routers
│   │   ├── core/              # config, database, security
│   │   ├── models/            # SQLAlchemy ORM models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # nlp_service.py (AI logic)
│   │   └── main.py            # FastAPI app entry
│   ├── requirements.txt
│   └── Dockerfile
│
├── ai_models/
│   └── train_models.py        # TF-IDF + NB + LR training
│
├── datasets/
│   └── language_dataset.csv   # Training data
│
├── docker-compose.yml
└── README.md
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | Register new user |
| POST | `/api/v1/auth/login` | Login, get JWT |
| GET | `/api/v1/auth/me` | Get current user |
| PUT | `/api/v1/auth/profile` | Update profile |
| POST | `/api/v1/analysis/analyze` | Analyze text |
| GET | `/api/v1/analysis/history` | Get history |
| GET | `/api/v1/analysis/dashboard` | Dashboard stats |
| DELETE | `/api/v1/analysis/history/{id}` | Delete analysis |
| GET | `/api/v1/analysis/export/csv` | Export CSV |

Full Swagger docs: `http://localhost:8000/docs`

---

## 🤖 AI Models

The NLP pipeline uses:
1. **Rule-based word classifier** — Roman Urdu lexicon (200+ words)
2. **Script detection** — Unicode ranges for Urdu/Hindi/Arabic
3. **TF-IDF + Naive Bayes** — Character n-gram classifier
4. **TF-IDF + Logistic Regression** — Higher accuracy classifier
5. **Lexicon-based sentiment** — Positive/negative word lists
6. **Toxicity detection** — Offensive word lexicon

---

## 🌍 Supported Languages

| Language | Detection Method |
|----------|-----------------|
| English | langdetect + lexicon |
| Roman Urdu | Custom 200+ word lexicon |
| Urdu (script) | Unicode U+0600–U+06FF |
| Hindi | Unicode U+0900–U+097F |
| Arabic | Unicode U+0600–U+06FF |
| French | langdetect |
| Code-Mixed | Hybrid word-level analysis |

---

## 📄 License

MIT License — Free for academic and commercial use.
