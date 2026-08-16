# DataMind --- Coding Agent Instructions

## Role

You are a coding agent contributing to DataMind.

The human developer owns: - product requirements; - architecture
decisions; - security decisions; - acceptance criteria; - final code
approval.

## Read First

Before changing code, read: 1. PRD.md 2. ARCHITECTURE.md 3. SECURITY.md
4. IMPLEMENTATION_PLAN.md

## Core Rules

### 1. Small Changes

Implement one logical feature at a time.

### 2. Do Not Rewrite Unrelated Code

Do not refactor unrelated modules unless explicitly requested.

### 3. Tests Required

Every new backend behavior should have tests.

### 4. Security

Treat: - user input; - uploaded data; - LLM output; - SQL; - generated
code; - tool arguments

as untrusted.

Never introduce unrestricted shell execution, arbitrary filesystem
access, or unrestricted network access.

### 5. Original Data

Never modify original uploaded datasets unless an explicit future
feature requires it and the user confirms the operation.

### 6. AI Output

Never execute raw LLM output directly.

LLM output must pass through: - schema validation; - policy
validation; - tool validation; - execution controls.

### 7. Database

Use SQLite for application metadata initially. Use DuckDB for analytics.

### 8. Local First

Prefer local/open-source solutions during MVP development.

### 9. Dependencies

Do not add a dependency without explaining: - why it is needed; - what
problem it solves; - whether an existing dependency can do the job.

### 10. Secrets

Never commit API keys, tokens, passwords, or private credentials.

## Coding Style

Prefer: - clear names; - small functions; - typed interfaces; - explicit
error handling; - dependency injection where useful; - testable
services; - deterministic behavior.

Avoid: - giant files; - hidden global state; - magic values; -
unnecessary abstractions; - premature multi-agent architecture.

## Agent Workflow

For each task:

1.  Inspect relevant files.
2.  Explain intended changes.
3.  Implement the smallest change.
4.  Add tests.
5.  Run tests.
6.  Report failures honestly.
7.  Summarize modified files.
8.  Wait for human review when the task is high-risk.

## High-Risk Changes Requiring Extra Care

-   execution engine;
-   Python sandbox;
-   SQL execution;
-   filesystem access;
-   network access;
-   authentication;
-   secrets;
-   dependency changes;
-   MCP tools;
-   Docker permissions.

## Do Not Claim Success Without Evidence

Do not say: - "works"; - "secure"; - "production ready"; - "all tests
pass"

unless the corresponding verification was actually performed.

## Commit Style

Use small commits:

``` text
feat: add dataset profiling
test: add dataset profiling tests
fix: reject unsafe SQL
docs: update security model
```
