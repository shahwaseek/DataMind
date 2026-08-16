from pydantic import BaseModel, Field
from typing import List, Dict, Any

class AnalysisCreate(BaseModel):
    question: str = Field(..., min_length=1, description="Natural language question to analyze")

class AnalysisResponse(BaseModel):
    id: str
    project_id: str
    dataset_id: str
    question: str
    intent: str
    explanation: str
    generated_sql: str
    execution_result: Dict[str, Any]
    validation_status: str
    model_identifier: str
    execution_time_ms: float
    created_at: str
