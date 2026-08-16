---
name: backend-architecture
description: Enterprise guidelines for building robust FastAPI backend applications with Pydantic v2, async concurrency, DuckDB/SQLite data pipelines, modular service layers, and security controls.
---

# Backend & API Architecture Skill

This skill outlines design patterns, architectural standards, and implementation practices for production-ready Python backends built with FastAPI.

---

## 🏗️ 1. Project Organization & Modular Structure

Organize backend codebase into clean, decoupled layers:

```
app/
├── api/              # Route handlers / controllers
│   ├── v1/
│   │   ├── projects.py
│   │   ├── datasets.py
│   │   └── analysis.py
│   └── router.py
├── core/             # Configuration, security, constants
│   ├── config.py
│   └── security.py
├── db/               # Connection management & migrations
│   ├── sqlite.py
│   └── duckdb_engine.py
├── models/           # Domain & DB models
├── schemas/          # Pydantic validation schemas
├── services/         # Core business logic & execution engines
└── tests/            # Pytest suite
```

---

## 🔒 2. Data Validation & Pydantic v2

- Use **Pydantic v2** (`BaseModel`, `Field`, `ConfigDict`) for all request inputs and response outputs.
- Never pass raw dictionaries across layer boundaries.

```python
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Project name")
    description: str | None = Field(None, max_length=500)

class ProjectResponse(ProjectCreate):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
```

---

## ⚡ 3. API Error Handling & Async Patterns

- Use custom exception classes and global FastAPI exception handlers.
- Return structured error response payloads with descriptive error codes.
- Use `async def` for I/O-bound endpoints and run heavy blocking analytical execution (e.g. Pandas/DuckDB computation) in process pools or background threads using `fastapi.concurrency.run_in_threadpool`.

---

## 🛡️ 4. Security & Path Boundary Validation

- **Path Traversal Protection**: Validate resolved file paths to ensure they stay inside allowed root directories (`DATA_DIR`).
- **SQL Sanitization**: Enforce read-only SQL parser validation, reject DDL/DML statements (`CREATE`, `DROP`, `INSERT`, `UPDATE`, `DELETE`, `ALTER`), and disallow dangerous DuckDB extensions or external file functions.
- **Resource Timeouts**: Wrap queries in execution timeout handlers.
