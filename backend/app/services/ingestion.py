import hashlib
import os
import json
import re
from pathlib import Path
from typing import List, Dict, Any, Tuple
import pandas as pd
from app.core.config import settings

ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls", ".json", ".parquet"}
MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024  # 100 MB


class IngestionError(Exception):
    pass


class InvalidFileTypeError(IngestionError):
    pass


class FileTooLargeError(IngestionError):
    pass


class PathTraversalError(IngestionError):
    pass


class EmptyDatasetError(IngestionError):
    pass


class MalformedFileError(IngestionError):
    pass


def sanitize_filename(filename: str) -> str:
    """Removes path separators and dangerous characters from filenames."""
    filename = os.path.basename(filename)
    clean_name = re.sub(r'[^a-zA-Z0-9_.-]', '_', filename)
    if not clean_name:
        clean_name = "unnamed_file"
    return clean_name


def validate_safe_storage_path(base_dir: Path, filename: str) -> Path:
    """Verifies that the target file path stays strictly within base_dir."""
    safe_name = sanitize_filename(filename)
    target_path = (base_dir / safe_name).resolve()
    base_resolved = base_dir.resolve()

    if not str(target_path).startswith(str(base_resolved)):
        raise PathTraversalError(f"Path traversal detected for filename: {filename}")

    return target_path


def compute_sha256(file_path: Path) -> str:
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for byte_block in iter(lambda: f.read(65536), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()


def process_dataset_file(file_path: Path) -> Tuple[int, int, List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Parses dataset file and returns:
    (row_count, column_count, columns_schema_list, preview_rows)
    """
    ext = file_path.suffix.lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise InvalidFileTypeError(f"Unsupported file extension: {ext}. Allowed: {ALLOWED_EXTENSIONS}")

    file_size = file_path.stat().st_size
    if file_size == 0:
        raise EmptyDatasetError("Uploaded file is empty (0 bytes)")

    if file_size > MAX_FILE_SIZE_BYTES:
        raise FileTooLargeError(f"File size ({file_size} bytes) exceeds limit of {MAX_FILE_SIZE_BYTES} bytes")

    try:
        if ext == ".csv":
            df = pd.read_csv(file_path)
        elif ext in [".xlsx", ".xls"]:
            df = pd.read_excel(file_path)
        elif ext == ".parquet":
            df = pd.read_parquet(file_path)
        elif ext == ".json":
            df = pd.read_json(file_path)
        else:
            raise InvalidFileTypeError(f"Unsupported file extension: {ext}")
    except IngestionError:
        raise
    except Exception as e:
        raise MalformedFileError(f"Failed to parse dataset file: {str(e)}")

    if df.empty:
        raise EmptyDatasetError("Dataset contains 0 data rows")

    row_count = len(df)
    column_count = len(df.columns)

    # Build column schemas
    columns_schema = []
    for col in df.columns:
        col_str = str(col)
        dtype_str = str(df[col].dtype)
        # Sample non-null values
        samples = df[col].dropna().head(3).tolist()
        # Convert samples to JSON-serializable types
        clean_samples = []
        for s in samples:
            if hasattr(s, 'item'):
                clean_samples.append(s.item())
            elif pd.isna(s):
                continue
            else:
                clean_samples.append(str(s))

        columns_schema.append({
            "name": col_str,
            "data_type": dtype_str,
            "sample_values": clean_samples
        })

    # Prepare preview rows (first 20 rows max)
    preview_df = df.head(20).fillna("")
    preview_rows = preview_df.to_dict(orient="records")

    return row_count, column_count, columns_schema, preview_rows
