# DataMind --- Complete Implementation Plan

## 0. Development Philosophy

DataMind will be built as a collaborative project between: 1. The
developer/user 2. A coding agent

The coding agent is an implementation assistant, not the product owner.

The developer remains responsible for: - architecture decisions -
reviewing generated code - accepting/rejecting changes - testing -
security decisions - product direction - understanding every important
component

Rule:

> No large coding-agent change is accepted without tests and human
> review.

------------------------------------------------------------------------

# Phase 0 --- Project Foundation

## Goal

Create a clean, reproducible repository.

### Tasks

-   initialize Git repository;
-   create README;
-   create PRD.md;
-   create SECURITY.md;
-   create ARCHITECTURE.md;
-   create AGENTS.md;
-   create IMPLEMENTATION_PLAN.md;
-   create `.gitignore`;
-   create `.env.example`;
-   define Python version;
-   configure virtual environment;
-   create initial FastAPI app;
-   create initial frontend;
-   add basic CI.

### Exit criteria

-   application starts;
-   frontend loads;
-   backend health endpoint works;
-   tests execute;
-   CI is green.

------------------------------------------------------------------------

# Phase 1 --- Dataset Ingestion

## Goal

Upload and inspect datasets without AI.

### Implement

-   project creation;
-   dataset upload;
-   file type validation;
-   file size validation;
-   safe filename handling;
-   storage directory;
-   dataset metadata;
-   CSV reader;
-   XLSX reader;
-   JSON reader;
-   Parquet reader.

### Tests

-   valid CSV;
-   empty CSV;
-   malformed CSV;
-   oversized file;
-   malicious filename;
-   unsupported extension;
-   duplicate upload.

### Exit criteria

A user can upload a dataset and see basic metadata.

------------------------------------------------------------------------

# Phase 2 --- Dataset Profiling

## Goal

Create deterministic dataset intelligence.

### Implement

-   row count;
-   column count;
-   type inference;
-   null count;
-   null percentage;
-   unique count;
-   duplicate detection;
-   numeric min/max/mean/median;
-   categorical frequency;
-   date range;
-   basic data-quality warnings.

### Important

Do not use the LLM for these calculations.

### Exit criteria

Every dataset gets a reusable profile.

------------------------------------------------------------------------

# Phase 3 --- DuckDB Analytics Layer

## Goal

Build the deterministic analytical engine.

### Implement

-   DuckDB connection manager;
-   dataset registration;
-   read-only analytical queries;
-   CSV/Parquet querying;
-   query timeout;
-   SQL validation;
-   query result normalization;
-   execution metadata.

### Tests

-   SELECT;
-   GROUP BY;
-   JOIN;
-   aggregate;
-   invalid SQL;
-   DDL;
-   DML;
-   external access attempts;
-   large-result handling.

### Exit criteria

A user can execute safe analytical queries against a dataset.

------------------------------------------------------------------------

# Phase 4 --- Analyst API

## Goal

Expose analytics through FastAPI.

### Endpoints

``` text
POST /projects
GET  /projects
POST /datasets
GET  /datasets/{id}
GET  /datasets/{id}/profile
POST /analysis
GET  /analysis/{id}
POST /analysis/{id}/rerun
GET  /analysis/{id}/result
```

### Exit criteria

Frontend can perform the core workflow through APIs.

------------------------------------------------------------------------

# Phase 5 --- Local LLM Integration

## Goal

Introduce AI without allowing it to directly execute anything.

### Implement

-   Ollama adapter;
-   model configuration;
-   prompt templates;
-   structured JSON output;
-   model timeout;
-   model error handling;
-   provider abstraction.

### First AI task

Given: - user question; - schema; - allowed operations;

return:

``` json
{
  "intent": "aggregation",
  "metric": "revenue",
  "dimensions": ["region"],
  "filters": ["2025"],
  "tool": "sql"
}
```

Do not start with free-form autonomous agents.

### Exit criteria

The LLM reliably produces structured plans for supported question types.

------------------------------------------------------------------------

# Phase 6 --- NL-to-SQL

## Goal

Convert supported questions into SQL.

### Implement

-   schema-aware prompt;
-   SQL generation;
-   SQL parser/validator;
-   retry mechanism;
-   execution;
-   result formatting.

### Golden test set

Create at least 100 questions across: - aggregation; - filtering; -
sorting; - date ranges; - grouping; - top-N; - comparisons.

### Exit criteria

Target 90%+ correctness on the curated supported-question benchmark.

------------------------------------------------------------------------

# Phase 7 --- Visualization

## Goal

Turn validated results into useful charts.

### Implement

-   chart recommendation;
-   line;
-   bar;
-   histogram;
-   scatter;
-   pie/donut only where appropriate;
-   table;
-   chart metadata.

Prefer controlled chart tools over arbitrary model-generated code.

### Exit criteria

Supported analytical result types generate correct charts.

------------------------------------------------------------------------

# Phase 8 --- Evidence and Reproducibility

## Goal

Make every answer inspectable.

Store: - question; - dataset version; - plan; - SQL; - execution
result; - chart specification; - model ID; - timestamps; - validation
status; - execution duration.

### UI

Add: - View SQL - View result - View chart - View analysis metadata -
Re-run analysis

### Exit criteria

An analysis can be reproduced from its stored inputs and operations.

------------------------------------------------------------------------

# Phase 9 --- Data Quality

## Goal

Make DataMind useful before analysis begins.

### Implement

-   missing values;
-   duplicates;
-   invalid dates;
-   suspicious numeric values;
-   outliers;
-   inconsistent categories;
-   possible ID columns;
-   possible metric columns.

### UI

Show:

``` text
Data Quality Score: 87/100

Warnings:
- 3.7% missing values
- 23 invalid dates
- 17 negative prices
```

### Exit criteria

DataMind identifies common quality issues deterministically.

------------------------------------------------------------------------

# Phase 10 --- Pandas Analysis Tool

## Goal

Support analyses where SQL is not ideal.

### Implement

-   controlled Pandas operations;
-   statistical summaries;
-   correlation;
-   distribution analysis;
-   custom analytical functions.

Do not allow unrestricted Python execution.

### Safer initial approach

Provide predefined analytical functions rather than executing arbitrary
generated Python.

Example:

``` text
calculate_correlation()
detect_outliers()
summarize_distribution()
compare_groups()
```

### Exit criteria

Common statistical tasks can be performed without unrestricted code
execution.

------------------------------------------------------------------------

# Phase 11 --- Agent Orchestration

## Goal

Combine planning, tools and validation.

### Flow

``` text
Question
 ↓
Planner
 ↓
Tool selection
 ↓
Tool execution
 ↓
Validation
 ↓
Retry if needed
 ↓
Evidence
 ↓
Answer
```

### Implement

-   tool registry;
-   structured tool contracts;
-   execution state;
-   retries;
-   maximum iteration count;
-   failure recovery;
-   audit events.

### Important

Do not introduce multi-agent architecture yet.

### Exit criteria

The system can complete multi-step supported analytical workflows.

------------------------------------------------------------------------

# Phase 12 --- Security Hardening

## Goal

Make AI-driven execution safe.

### Implement

-   SQL allowlist;
-   no DDL/DML;
-   external access restrictions;
-   path validation;
-   upload limits;
-   query timeouts;
-   resource limits;
-   isolated temporary directories;
-   audit logs;
-   secrets protection.

If safe Python sandboxing is not ready: - keep arbitrary Python
execution disabled.

### Security tests

Run every test in SECURITY.md.

### Exit criteria

Critical security tests pass.

------------------------------------------------------------------------

# Phase 13 --- Evaluation Framework

## Goal

Measure DataMind scientifically.

Create datasets and questions with known answers.

### Metrics

``` text
SQL correctness
Answer correctness
Tool-selection accuracy
Chart-selection accuracy
Execution success
Latency
Retry rate
Security-block rate
```

### Dashboard

``` text
Questions: 100
Correct: 92
Incorrect: 8
SQL success: 97%
Average latency: 2.3s
```

### Exit criteria

Every major release runs the evaluation suite.

------------------------------------------------------------------------

# Phase 14 --- MCP

## Goal

Expose stable DataMind capabilities as MCP tools.

### Initial tools

-   get_schema
-   profile_dataset
-   execute_sql
-   analyze_dataset
-   create_chart
-   generate_report

### Rule

MCP should be added after internal tool contracts are stable.

### Exit criteria

A compatible MCP client can invoke approved DataMind tools.

------------------------------------------------------------------------

# Phase 15 --- Reports

## Goal

Generate professional analysis reports.

Report structure: 1. Question 2. Dataset 3. Executive summary 4. Key
findings 5. Charts 6. Evidence 7. SQL 8. Data-quality notes 9.
Limitations 10. Reproduction metadata

------------------------------------------------------------------------

# Phase 16 --- Docker and CI/CD

## Goal

Make the project reproducible for other developers.

### Docker

-   frontend;
-   backend;
-   optional worker.

### CI

-   lint;
-   type checks;
-   unit tests;
-   integration tests;
-   security checks;
-   evaluation tests.

### Exit criteria

A new developer can clone the repository and run DataMind using
documented steps.

------------------------------------------------------------------------

# Phase 17 --- Portfolio Release

## Required

-   polished README;
-   architecture diagram;
-   screenshots;
-   demo dataset;
-   demo video;
-   benchmark results;
-   security documentation;
-   setup guide;
-   API documentation;
-   technical decisions;
-   known limitations;
-   roadmap.

## Portfolio demo

The demo should show:

1.  Upload dataset
2.  Automatic profile
3.  Ask analytical question
4.  Generated plan
5.  SQL
6.  Execution
7.  Chart
8.  Evidence
9.  Re-run
10. Evaluation dashboard

------------------------------------------------------------------------

# Recommended Milestones

## M0

Foundation

## M1

Dataset ingestion

## M2

Profiling

## M3

DuckDB analytics

## M4

FastAPI workflow

## M5

Ollama integration

## M6

NL-to-SQL

## M7

Charts

## M8

Evidence/reproducibility

## M9

Pandas/statistics

## M10

Agent orchestration

## M11

Security hardening

## M12

Evaluation

## M13

MCP

## M14

Reports

## M15

Docker/CI/CD

## M16

Portfolio release

------------------------------------------------------------------------

# Coding-Agent Workflow

For every feature:

1.  Human defines requirement.
2.  Coding agent inspects repository.
3.  Coding agent proposes implementation.
4.  Human reviews plan.
5.  Coding agent implements a small change.
6.  Coding agent writes/updates tests.
7.  Tests run.
8.  Human reviews diff.
9.  Security impact is checked.
10. Change is committed.

Never ask the coding agent to "build the entire application" in one
prompt.

Prefer small tasks such as:

> Implement dataset metadata models and migrations. Do not modify the
> frontend. Add unit tests for validation.

Then:

> Implement the dataset upload service. Follow SECURITY.md. Add tests
> for path traversal and unsupported file types.

Then:

> Implement DuckDB read-only query execution. Add tests for DDL/DML
> rejection.

This keeps the agent controllable and makes debugging easier.

------------------------------------------------------------------------

# Definition of Done

A feature is done only when:

-   implementation exists;
-   tests exist;
-   tests pass;
-   error handling exists;
-   security implications are considered;
-   documentation is updated;
-   no unrelated files were changed;
-   human reviewed the diff.

------------------------------------------------------------------------

# Final Product Principle

DataMind should never be:

``` text
User → LLM → Answer
```

It should be:

``` text
User
 ↓
AI Planning
 ↓
Controlled Tool
 ↓
Deterministic Execution
 ↓
Validation
 ↓
Evidence
 ↓
Explanation
```

That architecture is the foundation of the project.
