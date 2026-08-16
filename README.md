# DataMind 🧠📊

> **Local-First AI Data Analyst** — Converts natural-language questions into reproducible, evidence-backed data analysis.

---

## 📌 Overview

**DataMind** is a privacy-conscious, local-first analytical application that enables users to upload CSV, Excel, JSON, and Parquet files, ask analytical questions in plain English, and receive validated, evidence-backed answers with SQL and interactive visualizations.

### 🧠 Core Philosophy
> *"Let AI plan and explain analysis, while deterministic tools execute and validate the actual computation."*

DataMind treats all LLM output as untrusted code. Generated SQL and tool parameters pass through a validation layer before executing against read-only analytical engines (DuckDB & Pandas).

---

## 🏗️ Architecture & Stack

- **Frontend**: React + TypeScript (Vite, TailwindCSS / Custom Styling)
- **Backend API**: FastAPI (Python 3.10+)
- **Analytical Execution**: DuckDB & Pandas (Read-only, deterministic)
- **Metadata Database**: SQLite
- **Local AI Engine**: Ollama (Llama 3.2 / Qwen 2.5)

For technical details, check out:
- [PRD Documentation](file:///D:/DataMind/DataMind_project_docs/PRD.md)
- [Architecture Specifications](file:///D:/DataMind/DataMind_project_docs/ARCHITECTURE.md)
- [Implementation Plan](file:///D:/DataMind/DataMind_project_docs/IMPLEMENTATION_PLAN.md)
- [Security Model](file:///D:/DataMind/DataMind_project_docs/SECURITY.md)

---

## 🚀 Quick Start (Development)

### Backend Setup
```bash
# Navigate to backend
cd backend

# Create & activate virtual environment
python -m venv .venv
.venv\Scripts\activate   # On Windows
# source .venv/bin/activate # On Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
# Navigate to frontend
cd frontend

# Install dependencies & run dev server
npm install
npm run dev
```

---

## 🧪 Testing

```bash
# Run backend unit & health tests
cd backend
pytest
```

---

## 📜 License
MIT
