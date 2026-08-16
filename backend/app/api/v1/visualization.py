from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

from app.db.sqlite import get_connection
from app.services.analytics import execute_dataset_query
from app.services.visualization import recommend_chart_spec

router = APIRouter(tags=["Visualization"])


class ChartRequest(BaseModel):
    sql_query: Optional[str] = "SELECT * FROM dataset LIMIT 15"
    intent: Optional[str] = "aggregation"


@router.post("/datasets/{dataset_id}/chart")
def generate_chart(dataset_id: str, request: ChartRequest):
    conn = get_connection()
    try:
        row = conn.execute("SELECT storage_path FROM datasets WHERE id = ?", (dataset_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Dataset not found")

        file_path = Path(row["storage_path"])
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Dataset storage file not found on disk")

        # Execute query to get data payload
        exec_res = execute_dataset_query(file_path, request.sql_query or "SELECT * FROM dataset LIMIT 15")
        
        # Build chart specification
        chart_spec = recommend_chart_spec(
            columns=exec_res["columns"],
            rows=exec_res["rows"],
            intent=request.intent
        )

        return {
            "dataset_id": dataset_id,
            "chart_spec": chart_spec,
            "execution_metadata": {
                "total_rows": exec_res["total_rows"],
                "execution_time_ms": exec_res["execution_time_ms"]
            }
        }
    finally:
        conn.close()
