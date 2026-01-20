"""
AADHAAR-PRERANA Backend Server
============================
Proactive Response & Engagement Analysis Network

Main entry point for the FastAPI backend server.
Serves the core engines: GENESIS, MOBILITY, INTEGRITY

Author: Team FREAKS
Date: January 2026
"""

import os
import sys
import asyncio
from contextlib import asynccontextmanager
from datetime import datetime

import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from api.routes import router as api_router
from config.settings import settings
from utils.logger import get_logger
from engines.genesis_engine import GenesisEngine
from engines.mobility_engine import MobilityEngine
from engines.integrity_engine import IntegrityEngine

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Initializes ML engines on startup and cleanly shuts down on exit.
    """
    logger.info("=" * 60)
    logger.info("AADHAAR-PRERANA Backend Starting...")
    logger.info("=" * 60)

    # Initialize engines
    logger.info("Initializing GENESIS Engine (Child Inclusion Tracker)...")
    app.state.genesis_engine = GenesisEngine()
    await app.state.genesis_engine.initialize()

    logger.info("Initializing MOBILITY Engine (Urban Stress Predictor)...")
    app.state.mobility_engine = MobilityEngine()
    await app.state.mobility_engine.initialize()

    logger.info("Initializing INTEGRITY Engine (Fraud Detection Shield)...")
    app.state.integrity_engine = IntegrityEngine()
    await app.state.integrity_engine.initialize()

    logger.info("All engines initialized successfully!")
    logger.info(f"Server ready at http://{settings.HOST}:{settings.PORT}")
    logger.info("=" * 60)

    yield  # Application runs

    # Cleanup
    logger.info("Shutting down engines...")
    await app.state.genesis_engine.shutdown()
    await app.state.mobility_engine.shutdown()
    await app.state.integrity_engine.shutdown()
    logger.info("AADHAAR-PRERANA Backend shutdown complete.")


# Initialize FastAPI application
app = FastAPI(
    title="AADHAAR-PRERANA API",
    description="""
    ## Proactive Response & Engagement Analysis Network

    A data-driven policy intelligence engine for UIDAI.

    ### Core Engines:
    - **GENESIS**: Child Inclusion Gap Tracker
    - **MOBILITY**: Urban Migration Stress Predictor
    - **INTEGRITY**: Fraud Pattern Detection Shield

    ### Developed by Team FREAKS for UIDAI Hackathon 2026
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Add X-Process-Time header to all responses."""
    start_time = datetime.now()
    response = await call_next(request)
    process_time = (datetime.now() - start_time).total_seconds() * 1000
    response.headers["X-Process-Time"] = f"{process_time:.2f}ms"
    return response


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions."""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": str(exc) if settings.DEBUG else "An unexpected error occurred",
            "timestamp": datetime.now().isoformat()
        }
    )


# Include API routes
app.include_router(api_router, prefix="/api/v1")


# Health check endpoint
@app.get("/health", tags=["System"])
async def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "service": "aadhaar-prerana",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "engines": {
            "genesis": "operational",
            "mobility": "operational",
            "integrity": "operational"
        }
    }


# Root endpoint
@app.get("/", tags=["System"])
async def root():
    """Root endpoint with API information."""
    return {
        "service": "AADHAAR-PRERANA",
        "tagline": "From Passive Identity to Proactive Governance",
        "version": "1.0.0",
        "team": "FREAKS",
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        workers=settings.WORKERS if not settings.DEBUG else 1,
        log_level="info"
    )
