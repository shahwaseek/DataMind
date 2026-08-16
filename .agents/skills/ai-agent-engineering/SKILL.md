---
name: ai-agent-engineering
description: Best practices for building AI agents, LLM tool calling pipelines, structured JSON outputs, prompt engineering, agent orchestration, retry mechanisms, and memory management.
---

# AI Agent Engineering Skill

This skill provides patterns for building reliable, autonomous AI agents, structured tool orchestration pipelines, and local LLM integrations (Ollama / OpenAI / Claude).

---

## 🤖 1. Structured JSON Output Pipelines

- Never rely on free-form string parsing from LLMs.
- Force JSON mode or structured schema outputs.
- Wrap model calls with retry loops for schema validation errors.

```python
from pydantic import BaseModel, Field
import json

class AgentPlan(BaseModel):
    intent: str = Field(..., description="High-level analytical intent")
    target_tool: str = Field(..., description="Selected tool identifier")
    sql_query: str | None = Field(None, description="Generated SQL query if tool is sql")
    explanation: str = Field(..., description="Reasoning behind plan")

def parse_agent_response(raw_llm_output: str) -> AgentPlan:
    # Extract JSON block if wrapped in markdown
    content = raw_llm_output.strip()
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()
    
    data = json.loads(content)
    return AgentPlan(**data)
```

---

## 🛠️ 2. Tool Contract Design

- Tools must have deterministic, strongly-typed inputs and outputs.
- Every tool response must return a standard result wrapper containing:
  - `success`: bool
  - `data`: Any structured result payload
  - `error_code`: String error code if failed
  - `execution_metadata`: Timing, dataset ID, rows processed

---

## 🔄 3. Controlled Retries & Fallback Loops

- Limit agent self-correction loops to a maximum iteration count (e.g. `max_retries = 3`).
- On validation failure, append the exact validation error message to the agent's prompt history so it can fix syntax errors without repeating mistakes.
