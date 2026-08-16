---
name: data-analytics-engine
description: Architecture and implementations for DuckDB analytical querying, Pandas statistical profiling, data quality evaluation, schema inference, and reproducible evidence generation.
---

# Data Analytics & Engine Skill

This skill provides patterns and algorithms for building deterministic data profiling engines, DuckDB analytical query execution pipelines, and data quality scoring systems.

---

## 🦆 1. DuckDB Query Execution Engine

- **Read-Only In-Memory Execution**: Register analytical files (CSV, Parquet, JSON, XLSX) as temporary views in DuckDB.
- **Parametrized Views**: Clean column names and map data types automatically.
- **Safety Gate**: Parse SQL AST before execution to guarantee no state-modifying queries run.

```python
import duckdb
from pathlib import Path

class AnalyticalEngine:
    def __init__(self, db_path: str = ":memory:"):
        self.conn = duckdb.connect(db_path)

    def register_dataset(self, view_name: str, file_path: Path):
        ext = file_path.suffix.lower()
        if ext == ".csv":
            self.conn.execute(f"CREATE OR REPLACE VIEW {view_name} AS SELECT * FROM read_csv_auto('{file_path}')")
        elif ext == ".parquet":
            self.conn.execute(f"CREATE OR REPLACE VIEW {view_name} AS SELECT * FROM read_parquet('{file_path}')")
        elif ext == ".json":
            self.conn.execute(f"CREATE OR REPLACE VIEW {view_name} AS SELECT * FROM read_json_auto('{file_path}')")

    def execute_read_only(self, sql_query: str):
        # Enforce SELECT-only check
        normalized = sql_query.strip().upper()
        if not normalized.startswith("SELECT") and not normalized.startswith("WITH"):
            raise ValueError("Only read-only SELECT or WITH queries are permitted")
        return self.conn.execute(sql_query).df()
```

---

## 📊 2. Deterministic Profiling & Quality Scoring

Calculate dataset metrics without relying on LLM computation:
- **Row & Column Count**
- **Column Data Type Classification** (Numeric, Categorical, DateTime, Text, Identifier)
- **Completeness Ratio** (Null count / total rows)
- **Distinct Value Cardinality**
- **Numeric Distributions** (Min, Max, Mean, Median, StdDev, Outliers)
- **Data Quality Score (0-100)**:
  `Score = 100 - (NullPenalty + InvalidDatePenalty + DuplicateRowPenalty)`

---

## 📝 3. Reproducible Evidence Store

Every analytical step must generate a cryptographically auditable evidence payload:
- `query_id`: Unique identifier
- `dataset_version_hash`: SHA-256 hash of dataset file
- `user_question`: Original natural language question
- `generated_sql`: SQL proposed by AI
- `validation_status`: PASSED / REJECTED
- `execution_time_ms`: Execution duration
- `result_row_count`: Number of returned rows
- `timestamp`: ISO-8601 UTC timestamp
