import uuid
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import List
from fastapi import APIRouter, UploadFile, File, HTTPException, status

from app.core.config import settings
from app.db.sqlite import get_connection
from app.schemas.dataset import (
    DatasetResponse,
    DatasetVersionResponse,
    DatasetPreviewResponse,
    ColumnSchema
)
from app.services.ingestion import (
    process_dataset_file,
    compute_sha256,
    sanitize_filename,
    validate_safe_storage_path,
    IngestionError,
    InvalidFileTypeError,
    FileTooLargeError,
    PathTraversalError,
    EmptyDatasetError,
    MalformedFileError
)

router = APIRouter(tags=["Datasets"])


@router.post("/projects/{project_id}/datasets/upload", response_model=DatasetResponse, status_code=status.HTTP_201_CREATED)
async def upload_dataset(project_id: str, file: UploadFile = File(...)):
    conn = get_connection()
    try:
        # Check project exists
        project = conn.execute("SELECT id FROM projects WHERE id = ?", (project_id,)).fetchone()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        if not file.filename:
            raise HTTPException(status_code=400, detail="Uploaded file missing filename")

        # Create project specific upload storage directory
        project_upload_dir = Path(settings.UPLOADS_DIR) / project_id
        project_upload_dir.mkdir(parents=True, exist_ok=True)

        try:
            target_path = validate_safe_storage_path(project_upload_dir, file.filename)
        except PathTraversalError as e:
            raise HTTPException(status_code=400, detail=str(e))

        # Write uploaded file to disk
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty (0 bytes)")

        with open(target_path, "wb") as f:
            f.write(contents)

        # Process and validate file content
        try:
            row_count, col_count, columns_schema, preview_rows = process_dataset_file(target_path)
        except IngestionError as ie:
            # Clean up temp file on validation failure
            if target_path.exists():
                target_path.unlink()
            raise HTTPException(status_code=400, detail=str(ie))

        file_size = target_path.stat().st_size
        sha256 = compute_sha256(target_path)
        ext = target_path.suffix.lower()

        now = datetime.now(timezone.utc).isoformat()
        dataset_id = str(uuid.uuid4())
        version_id = str(uuid.uuid4())

        columns_json_str = json.dumps(columns_schema)

        clean_filename = sanitize_filename(file.filename)

        with conn:
            # Create dataset metadata record
            conn.execute(
                """
                INSERT INTO datasets (id, project_id, name, file_type, original_filename, storage_path, file_size_bytes, mime_type, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (dataset_id, project_id, clean_filename, ext.lstrip("."), clean_filename, str(target_path), file_size, file.content_type, now)
            )

            # Create initial version 1 record
            conn.execute(
                """
                INSERT INTO dataset_versions (id, dataset_id, version_number, storage_path, row_count, column_count, file_size_bytes, sha256_hash, columns_json, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (version_id, dataset_id, 1, str(target_path), row_count, col_count, file_size, sha256, columns_json_str, now)
            )

            # Update project timestamp
            conn.execute("UPDATE projects SET updated_at = ? WHERE id = ?", (now, project_id))

        version_resp = DatasetVersionResponse(
            id=version_id,
            dataset_id=dataset_id,
            version_number=1,
            storage_path=str(target_path),
            row_count=row_count,
            column_count=col_count,
            file_size_bytes=file_size,
            sha256_hash=sha256,
            columns=[ColumnSchema(**c) for c in columns_schema],
            created_at=now
        )

        return DatasetResponse(
            id=dataset_id,
            project_id=project_id,
            name=clean_filename,
            file_type=ext.lstrip("."),
            original_filename=clean_filename,
            storage_path=str(target_path),
            file_size_bytes=file_size,
            mime_type=file.content_type,
            created_at=now,
            latest_version=version_resp
        )
    finally:
        conn.close()


@router.get("/projects/{project_id}/datasets", response_model=List[DatasetResponse])
def list_project_datasets(project_id: str):
    conn = get_connection()
    try:
        rows = conn.execute(
            "SELECT * FROM datasets WHERE project_id = ? ORDER BY created_at DESC",
            (project_id,)
        ).fetchall()

        datasets = []
        for row in rows:
            v_row = conn.execute(
                "SELECT * FROM dataset_versions WHERE dataset_id = ? ORDER BY version_number DESC LIMIT 1",
                (row["id"],)
            ).fetchone()

            latest_v = None
            if v_row:
                cols = json.loads(v_row["columns_json"])
                latest_v = DatasetVersionResponse(
                    id=v_row["id"],
                    dataset_id=v_row["dataset_id"],
                    version_number=v_row["version_number"],
                    storage_path=v_row["storage_path"],
                    row_count=v_row["row_count"],
                    column_count=v_row["column_count"],
                    file_size_bytes=v_row["file_size_bytes"],
                    sha256_hash=v_row["sha256_hash"],
                    columns=[ColumnSchema(**c) for c in cols],
                    created_at=v_row["created_at"]
                )

            datasets.append(DatasetResponse(
                id=row["id"],
                project_id=row["project_id"],
                name=row["name"],
                file_type=row["file_type"],
                original_filename=row["original_filename"],
                storage_path=row["storage_path"],
                file_size_bytes=row["file_size_bytes"],
                mime_type=row["mime_type"],
                created_at=row["created_at"],
                latest_version=latest_v
            ))

        return datasets
    finally:
        conn.close()


@router.get("/datasets/{dataset_id}", response_model=DatasetResponse)
def get_dataset(dataset_id: str):
    conn = get_connection()
    try:
        row = conn.execute("SELECT * FROM datasets WHERE id = ?", (dataset_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Dataset not found")

        v_row = conn.execute(
            "SELECT * FROM dataset_versions WHERE dataset_id = ? ORDER BY version_number DESC LIMIT 1",
            (dataset_id,)
        ).fetchone()

        latest_v = None
        if v_row:
            cols = json.loads(v_row["columns_json"])
            latest_v = DatasetVersionResponse(
                id=v_row["id"],
                dataset_id=v_row["dataset_id"],
                version_number=v_row["version_number"],
                storage_path=v_row["storage_path"],
                row_count=v_row["row_count"],
                column_count=v_row["column_count"],
                file_size_bytes=v_row["file_size_bytes"],
                sha256_hash=v_row["sha256_hash"],
                columns=[ColumnSchema(**c) for c in cols],
                created_at=v_row["created_at"]
            )

        return DatasetResponse(
            id=row["id"],
            project_id=row["project_id"],
            name=row["name"],
            file_type=row["file_type"],
            original_filename=row["original_filename"],
            storage_path=row["storage_path"],
            file_size_bytes=row["file_size_bytes"],
            mime_type=row["mime_type"],
            created_at=row["created_at"],
            latest_version=latest_v
        )
    finally:
        conn.close()


@router.get("/datasets/{dataset_id}/preview", response_model=DatasetPreviewResponse)
def get_dataset_preview(dataset_id: str):
    conn = get_connection()
    try:
        row = conn.execute("SELECT storage_path FROM datasets WHERE id = ?", (dataset_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Dataset not found")

        file_path = Path(row["storage_path"])
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Dataset storage file not found on disk")

        row_count, col_count, columns_schema, preview_rows = process_dataset_file(file_path)

        return DatasetPreviewResponse(
            dataset_id=dataset_id,
            columns=[ColumnSchema(**c) for c in columns_schema],
            row_count=row_count,
            preview_rows=preview_rows
        )
    finally:
        conn.close()


@router.get("/datasets/{dataset_id}/profile")
def get_dataset_profile(dataset_id: str):
    from app.services.profiling import profile_dataset_file, IngestionError
    conn = get_connection()
    try:
        row = conn.execute("SELECT storage_path FROM datasets WHERE id = ?", (dataset_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Dataset not found")

        file_path = Path(row["storage_path"])
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="Dataset storage file not found on disk")

        try:
            profile_data = profile_dataset_file(file_path)
            profile_data["dataset_id"] = dataset_id
            return profile_data
        except IngestionError as ie:
            raise HTTPException(status_code=400, detail=str(ie))
    finally:
        conn.close()
