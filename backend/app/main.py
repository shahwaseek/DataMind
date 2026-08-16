from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.db.sqlite import init_db
from app.api.v1.router import api_v1_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite database tables on startup
    init_db()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="DataMind — Local-First AI Data Analyst API",
    version="0.1.0",
    debug=settings.DEBUG,
    lifespan=lifespan,
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router)


@app.get("/")
def root():
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "version": "0.1.0"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "datamind-backend",
        "environment": settings.APP_ENV
    }
