import uuid
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import List
from fastapi import APIRouter, HTTPException, status

from app.db.sqlite import get_connection
from app.schemas.analysis import AnalysisCreate, AnalysisResponse
from app.services.ingestion import process_dataset_file
from app.services.ollama import generate_nl_plan
from app.services.analytics import execute_dataset_query, AnalyticsExecutionError
from app.services.sql_validator import SQLValidationError

router = APIRouter(tags=["Analysis"])


@router.post(
    "/projects/{project_id}/datasets/{dataset_id}/analysis",
    response_model=AnalysisResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_analysis(project_id: str, dataset_id: str, request: AnalysisCreate):
    conn = get_connection()
    try:
        # 1. Fetch dataset storage path
        ds_row = conn.execute(
            "SELECT storage_path FROM datasets WHERE id = ? AND project_id = ?",
            (dataset_id, project_id)
        ).fetchone()

        if not ds_row:
            raise HTTPException(status_code=404, detail="Dataset or project not found")

        file_path = Path(ds_row["storage_path"])
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Dataset storage file not found on disk")

        # 2. Extract dataset schema
        _, _, columns_schema, _ = process_dataset_file(file_path)

        # 3. Generate AI Plan (Ollama / Heuristic fallback)
        plan = await generate_nl_plan(request.question, columns_schema)

        intent = plan.get("intent", "summary")
        explanation = plan.get("explanation", "Executed analysis plan")
        proposed_sql = plan.get("generated_sql", "SELECT * FROM dataset LIMIT 10")
        model_id = plan.get("model_identifier", "datamind-ai-planner")

        # 4. Execute validated SQL query against DuckDB
        try:
            exec_result = execute_dataset_query(file_path, proposed_sql)
            validation_status = "PASSED"
        except (SQLValidationError, AnalyticsExecutionError) as err:
            validation_status = f"REJECTED: {str(err)}"
            exec_result = {
                "columns": [],
                "rows": [],
                "total_rows": 0,
                "returned_rows": 0,
                "is_truncated": False,
                "execution_time_ms": 0.0,
                "sql_query": proposed_sql,
                "validation_status": validation_status
            }

        analysis_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        exec_json_str = json.dumps(exec_result)

        # 5. Record analysis evidence in SQLite
        with conn:
            conn.execute(
                """
                INSERT INTO analyses (
                    id, project_id, dataset_id, question, intent, explanation,
                    generated_sql, execution_result_json, validation_status,
                    model_identifier, execution_time_ms, created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    analysis_id, project_id, dataset_id, request.question, intent,
                    explanation, proposed_sql, exec_json_str, validation_status,
                    model_id, exec_result.get("execution_time_ms", 0.0), now
                )
            )

        return AnalysisResponse(
            id=analysis_id,
            project_id=project_id,
            dataset_id=dataset_id,
            question=request.question,
            intent=intent,
            explanation=explanation,
            generated_sql=proposed_sql,
            execution_result=exec_result,
            validation_status=validation_status,
            model_identifier=model_id,
            execution_time_ms=exec_result.get("execution_time_ms", 0.0),
            created_at=now
        )
    finally:
        conn.close()


@router.get("/projects/{project_id}/analysis", response_model=List[AnalysisResponse])
def list_project_analyses(project_id: str):
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM analyses WHERE project_id = ? ORDER BY created_at DESC",
            (project_id,)
        ).fetchall()

        return [
            AnalysisResponse(
                id=r["id"],
                project_id=r["project_id"],
                dataset_id=r["dataset_id"],
                question=r["question"],
                intent=r["intent"],
                explanation=r["explanation"],
                generated_sql=r["generated_sql"],
                execution_result=json.loads(r["execution_result_json"]),
                validation_status=r["validation_status"],
                model_identifier=r["model_identifier"],
                execution_time_ms=r["execution_time_ms"],
                created_at=r["created_at"]
            )
            for r in rows
        ]
    finally:
        conn.close()


@router.get("/analysis/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(analysis_id: str):
    conn = get_connection()
    try:
        r = conn.execute("SELECT * FROM analyses WHERE id = ?", (analysis_id,)).fetchone()
        if not r:
            raise HTTPException(status_code=404, detail="Analysis not found")

        return AnalysisResponse(
            id=r["id"],
            project_id=r["project_id"],
            dataset_id=r["dataset_id"],
            question=r["question"],
            intent=r["intent"],
            explanation=r["explanation"],
            generated_sql=r["generated_sql"],
            execution_result=json.loads(r["execution_result_json"]),
            validation_status=r["validation_status"],
            model_identifier=r["model_identifier"],
            execution_time_ms=r["execution_time_ms"],
            created_at=r["created_at"]
        )
    finally:
        conn.close()


@router.post("/analysis/{analysis_id}/rerun", response_model=AnalysisResponse)
def rerun_analysis(analysis_id: str):
    conn = get_connection()
    try:
        r = conn.execute("SELECT * FROM analyses WHERE id = ?", (analysis_id,)).fetchone()
        if not r:
            raise HTTPException(status_code=404, detail="Analysis not found")

        ds_row = conn.execute("SELECT storage_path FROM datasets WHERE id = ?", (r["dataset_id"],)).fetchone()
        if not ds_row:
            raise HTTPException(status_code=404, detail="Dataset not found")

        file_path = Path(ds_row["storage_path"])
        
        # Re-execute query against dataset for reproducibility
        exec_result = execute_dataset_query(file_path, r["generated_sql"])
        now = datetime.now(timezone.utc).isoformat()

        return AnalysisResponse(
            id=r["id"],
            project_id=r["project_id"],
            dataset_id=r["dataset_id"],
            question=r["question"],
            intent=r["intent"],
            explanation=f"[Reproduced Run] {r['explanation']}",
            generated_sql=r["generated_sql"],
            execution_result=exec_result,
            validation_status="PASSED",
            model_identifier=r["model_identifier"],
            execution_time_ms=exec_result["execution_time_ms"],
            created_at=now
        )
    finally:
        conn.close()
