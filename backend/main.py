"""
Zen Platform API — Unified FastAPI Entry Point
Modules: ZenDec (demand), ZenRTO (routes), ZenETA (eta)
"""
import os
import sys
import logging
from contextlib import asynccontextmanager

from dotenv import load_dotenv
load_dotenv()

# Ensure backend dir is importable
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import demand, routes, eta

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)

app_state: dict = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: pre-load XGBoost ETA model. Other models load on first call."""
    logger.info("═" * 60)
    logger.info("  Zen Platform — Starting Up")
    logger.info("═" * 60)

    # ── ZenETA: Pre-load XGBoost ─────────────────────────────────
    try:
        from models.eta.xgboost_service import XGBoostETAService
        xgboost_svc = XGBoostETAService(model_dir=os.getenv("MODEL_DIR", "models/eta"))
        xgboost_svc.load_models()
        app_state["xgboost"] = xgboost_svc
        logger.info("✅ XGBoost ETA model loaded")
    except Exception as e:
        logger.warning(f"⚠️  XGBoost load failed ({e}). Train model first.")
        app_state["xgboost"] = None

    # ── ZenETA: Supabase ─────────────────────────────────────────
    try:
        from services.eta_supabase_service import SupabaseService
        supabase_svc = SupabaseService(
            url=os.getenv("SUPABASE_URL", ""),
            key=os.getenv("SUPABASE_SERVICE_KEY", "") or os.getenv("SUPABASE_SERVICE_ROLE_KEY", ""),
        )
        app_state["supabase"] = supabase_svc
        logger.info("✅ Supabase connected")
    except Exception as e:
        logger.warning(f"⚠️  Supabase connection failed: {e}")
        app_state["supabase"] = None

    # ── ZenETA: Agents ───────────────────────────────────────────
    try:
        from agents.actor_agent import ActorAgent
        from agents.learner_agent import LearnerAgent
        from utils.mlflow_tracker import MLflowTracker

        mlflow_tracker = MLflowTracker(tracking_uri=os.getenv("MLFLOW_TRACKING_URI", "mlruns"))
        app_state["mlflow"] = mlflow_tracker

        if app_state.get("xgboost") and app_state.get("supabase"):
            learner = LearnerAgent(app_state["supabase"], app_state["xgboost"], mlflow_tracker)
            actor = ActorAgent(app_state["xgboost"], app_state["supabase"])
            app_state["learner"] = learner
            app_state["actor"] = actor
            logger.info("✅ Actor + Learner agents ready")
    except Exception as e:
        logger.warning(f"⚠️  Agents init failed: {e}")

    # ── ZenETA: Chronos (optional) ───────────────────────────────
    app_state["chronos"] = None
    if os.getenv("USE_CHRONOS", "false").lower() == "true":
        try:
            from models.eta.chronos_service import ChronosETAService
            chronos_svc = ChronosETAService(model_name=os.getenv("CHRONOS_MODEL", "amazon/chronos-bolt-small"))
            chronos_svc.load_model()
            app_state["chronos"] = chronos_svc
            logger.info("✅ Chronos-2 model loaded")
        except Exception as e:
            logger.warning(f"⚠️  Chronos-2 not loaded: {e}")

    logger.info("═" * 60)
    logger.info("  ✓ Zen Platform ready | docs → http://localhost:8000/docs")
    logger.info("═" * 60)
    yield
    logger.info("Shutting down Zen Platform...")


app = FastAPI(
    title="Zen Platform API",
    description="Unified AI Logistics Platform — ZenDec (Decision Engine) + ZenRTO (RTO Risk) + ZenETA (ETA Prediction)",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(demand.router, prefix="/api/demand", tags=["ZenDec — Decision Engine"])
app.include_router(routes.router, prefix="/api/routes", tags=["ZenRTO — RTO Risk Scoring"])
app.include_router(eta.router, prefix="/api/eta", tags=["ZenETA — ETA Prediction"])


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "platform": "Zen Platform",
        "modules": ["zendec", "zenrto", "zeneta"],
        "xgboost_loaded": app_state.get("xgboost") is not None,
        "chronos_loaded": app_state.get("chronos") is not None,
    }


@app.get("/")
def root():
    return {"platform": "Zen Platform", "docs": "/docs", "health": "/api/health"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
