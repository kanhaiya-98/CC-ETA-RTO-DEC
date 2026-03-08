# 🚀 Zen Platform — AI Logistics Intelligence

> **ZenDec · ZenRTO · ZenETA** — Three AI engines, one unified platform.

An end-to-end AI-powered logistics platform unifying three intelligent decision engines — **carrier selection (ZenDec)**, **RTO fraud prevention (ZenRTO)**, and **ETA prediction (ZenETA)** — into a single deployable full-stack application.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-quantile-orange)](https://xgboost.readthedocs.io)
[![LightGBM](https://img.shields.io/badge/LightGBM-RTO-green)](https://lightgbm.readthedocs.io)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)

---

## 📸 Platform Overview

| Module | Engine | Core Tech |
|--------|--------|-----------|
| **ZenDec** | Carrier Decision Engine | TOPSIS · AQI Enrichment · HITL Approval · E-Way Bill |
| **ZenRTO** | RTO Fraud Risk Scorer | LightGBM · SHAP · Fraud Detection · WhatsApp COD |
| **ZenETA** | ETA Prediction | XGBoost p50/p90/p99 · Chronos-2 · Weather API · MLflow |

---

## 🏗️ Repository Structure

```
zen-platform/
├── backend/                    # FastAPI unified backend (Python)
│   ├── main.py                 # Entry point — all routers, lifespan startup
│   ├── requirements.txt
│   ├── .env.example            # Environment variable template
│   │
│   ├── core/                   # Decision engine logic
│   │   ├── topsis.py           # TOPSIS multi-criteria ranking
│   │   ├── carbon.py           # CO₂ emissions calculation
│   │   ├── autonomy.py         # Autonomy tier policy engine
│   │   └── policy_store.py     # In-memory policy registry
│   │
│   ├── routers/                # API route handlers
│   │   ├── demand.py           # ZenDec — /api/demand/*
│   │   ├── routes.py           # ZenRTO — /api/routes/*
│   │   └── eta.py              # ZenETA — /api/eta/*
│   │
│   ├── models/                 # Trained ML models
│   │   ├── eta/                # XGBoost jobs (xgb_p50/p90/p99.joblib)
│   │   └── routes/             # LightGBM RTO scorer + address parser
│   │
│   ├── services/               # External integrations
│   │   ├── gemini_service.py   # Fine-tuned LLM (Llama 3B) calls
│   │   ├── aqi_service.py      # OpenAQ v3 + city mock fallback
│   │   ├── hitl_service.py     # HITL approval card store
│   │   ├── ewaybill_service.py # E-Way Bill generation (NIC API)
│   │   ├── whatsapp.py         # Twilio WhatsApp COD confirmation
│   │   ├── weather_service.py  # Open-Meteo precipitation check
│   │   ├── fraud_detection.py  # Rule-based fraud flag engine
│   │   └── pincode_data.py     # Pincode → city, RTO rate, fraud zone
│   │
│   ├── agents/                 # Actor-Learner framework (ZenETA)
│   │   ├── actor_agent.py      # Real-time ETA inference
│   │   └── learner_agent.py    # Periodic model retraining trigger
│   │
│   ├── db/
│   │   └── supabase.py         # Supabase client + persistence helpers
│   │
│   └── utils/
│       ├── data_generator.py   # Synthetic training data generator
│       └── mlflow_tracker.py   # MLflow experiment logging
│
└── frontend/                   # Next.js 16 frontend (TypeScript)
    ├── app/
    │   ├── page.tsx            # Landing page
    │   ├── dashboard/          # Live platform dashboard
    │   ├── demand/             # ZenDec UI — carrier decision form
    │   ├── routes/             # ZenRTO UI — order risk scorer
    │   └── eta/                # ZenETA UI — ETA prediction + Chronos chart
    │
    ├── components/
    │   ├── layout/             # Navbar, Sidebar
    │   └── ui/                 # Badge, InsightBox, Card, Stat
    │
    └── lib/
        ├── api.ts              # Typed API client for all backend endpoints
        └── utils.ts            # formatCurrency(), formatMinutes()
```

---

## ✨ Features

### 🧠 ZenDec — Carrier Decision Engine
- **TOPSIS multi-criteria ranking** across cost, ETA, CO₂, SLA breach probability, red-team viability
- **Live AQI enrichment** from OpenAQ API (Delhi, Mumbai, Bangalore, Hyderabad, Chennai…)
- **Carbon footprint calculation** per carrier option (vehicle type × distance)
- **LLM stress testing** — 3 scenarios: `PEAK_DEMAND`, `WEATHER_DELAY`, `PRICE_SPIKE`
- **Out-of-Distribution (OOD) detection** for novel/unusual incident patterns → confidence penalty
- **Autonomy tiers** — `AUTO_APPROVE` / `PARETO_CARD` / `FULL_ESCALATE`
- **Human-in-the-Loop (HITL)** approval cards — create, list, resolve (APPROVE / MODIFY / REJECT)
- **Counterfactual explanations** (SHAP-style) for Tier 3 full-escalate decisions
- **E-Way Bill generation** — NIC API integration (mock for demo, production-ready stub)
- **Supabase persistence** for all decisions and audit trails

### 📦 ZenRTO — RTO Risk Scoring
- **LightGBM ML model** — trained on synthetic + real-world order return patterns
- **SHAP explainability** — top 6 risk factors with directional impact + progress bar visualization
- **Fraud flag detection** — high-value COD, fraud pincode zones, suspicious address patterns
- **Pincode intelligence** — city-level RTO rate, fraud zone classification
- **Address quality scoring** — structural completeness analysis (house no, landmark, pin)
- **WhatsApp COD confirmation** via Twilio — reduces RTO on medium-risk orders
- **3-tier action system** — `APPROVE` / `SEND_WHATSAPP_CONFIRMATION` / `HOLD` / `REJECT_COD`
- **Real-time dashboard** — total orders, avg RTO score, high-risk %, fraud flagged count

### ⏱️ ZenETA — ETA Prediction
- **XGBoost quantile regression** — p50 (median) / p90 / p99 confidence bands in a single call
- **Chronos-2 time-series** — zero-shot lane delay forecasting from historical transit times
- **Actor-Learner agent framework** — continuous improvement via feedback loop
- **Live weather enrichment** via Open-Meteo (free, no auth required)
- **SLA breach probability scoring** per shipment
- **MLflow experiment tracking** — model version comparison and metrics logging
- **Supabase feedback loop** — actual vs predicted ETA stored for periodic retraining

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.10+** (recommended: 3.11 via pyenv)
- **Node.js 18+** and **npm**
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/kanhaiya-98/CC-ETA-RTO-DEC.git
cd CC-ETA-RTO-DEC
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Open .env and fill in your keys (see section below)
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install Node dependencies
npm install
```

### 4. Run Both Servers

Open **two terminals** from the `zen-platform/` folder:

**Terminal 1 — Backend:**
```bash
cd backend
source venv/bin/activate
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

**Open your browser:** [http://localhost:3000](http://localhost:3000) 🎉

| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:3000 |
| ⚙️ Backend API | http://localhost:8000 |
| 📖 Swagger Docs | http://localhost:8000/docs |
| 💚 Health Check | http://localhost:8000/api/health |

---

## 🔑 Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

```env
# ── Supabase (for persistence — works without in demo mode) ──────
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key

# ── LLM (for AI insights — ZenDec, ZenRTO, ZenETA) ─────────────
GEMINI_API_KEY=your_api_key_here

# ── ZenETA — Model Config ────────────────────────────────────────
MODEL_DIR=models/eta
USE_CHRONOS=false              # Set true to enable Chronos-2 (~2 GB RAM)
CHRONOS_MODEL=amazon/chronos-bolt-small
MLFLOW_TRACKING_URI=mlruns

# ── ZenDec — AQI (Optional: uses city mock if not set) ──────────
OPENAQ_API_KEY=

# ── ZenRTO — WhatsApp COD Confirmation (Optional) ────────────────
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=+14155238886

# ── ZenDec — E-Way Bill (Optional production integration) ────────
EWAYBILL_USERNAME=
EWAYBILL_PASSWORD=
EWAYBILL_GSTIN=

# ── Server ───────────────────────────────────────────────────────
PORT=8000
```

> **Works fully without any API keys in demo/mock mode.** AQI, E-Way Bill, and WhatsApp all fall back to mock responses. Only `GEMINI_API_KEY` and `SUPABASE_*` enable full AI + persistence features.

---

## 📡 API Reference

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Platform status + model load state |

### ZenDec — Carrier Decision Engine
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/demand/run` | Full TOPSIS + stress-test + OOD + autonomy pipeline |
| `GET` | `/api/demand/pending` | List pending HITL approval cards |
| `GET` | `/api/demand/cards/{id}` | Get specific approval card |
| `POST` | `/api/demand/cards/{id}/resolve` | Resolve HITL card (APPROVE / MODIFY / REJECT) |
| `GET` | `/api/demand/policy` | Get current autonomy policy |
| `POST` | `/api/demand/policy` | Update autonomy policy |
| `GET` | `/api/demand/aqi/{city}` | Fetch live AQI for a city |
| `POST` | `/api/demand/ewaybill/generate` | Generate E-Way Bill |
| `GET` | `/api/demand/log/recent` | Recent decision log |

### ZenRTO — RTO Risk Scoring
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/routes/score` | Score an order for RTO risk |
| `GET` | `/api/routes/stats` | Aggregate dashboard stats |
| `GET` | `/api/routes/orders` | Paginated order list (with risk filter) |
| `GET` | `/api/routes/orders/{id}` | Get single order details |
| `PATCH` | `/api/routes/orders/{id}/action` | Update order action |

### ZenETA — ETA Prediction
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/eta/predict` | XGBoost p50/p90/p99 + weather enrichment |
| `POST` | `/api/eta/predict/chronos` | Chronos-2 zero-shot lane forecast |
| `POST` | `/api/eta/feedback` | Submit actual ETA for model retraining |
| `GET` | `/api/eta/stats` | Model performance metrics |

---

## 🛠️ Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| API Framework | FastAPI + Uvicorn (async) |
| ETA Prediction | XGBoost (quantile regression p50/p90/p99) |
| Lane Forecasting | Chronos-2 (`amazon/chronos-bolt-small`) |
| RTO Risk | LightGBM + SHAP explainability |
| Decision Engine | TOPSIS (multi-criteria optimization) |
| LLM / AI Insights | Fine-tuned model · Llama 3B |
| Database | Supabase (PostgreSQL) |
| Experiment Tracking | MLflow |
| Weather | Open-Meteo (free, no auth) |
| AQI | OpenAQ v3 API |
| WhatsApp | Twilio |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| Database Client | Supabase JS |

---

## 🔄 ZenDec Autonomous Decision Flow

```
Incident Input (carriers + blast_radius + confidence)
        │
        ▼
  Live AQI Fetch ──────────────► Carbon Calculation per carrier
        │
        ▼
  TOPSIS Ranking ──────────────► Top 3 Pareto-optimal options
        │
        ▼
  LLM Stress Test (3 scenarios: PEAK_DEMAND / WEATHER_DELAY / PRICE_SPIKE)
        │
        ▼
  OOD Detection ───────────────► Confidence Adjustment
        │
        ▼
  Autonomy Engine
        ├── Tier 1: AUTO_APPROVE ──► Direct execution, log to Supabase
        ├── Tier 2: PARETO_CARD  ──► HITL card created → operator reviews
        └── Tier 3: FULL_ESCALATE → Counterfactual explanation + escalation
```

---

## 🆘 Troubleshooting

**`ModuleNotFoundError` on backend start:**
```bash
pip install -r requirements.txt
```

**XGBoost model not found warning at startup:**
Non-fatal — ZenETA will return an error on prediction but ZenDec and ZenRTO work fine. Pre-trained models are included in `backend/models/eta/`.

**Frontend shows "Backend offline":**
Make sure the backend is running on port 8000. Check:
```bash
curl http://localhost:8000/api/health
```

**Supabase not configured:**
Platform runs in **demo mode** with in-memory storage. All features work — data just doesn't persist across backend restarts.

---

## 📄 License

MIT — free to use, modify, and distribute.
