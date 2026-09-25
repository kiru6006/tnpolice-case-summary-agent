"""FastAPI Main Application Entrypoint."""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import structlog

from app.core.config import settings
from app.core.logging import configure_logging
from app.api import health, cases

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    logger.info("vetri.backend.starting", version=settings.app_version, env=settings.app_env)
    yield
    logger.info("vetri.backend.stopping")


app = FastAPI(
    title="Vetri (வெற்றி) — Police Cases Report Agent API",
    version=settings.app_version,
    description="Agentic AI for Tamil Nadu Police Report Analysis & Judicial Scrutiny",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1")
app.include_router(cases.router, prefix="/api/v1/cases", tags=["cases"])


@app.get("/")
async def root():
    return {
        "service": "vetri-backend",
        "tagline": "AI Agent for Tamil Nadu Police Report Analysis & Judicial Scrutiny",
        "status": "operational",
        "version": settings.app_version
    }
