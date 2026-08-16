from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Any

class ColumnSchema(BaseModel):
    name: str
    data_type: str
    sample_values: List[Any] = []

class DatasetVersionResponse(BaseModel):
    id: str
    dataset_id: str
    version_number: int
    storage_path: str
    row_count: int
    column_count: int
    file_size_bytes: int
    sha256_hash: str
    columns: List[ColumnSchema]
    created_at: str

class DatasetResponse(BaseModel):
    id: str
    project_id: str
    name: str
    file_type: str
    original_filename: str
    storage_path: str
    file_size_bytes: int
    mime_type: str | None = None
    created_at: str
    latest_version: DatasetVersionResponse | None = None

    model_config = ConfigDict(from_attributes=True)

class DatasetPreviewResponse(BaseModel):
    dataset_id: str
    columns: List[ColumnSchema]
    row_count: int
    preview_rows: List[Dict[str, Any]]
