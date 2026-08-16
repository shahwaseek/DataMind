import time
import re
from pathlib import Path
from typing import Dict, Any, List
import duckdb
import pandas as pd

from app.services.sql_validator import validate_sql_safety, SQLValidationError
from app.services.ingestion import IngestionError
from app.services.profiling import clean_json_value


class AnalyticsExecutionError(Exception):
    pass


def execute_dataset_query(file_path: Path, sql_query: str, max_rows: int = 1000) -> Dict[str, Any]:
    """
    Registers the dataset as temporary view 'dataset' in DuckDB,
    validates the SQL query for safety, and executes it.
    """
    if not file_path.exists():
        raise AnalyticsExecutionError("Dataset storage file not found on disk")

    # 1. Validate SQL Safety
    is_safe, clean_query = validate_sql_safety(sql_query)

    ext = file_path.suffix.lower()
    file_str = str(file_path).replace('\\', '/')

    # 2. Create isolated in-memory DuckDB connection
    conn = duckdb.connect(":memory:")
    try:
        if ext == ".csv":
            conn.execute(f"CREATE VIEW dataset AS SELECT * FROM read_csv_auto('{file_str}')")
        elif ext in [".xlsx", ".xls"]:
            # Load excel into DataFrame first, then register
            df_excel = pd.read_excel(file_path)
            conn.register("dataset", df_excel)
        elif ext == ".parquet":
            conn.execute(f"CREATE VIEW dataset AS SELECT * FROM read_parquet('{file_str}')")
        elif ext == ".json":
            conn.execute(f"CREATE VIEW dataset AS SELECT * FROM read_json_auto('{file_str}')")
        else:
            raise AnalyticsExecutionError(f"Unsupported file format for DuckDB querying: {ext}")

        # 3. Execute query with timing
        start_time = time.perf_counter()
        try:
            res_df = conn.execute(clean_query).df()
        except Exception as e:
            raise AnalyticsExecutionError(f"DuckDB SQL Execution Error: {str(e)}")
        end_time = time.perf_counter()

        execution_time_ms = round((end_time - start_time) * 1000, 2)
        total_rows_returned = len(res_df)

        # 4. Truncate if results exceed max_rows
        truncated = False
        if total_rows_returned > max_rows:
            res_df = res_df.head(max_rows)
            truncated = True

        # Clean NaN/Inf values
        res_df = res_df.fillna("")

        columns = [str(c) for c in res_df.columns]
        rows = res_df.to_dict(orient="records")

        # Clean JSON compatibility for all cell values
        cleaned_rows = []
        for r in rows:
            cleaned_row = {col: clean_json_value(r[col]) for col in columns}
            cleaned_rows.append(cleaned_row)

        return {
            "columns": columns,
            "rows": cleaned_rows,
            "total_rows": total_rows_returned,
            "returned_rows": len(cleaned_rows),
            "is_truncated": truncated,
            "execution_time_ms": execution_time_ms,
            "sql_query": clean_query,
            "validation_status": "PASSED"
        }
    finally:
        conn.close()
