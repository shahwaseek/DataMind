---
name: security-threat-modeling
description: Guidelines for security threat modeling, LLM prompt injection defenses, input sanitization, path traversal prevention, OWASP compliance, and safe code execution boundaries.
---

# Security & Threat Modeling Skill

This skill provides patterns and controls for securing AI applications, backend APIs, file uploads, and execution sandboxes.

---

## 🛡️ 1. LLM Prompt Injection Defenses

- **Strict Boundary Separation**: System instructions and tools must be isolated from user input and dataset content.
- **Never Treat User Content as Executable Instructions**: Wrap dataset cell values or user inputs in clear delimiter blocks (e.g. `<dataset_context>...</dataset_context>`).
- **Structured Schema Validation**: Force the model to output strict JSON schemas validated by Pydantic before taking any tool actions.

---

## 📁 2. Path Traversal & File Upload Security

- **Path Canonicalization**: Always resolve absolute paths using `Path.resolve()` and verify that the target path starts with the allowed root directory (`allowed_dir`).

```python
from pathlib import Path

def validate_safe_path(base_dir: Path, filename: str) -> Path:
    # Remove directory separators and normalize
    safe_name = Path(filename).name
    target_path = (base_dir / safe_name).resolve()
    
    if not str(target_path).startswith(str(base_dir.resolve())):
        raise ValueError(f"Security violation: Path traversal attempt detected ({filename})")
    
    return target_path
```

---

## 🛑 3. Safe Execution Controls

- **Read-Only SQL Validation**: Check SQL queries using an AST parser (or regex allowlists) to ensure no DDL (`CREATE`, `DROP`, `ALTER`) or DML (`INSERT`, `UPDATE`, `DELETE`) or administrative commands can execute.
- **No Unrestricted Python Execution**: Never execute raw Python string output from an LLM directly via `exec()` or `eval()`. Use predefined function callers or isolated sandboxes.
- **Query & Process Timeouts**: Wrap all DuckDB / database executions in strict timeout handlers.
