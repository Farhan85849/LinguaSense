from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from app.core.config import settings
from app.core.database import create_tables
from app.api import auth, analysis

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="LinguaSense AI API",
    description="Smart Multilingual Language Detection for Roman Urdu & Code-Mixed Text",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(analysis.router, prefix="/api/v1")

@app.on_event("startup")
async def startup():
    logger.info("Starting LinguaSense AI...")
    try:
        create_tables()
        logger.info("Database tables created/verified.")
    except Exception as e:
        logger.error(f"DB init error: {e}")

@app.get("/")
def root():
    return {"message": "LinguaSense AI API", "version": "1.0.0", "status": "running"}

@app.get("/health")
def health():
    return {"status": "healthy"}
