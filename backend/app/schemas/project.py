from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Name of the project")
    description: str | None = Field(None, max_length=500, description="Optional description")

class ProjectResponse(BaseModel):
    id: str
    name: str
    description: str | None = None
    created_at: str
    updated_at: str
    dataset_count: int = 0

    model_config = ConfigDict(from_attributes=True)
