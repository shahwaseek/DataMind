import React, { useState } from 'react';

interface SQLConsoleProps {
  datasetId: string;
  datasetName: string;
}

interface QueryResult {
  columns: string[];
  rows: Record<string, any>[];
  total_rows: number;
  returned_rows: number;
  is_truncated: boolean;
  execution_time_ms: number;
  sql_query: string;
  validation_status: string;
}

export const SQLConsole: React.FC<SQLConsoleProps> = ({ datasetId, datasetName }) => {
  const [sql, setSql] = useState<string>('SELECT * FROM dataset LIMIT 15');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [executing, setExecuting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runQuery = async (queryToRun?: string) => {
    const targetSql = queryToRun || sql;
    if (!targetSql.trim()) return;

    setExecuting(true);
    setError(null);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/datasets/${datasetId}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql_query: targetSql }),
      });

      if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.detail || 'Query execution failed');
      }

      const data: QueryResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown query error');
      setResult(null);
    } finally {
      setExecuting(false);
    }
  };

  const handleTemplateClick = (templateSql: string) => {
    setSql(templateSql);
    runQuery(templateSql);
  };

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* SQL Editor Card */}
      <div className="glass-card card">
        <div className="card-header">
          <h3 className="card-title">
            <span className="card-icon">⚡</span> DuckDB Read-Only SQL Console
          </h3>
          <span className="status-badge" style={{ color: 'var(--accent-cyan)' }}>
            Target: <code>dataset</code> ({datasetName})
          </span>
        </div>

        {/* Quick Query Templates */}
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>Quick Templates:</span>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
            onClick={() => handleTemplateClick('SELECT * FROM dataset LIMIT 20')}
          >
            SELECT All
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
            onClick={() => handleTemplateClick('SELECT COUNT(*) AS total_records FROM dataset')}
          >
            COUNT Rows
          </button>
        </div>

        {/* Query Input */}
        <div style={{ position: 'relative' }}>
          <textarea
            className="form-input"
            rows={4}
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            placeholder="Write read-only SQL (e.g. SELECT * FROM dataset)..."
            style={{ width: '100%', fontFamily: 'var(--font-mono)', fontSize: '0.95rem', lineHeight: '1.5', resize: 'vertical' }}
            disabled={executing}
          />
        </div>

        {/* Action Button & Security Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            🔒 AST Parser Enforced: DDL/DML & external calls are blocked
          </span>
          <button className="btn btn-primary" onClick={() => runQuery()} disabled={executing}>
            {executing ? 'Executing Query...' : '▶ Run SQL Query'}
          </button>
        </div>
      </div>

      {/* Error / Security Rejection Banner */}
      {error && (
        <div className="glass-card card" style={{ borderLeft: '4px solid #ef4444', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
          <h4 style={{ marginBottom: '0.25rem' }}>⚠️ Query Rejected / Failed</h4>
          <p style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)' }}>{error}</p>
        </div>
      )}

      {/* Query Result Card */}
      {result && (
        <div className="glass-card card">
          <div className="card-header" style={{ marginBottom: '1rem' }}>
            <h4 style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--accent-green)' }}>✓</span> Execution Result Payload
            </h4>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <span className="status-badge" style={{ color: 'var(--accent-green)' }}>
                {result.execution_time_ms} ms
              </span>
              <span className="status-badge" style={{ color: 'var(--accent-cyan)' }}>
                {result.returned_rows} of {result.total_rows.toLocaleString()} rows
              </span>
            </div>
          </div>

          {/* Results Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  {result.columns.map((col, cIdx) => (
                    <th key={cIdx}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td style={{ color: 'var(--text-muted)' }}>{rIdx + 1}</td>
                    {result.columns.map((col, cIdx) => (
                      <td key={cIdx}>{row[col] !== undefined && row[col] !== null ? String(row[col]) : ''}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
