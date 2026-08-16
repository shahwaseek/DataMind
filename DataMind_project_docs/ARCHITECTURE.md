# DataMind --- Technical Architecture

## 1. Architecture Principles

1.  Local-first
2.  AI is untrusted
3.  Deterministic tools perform computation
4.  Every important analysis is reproducible
5.  Security boundaries are explicit
6.  Services are independently testable
7.  Start simple; add agent complexity only when justified

## 2. High-Level Architecture

``` text
React + TypeScript
        |
        v
     FastAPI
        |
  +-----+------------------+
  |        |       |       |
  v        v       v       v
Projects Datasets Agent  Reports
            |
            v
          DuckDB
            |
       CSV/XLSX/JSON/
          Parquet

Agent
  |
  +-- Schema Tool
  +-- SQL Tool
  +-- Pandas Tool
  +-- Chart Tool
  +-- Profile Tool
            |
            v
      Validation Layer
            |
            v
       Evidence Store
```

## 3. Application Storage

Use SQLite initially for: - users/settings - projects - dataset
metadata - dataset versions - analysis records - execution metadata -
reports

Use DuckDB for: - analytical datasets - SQL execution - analytical
queries

## 4. Core Domain Objects

### Project

Represents a user's workspace.

### Dataset

Logical dataset identity.

### DatasetVersion

Immutable uploaded/derived version.

### Analysis

A user question plus the resulting plan, execution and evidence.

### Execution

A single SQL/Python/tool execution attempt.

### Report

Human-readable summary of one or more analyses.

## 5. Agent Flow

``` text
Question
  |
  v
Intent / task classification
  |
  v
Dataset schema retrieval
  |
  v
Analysis plan
  |
  v
Tool selection
  |
  v
Tool argument generation
  |
  v
Validation
  |
  +---- fail --> repair/retry
  |
  v
Execution
  |
  v
Result validation
  |
  +---- fail --> repair/retry
  |
  v
Evidence-backed answer
```

## 6. Tool Contracts

Tools should use structured input/output.

Example:

``` text
get_schema(dataset_id)
execute_sql(dataset_id, sql)
profile_dataset(dataset_id)
create_chart(data, chart_type)
```

Every tool returns: - success/failure - structured result - error code -
execution metadata

## 7. Frontend Areas

-   Dashboard
-   Project page
-   Dataset upload
-   Dataset profile
-   Analyst chat
-   Results
-   SQL/code viewer
-   Chart viewer
-   Analysis history
-   Evaluation dashboard
-   Settings

## 8. Backend Modules

Suggested modules:

``` text
app/
  api/
  core/
  db/
  models/
  schemas/
  services/
  agent/
  tools/
  validation/
  analytics/
  security/
  observability/
  tests/
```

## 9. Future MCP Layer

After internal tools stabilize:

``` text
DataMind MCP Server
  |
  +-- get_schema
  +-- profile_dataset
  +-- execute_sql
  +-- analyze_dataset
  +-- create_chart
  +-- generate_report
```

MCP should expose stable tool contracts, not internal implementation
details.

## 10. Observability

Capture: - request ID - project ID - dataset version - analysis ID -
model ID - tool calls - execution duration - validation outcome - error
codes

Do not log raw sensitive dataset content by default.
