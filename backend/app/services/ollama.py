import json
import re
import httpx
from typing import Dict, Any, List
from app.core.config import settings


def generate_heuristic_plan(question: str, columns_schema: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Fallback rule-based planner used when local Ollama service is unavailable.
    Translates natural-language question patterns into safe DuckDB SQL queries.
    """
    col_names = [c["name"] for c in columns_schema]
    col_lower_map = {c["name"].lower(): c["name"] for c in columns_schema}
    numeric_cols = [c["name"] for c in columns_schema if "int" in c["data_type"].lower() or "float" in c["data_type"].lower() or "double" in c["data_type"].lower() or c.get("is_numeric", False)]
    categorical_cols = [c["name"] for c in columns_schema if c["name"] not in numeric_cols]

    q_lower = question.lower()

    # Rule 1: Highest / Top / Best
    if any(k in q_lower for k in ["highest", "top", "max", "best", "most"]):
        num_col = numeric_cols[0] if numeric_cols else (col_names[1] if len(col_names) > 1 else col_names[0])
        cat_col = categorical_cols[0] if categorical_cols else col_names[0]
        
        # Look for explicit column mentions in question
        for name_lower, name_orig in col_lower_map.items():
            if name_lower in q_lower:
                if name_orig in numeric_cols:
                    num_col = name_orig
                else:
                    cat_col = name_orig

        sql = f"SELECT {cat_col}, SUM({num_col}) AS total_{num_col} FROM dataset GROUP BY {cat_col} ORDER BY total_{num_col} DESC LIMIT 5"
        return {
            "intent": "top_n",
            "explanation": f"Identified request for top records by {num_col} grouped by {cat_col}.",
            "generated_sql": sql,
            "model_identifier": "datamind-heuristic-planner-v1"
        }

    # Rule 2: Count / Total rows
    if any(k in q_lower for k in ["how many", "count", "total rows"]):
        sql = "SELECT COUNT(*) AS total_count FROM dataset"
        return {
            "intent": "summary",
            "explanation": "Calculated total row count of dataset.",
            "generated_sql": sql,
            "model_identifier": "datamind-heuristic-planner-v1"
        }

    # Rule 3: Average / Mean
    if any(k in q_lower for k in ["average", "avg", "mean"]):
        num_col = numeric_cols[0] if numeric_cols else col_names[0]
        sql = f"SELECT AVG({num_col}) AS average_{num_col} FROM dataset"
        return {
            "intent": "aggregation",
            "explanation": f"Computed average value for numeric column '{num_col}'.",
            "generated_sql": sql,
            "model_identifier": "datamind-heuristic-planner-v1"
        }

    # Default fallback: Sample preview
    return {
        "intent": "summary",
        "explanation": "Retrieved dataset preview for analysis.",
        "generated_sql": "SELECT * FROM dataset LIMIT 10",
        "model_identifier": "datamind-heuristic-planner-v1"
    }


async def generate_nl_plan(question: str, columns_schema: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Sends schema and natural-language question to Ollama API for structured JSON plan generation.
    Falls back gracefully to heuristic generator if Ollama is unreachable.
    """
    schema_summary = ", ".join([f"{c['name']} ({c['data_type']})" for c in columns_schema])
    prompt = f"""
You are an expert Data Analyst AI for DataMind.
The target dataset is registered as a SQL view named 'dataset' with columns:
{schema_summary}

User Question: "{question}"

Instructions:
Convert the user question into a valid, safe DuckDB SQL query operating ONLY on the view 'dataset'.
Return ONLY a JSON object with this exact structure:
{{
  "intent": "aggregation|filtering|top_n|summary|comparison",
  "explanation": "One sentence explanation of the analytical plan",
  "generated_sql": "SELECT ... FROM dataset ..."
}}
Do NOT include markdown formatting outside the JSON payload.
"""

    ollama_url = f"{settings.OLLAMA_BASE_URL.rstrip('/')}/api/generate"
    payload = {
        "model": settings.OLLAMA_DEFAULT_MODEL,
        "prompt": prompt,
        "stream": False,
        "format": "json"
    }

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            res = await client.post(ollama_url, json=payload)
            if res.status_code == 200:
                data = res.json()
                raw_response = data.get("response", "")
                
                # Parse JSON output
                parsed = json.loads(raw_response)
                parsed["model_identifier"] = f"ollama-{settings.OLLAMA_DEFAULT_MODEL}"
                return parsed
    except Exception:
        pass

    # Use robust heuristic planner if Ollama is offline or uninstalled
    return generate_heuristic_plan(question, columns_schema)
