from pathlib import Path
from fastapi import APIRouter, HTTPException, status

from app.db.sqlite import get_connection
from app.schemas.analytics import QueryRequest, QueryResponse
from app.services.analytics import execute_dataset_query, AnalyticsExecutionError
from app.services.sql_validator import SQLValidationError

router = APIRouter(tags=["Analytics"])


@router.post("/datasets/{dataset_id}/query", response_model=QueryResponse)
def query_dataset(dataset_id: str, request: QueryRequest):
    conn = get_connection()
    try:
        row = conn.execute("SELECT storage_path FROM datasets WHERE id = ?", (dataset_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Dataset not found")

        file_path = Path(row["storage_path"])
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Dataset storage file not found on disk")

        try:
            res_data = execute_dataset_query(file_path, request.sql_query)
            return QueryResponse(**res_data)
        except SQLValidationError as sve:
            raise HTTPException(status_code=400, detail=f"SQL Validation Error: {str(sve)}")
        except AnalyticsExecutionError as aee:
            raise HTTPException(status_code=400, detail=str(aee))
    finally:
        conn.close()
