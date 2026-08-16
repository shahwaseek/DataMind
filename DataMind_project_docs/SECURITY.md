# DataMind --- Security Design and Threat Model

## 1. Security Objective

DataMind executes operations influenced by an AI model. Therefore the
system must assume that: - model output can be incorrect; - generated
SQL/code can be unsafe; - uploaded datasets can contain malicious or
unexpected content; - users can ask for ambiguous or harmful
operations; - dependencies and tool integrations can introduce risk.

Core principle:

> Never treat LLM-generated output as trusted code.

## 2. Security Boundaries

### Boundary A --- User input

Untrusted: - questions - filenames - uploaded files - metadata

### Boundary B --- LLM output

Untrusted: - SQL - Python - tool arguments - chart specifications

### Boundary C --- Execution

Highly restricted: - filesystem - network - process execution - memory -
CPU - runtime duration

### Boundary D --- Stored data

Original datasets should be treated as immutable by default.

## 3. Threats

### T1 Prompt injection

Dataset content or user input may attempt to manipulate the model.

Mitigations: - separate system/tool instructions from dataset content; -
never treat dataset text as instructions; - tool allowlists; -
structured outputs; - validation before execution.

### T2 Unsafe SQL

Generated SQL could attempt filesystem access, extensions, unsupported
operations, or data modification.

Mitigations: - read-only analytical role; - SQL parser/validator; -
statement allowlist; - reject DDL/DML by default; - restrict external
access; - query timeout; - resource limits.

### T3 Arbitrary Python execution

Generated Python could access files, network, environment variables, or
execute processes.

Mitigations: - isolated worker/sandbox; - restricted filesystem; - no
shell; - no subprocess; - no network; - resource limits; - timeout; -
package allowlist.

Python execution should be disabled in MVP unless a safe execution
boundary is available.

### T4 Path traversal

Uploaded filenames or generated paths may attempt to escape the
workspace.

Mitigations: - normalize paths; - use project-specific directories; -
verify resolved path remains under an allowed root; - never concatenate
raw user paths.

### T5 Data leakage

Sensitive data may accidentally be sent to an external model.

Mitigations: - local model by default; - explicit provider
configuration; - clear UI indication before external processing; - never
send entire datasets when schema/sample is sufficient.

### T6 Denial of service

Huge files or expensive queries can exhaust resources.

Mitigations: - upload limits; - row/size thresholds; - query timeout; -
memory limits; - concurrency limits; - profiling limits.

### T7 Result hallucination

The model may describe results that are not present in the execution
output.

Mitigations: - final answer generated from structured result data; -
evidence references; - numeric consistency checks; - never allow the LLM
to invent result values.

### T8 Supply-chain risk

Dependencies may introduce vulnerabilities.

Mitigations: - lock dependency versions; - dependency scanning; -
minimal dependencies; - regular updates; - CI security checks.

## 4. Security Architecture

``` text
User
  |
  v
API validation
  |
  v
AI Planner
  |
  v
Structured Tool Request
  |
  v
Policy / Permission Validator
  |
  +---- reject ----> Audit Log
  |
  v
Sandboxed Tool
  |
  v
Result Validator
  |
  v
Evidence Store
  |
  v
User
```

## 5. Data Rules

-   Original datasets are read-only by default.
-   Derived datasets are stored separately.
-   Temporary execution files are isolated.
-   Secrets are never stored inside prompts.
-   API keys, if later supported, belong in environment/secret storage.
-   Logs must not unnecessarily contain sensitive raw data.

## 6. Security Testing

Minimum security tests: - path traversal attempts - malicious
filenames - unsafe SQL - SQL DDL/DML - external file access - external
network access - Python subprocess attempts - environment-variable
access - oversized uploads - malformed files - prompt injection in
dataset cells - prompt injection in column names - result
hallucination - unauthorized tool calls

## 7. Security Acceptance Criteria

The MVP is not production-ready until: - original files cannot be
modified through AI analysis; - unsafe SQL is blocked; - Python cannot
access arbitrary host resources; - network access is denied to execution
workers; - execution has time/resource limits; - security events are
auditable; - tests cover all critical controls.
