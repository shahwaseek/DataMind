# DataMind --- Product Requirements Document (PRD)

## 1. Product Overview

**Product:** DataMind --- Local AI Data Analyst\
**Target period:** 2026--2027\
**Primary goal:** Build a local-first AI analytics application that
converts natural-language questions into reproducible, evidence-backed
data analysis.

DataMind is not a generic CSV chatbot. Its core design principle is:

> Let AI plan and explain analysis, while deterministic tools execute
> and validate the actual computation.

The initial product will run locally and aim for zero mandatory
API/cloud cost.

## 2. Problem

Users often need to answer questions from CSV, Excel, JSON, and Parquet
data but must know SQL, Python, Pandas, or BI tools to do so.

Existing AI data-analysis demos often have weaknesses: - answers can be
difficult to verify; - generated code may be unsafe; - analysis may not
be reproducible; - users cannot easily inspect the evidence behind an
answer; - complex questions require multiple analytical steps.

DataMind addresses these by combining LLM reasoning with DuckDB/Pandas
execution, validation, evidence, auditability, and controlled tool
execution.

## 3. Target Users

### Primary

-   Students learning data analytics and AI engineering
-   Junior data analysts
-   Developers working with datasets
-   Technical interview/demo audiences

### Secondary

-   Privacy-conscious users
-   Small teams exploring datasets locally

## 4. Product Goals

1.  Upload common analytical file formats.
2.  Automatically profile datasets.
3.  Ask questions in natural language.
4.  Convert questions into validated SQL/Python plans.
5.  Execute analysis locally.
6.  Generate charts.
7.  Show evidence and generated SQL.
8.  Maintain analysis history and reproducibility.
9.  Detect common data-quality issues.
10. Provide strong security boundaries around generated code.
11. Support local LLMs through Ollama.
12. Create a foundation for MCP/tool-based agents.

## 5. Non-Goals for MVP

The first release will NOT attempt to: - replace a professional data
scientist; - guarantee correctness for arbitrary business questions; -
autonomously modify original datasets; - execute unrestricted shell
commands; - provide unrestricted internet access; - support every
database/file format; - build a multi-agent architecture before the
single-agent workflow is stable.

## 6. MVP Scope

### Dataset

-   CSV
-   XLSX
-   JSON
-   Parquet
-   schema inference
-   row/column counts
-   data types
-   missing values
-   duplicate detection
-   basic numeric statistics

### Analytics

-   natural-language questions
-   SQL generation
-   SQL validation
-   DuckDB execution
-   result formatting
-   basic Pandas analysis
-   basic charts
-   analysis history

### AI

-   local Ollama integration
-   structured model output
-   tool selection
-   controlled retries
-   model/provider abstraction

### Evidence

Every analysis should record: - user question - dataset/version -
generated SQL/code - execution result - validation status - execution
time - timestamp - model identifier

## 7. Core User Journey

1.  User creates a project.
2.  User uploads a dataset.
3.  DataMind profiles the dataset.
4.  User asks a question.
5.  Planner identifies required analysis.
6.  Tool router selects SQL/Pandas/chart tools.
7.  Generated operation is validated.
8.  Operation executes against a controlled environment.
9.  Result is validated.
10. DataMind generates an evidence-backed explanation.
11. User can inspect SQL/code, result, chart, and analysis metadata.
12. Analysis can be re-run.

## 8. Example

User: \> Which region generated the highest revenue in 2025?

DataMind: - identifies date, quantity, price, and region; - plans
revenue as quantity × price; - generates SQL; - validates SQL; -
executes it with DuckDB; - checks the result; - generates a ranking
chart; - explains the result; - stores the analysis record.

## 9. Functional Requirements

### FR-01 Dataset ingestion

The system shall accept supported files and create a dataset record.

### FR-02 Profiling

The system shall generate a deterministic dataset profile without
requiring an LLM.

### FR-03 Natural-language analysis

The system shall accept analytical questions.

### FR-04 SQL generation

The system shall generate structured SQL proposals for supported
questions.

### FR-05 SQL validation

The system shall reject unsafe or unsupported SQL before execution.

### FR-06 Deterministic execution

Analytics shall execute through DuckDB and/or controlled Pandas tooling.

### FR-07 Result validation

The system shall run sanity checks before presenting results.

### FR-08 Visualization

The system shall generate supported chart types from validated results.

### FR-09 Evidence

The user shall be able to inspect how an answer was produced.

### FR-10 Reproducibility

An analysis shall be re-runnable against the same dataset version.

### FR-11 Auditability

Important operations shall be logged.

### FR-12 Local-first operation

The MVP shall function without mandatory paid cloud APIs.

## 10. Non-Functional Requirements

-   Local-first
-   Modular architecture
-   Testable services
-   Clear separation between AI and deterministic computation
-   Secure execution
-   Reasonable performance on laptop-scale datasets
-   Good error messages
-   Reproducible analysis
-   Provider-independent AI layer

## 11. Success Metrics

MVP target: - 95%+ successful ingestion for supported valid files - 90%+
correctness on a curated 100-question evaluation set for supported
analytical tasks - 95%+ safe SQL validation coverage for blocked
patterns - reproducible execution for saved analyses - no unrestricted
shell execution - no modification of original datasets by default

These are engineering targets, not claims of guaranteed real-world
accuracy.

## 12. Future Features

-   anomaly detection
-   forecasting
-   automated insight discovery
-   multiple datasets
-   joins across datasets
-   data cleaning workflows
-   report export
-   MCP server
-   plugin/tool architecture
-   advanced evaluation
-   OpenTelemetry observability
-   optional cloud deployment

## 13. Portfolio Positioning

DataMind demonstrates: - Python - FastAPI - React/TypeScript - SQL -
DuckDB - Pandas - LLMs - agents/tool calling - evaluation - data
engineering - visualization - security - Docker - testing -
observability

The portfolio story should emphasize trustworthy AI analytics, not
merely "chat with CSV."
