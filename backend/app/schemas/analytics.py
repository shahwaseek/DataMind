from pydantic import BaseModel, Field
from typing import List, Dict, Any

class QueryRequest(BaseModel):
    sql_query: str = Field(..., min_length=1, description="SQL analytical query to execute")

class QueryResponse(BaseModel):
    columns: List[str]
    rows: List[Dict[str, Any]]
    total_rows: int
    returned_rows: int
    is_truncated: bool
    execution_time_ms: float
    sql_query: str
    validation_status: str
