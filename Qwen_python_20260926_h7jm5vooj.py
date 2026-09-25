"""NyayaSetu Backend — FastAPI entry point."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import structlog

from app.api import cases, health
from app.core.config import settings
from app.core.logging import configure_logging

logger = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown lifecycle."""
    configure_logging()
    logger.info("nyayasetu.starting", version=settings.app_version)
    # TODO: init DB connections, vector DB, MCP server
    yield
    logger.info("nyayasetu.stopping")


app = FastAPI(
    title="NyayaSetu API",
    version=settings.app_version,
    description="AI Agent for Tamil Nadu Police Report Analysis",
    lifespan=lifespan,
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
    return {"service": "nyayasetu", "status": "operational"}