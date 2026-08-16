import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from typing import List

from app.db.sqlite import get_connection
from app.schemas.project import ProjectCreate, ProjectResponse

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(project_in: ProjectCreate):
    conn = get_connection()
    try:
        project_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()
        
        with conn:
            conn.execute(
                "INSERT INTO projects (id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
                (project_id, project_in.name, project_in.description, now, now)
            )
        
        return ProjectResponse(
            id=project_id,
            name=project_in.name,
            description=project_in.description,
            created_at=now,
            updated_at=now,
            dataset_count=0
        )
    finally:
        conn.close()


@router.get("", response_model=List[ProjectResponse])
def list_projects():
    conn = get_connection()
    try:
        rows = conn.execute("""
            SELECT p.id, p.name, p.description, p.created_at, p.updated_at,
                   COUNT(d.id) AS dataset_count
            FROM projects p
            LEFT JOIN datasets d ON p.id = d.project_id
            GROUP BY p.id
            ORDER BY p.created_at DESC
        """).fetchall()

        return [
            ProjectResponse(
                id=row["id"],
                name=row["name"],
                description=row["description"],
                created_at=row["created_at"],
                updated_at=row["updated_at"],
                dataset_count=row["dataset_count"]
            ) for row in rows
        ]
    finally:
        conn.close()


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: str):
    conn = get_connection()
    try:
        row = conn.execute("""
            SELECT p.id, p.name, p.description, p.created_at, p.updated_at,
                   COUNT(d.id) AS dataset_count
            FROM projects p
            LEFT JOIN datasets d ON p.id = d.project_id
            WHERE p.id = ?
            GROUP BY p.id
        """, (project_id,)).fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Project not found")

        return ProjectResponse(
            id=row["id"],
            name=row["name"],
            description=row["description"],
            created_at=row["created_at"],
            updated_at=row["updated_at"],
            dataset_count=row["dataset_count"]
        )
    finally:
        conn.close()


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: str):
    conn = get_connection()
    try:
        row = conn.execute("SELECT id FROM projects WHERE id = ?", (project_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Project not found")

        with conn:
            conn.execute("DELETE FROM projects WHERE id = ?", (project_id,))
    finally:
        conn.close()
