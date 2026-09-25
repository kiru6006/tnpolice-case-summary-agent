"""Health and Readiness Endpoints."""
from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "vetri-backend",
        "version": settings.app_version,
        "environment": settings.app_env
    }
