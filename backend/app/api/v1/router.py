from fastapi import APIRouter
from app.api.v1.projects import router as projects_router
from app.api.v1.datasets import router as datasets_router
from app.api.v1.analytics import router as analytics_router
from app.api.v1.analysis import router as analysis_router
from app.api.v1.visualization import router as visualization_router
from app.api.v1.reports import router as reports_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(projects_router)
api_v1_router.include_router(datasets_router)
api_v1_router.include_router(analytics_router)
api_v1_router.include_router(analysis_router)
api_v1_router.include_router(visualization_router)
api_v1_router.include_router(reports_router)
