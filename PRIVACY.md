# DataMind — Privacy Policy

**Effective Date:** August 16, 2026  
**Last Updated:** August 16, 2026

At **DataMind**, privacy and data sovereignty are fundamental design principles. DataMind is built as a **local-first** application, ensuring that your analytical datasets, database records, and query history remain strictly under your control.

---

## 1. Local-First Data Sovereignty

- **Local Storage**: All uploaded datasets (CSV, Excel, JSON, Parquet), SQLite database records (`datamind.db`), and DuckDB execution caches are stored exclusively on your local host system (default: `./data/` directory).
- **No Automatic Cloud Syncing**: DataMind does not automatically upload, transmit, sync, or back up your raw dataset content to remote external servers or third-party cloud providers.
- **Immutable Raw Files**: Original uploaded dataset files are treated as read-only by DataMind's execution engine.

---

## 2. Local AI & LLM Processing

- **Ollama Integration**: Natural language query planning and intent classification are processed locally using your self-hosted Ollama instance (`http://localhost:11434`).
- **Zero Third-Party Model Training**: Your dataset contents, schema structure, and natural-language questions are never sent to external AI providers (such as OpenAI or Anthropic) unless you explicitly configure an external API provider key in your environment settings.

---

## 3. Data Collection & Telemetry

- **No Data Selling**: We do not collect, aggregate, sell, or rent your private dataset records, column schemas, query history, or personal information.
- **Local Audit Logs**: Operational logs and evidence audit trails are recorded locally in your SQLite metadata database to support analysis reproducibility.

---

## 4. User Data Retention & Permanent Deletion

- **Full Control**: You retain 100% ownership and authority over all projects, datasets, and generated analyses.
- **Permanent Removal**: Deleting a project or dataset via the DataMind user interface or deleting the `./data/` folder immediately and permanently purges all associated files and metadata from your host storage.

---

## 5. Security Practices

- **Read-Only Execution**: SQL queries execute in an isolated, read-only DuckDB environment. Data Modification (DML) and Data Definition (DDL) operations are strictly blocked.
- **Path Traversal Defenses**: Uploaded filenames pass through canonical path sanitization to prevent unauthorized access to external system directories.

---

## 6. Updates to This Policy

We may update this Privacy Policy periodically to reflect enhancements in DataMind's software architecture. Any changes will be published in this repository with an updated effective date.

---

## 7. Contact Information

For privacy inquiries or technical questions regarding DataMind's architecture, please open an issue on the official GitHub repository:  
👉 [https://github.com/shahwaseek/DataMind](https://github.com/shahwaseek/DataMind)
