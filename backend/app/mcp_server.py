import json
from pathlib import Path
from typing import Dict, Any
from app.services.ingestion import process_dataset_file
from app.services.profiling import profile_dataset_file
from app.services.analytics import execute_dataset_query
from app.services.visualization import recommend_chart_spec


def mcp_get_schema(file_path_str: str) -> Dict[str, Any]:
    file_path = Path(file_path_str)
    _, _, columns_schema, _ = process_dataset_file(file_path)
    return {"status": "success", "columns": columns_schema}


def mcp_profile_dataset(file_path_str: str) -> Dict[str, Any]:
    file_path = Path(file_path_str)
    return profile_dataset_file(file_path)


def mcp_execute_sql(file_path_str: str, sql_query: str) -> Dict[str, Any]:
    file_path = Path(file_path_str)
    return execute_dataset_query(file_path, sql_query)


def mcp_create_chart(file_path_str: str, sql_query: str, intent: str = "aggregation") -> Dict[str, Any]:
    file_path = Path(file_path_str)
    res = execute_dataset_query(file_path, sql_query)
    spec = recommend_chart_spec(res["columns"], res["rows"], intent=intent)
    return {"status": "success", "chart_spec": spec}
