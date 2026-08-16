import React, { useState } from 'react';

interface SQLQueryResult {
  columns: string[];
  rows: Record<string, any>[];
  total_rows: number;
  returned_rows: number;
  execution_time_ms: number;
  validation_status: string;
}

interface SQLConsoleProps {
  datasetId: string;
  datasetName: string;
}

export const SQLConsole: React.FC<SQLConsoleProps> = ({ datasetId, datasetName }) => {
  const [query, setQuery] = useState<string>('SELECT * FROM dataset LIMIT 10;');
  const [result, setResult] = useState<SQLQueryResult | null>(null);
  const [executing, setExecuting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleExecute = async () => {
    if (!query.trim()) return;

    setExecuting(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/datasets/${datasetId}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql_query: query }),
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.detail || 'SQL Query Execution Failed');
      }

      const data: SQLQueryResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'SQL Query execution failed');
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="glass-card card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
      <div className="card-header" style={{ marginBottom: '1rem' }}>
        <h3 className="card-title">
          <span className="material-symbols-outlined text-primary text-[20px]">terminal</span> DuckDB Read-Only SQL Console
        </h3>
        <span className="brand-badge" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
          Target: {datasetName} (table: dataset)
        </span>
      </div>

      {/* SQL Input Textarea */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <textarea
          className="form-input"
          rows={4}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            background: 'var(--bg-darker)',
            border: '1px solid var(--border-glow)',
            color: 'var(--accent-light)',
          }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="SELECT * FROM dataset WHERE ..."
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            🔒 AST Guard Enabled (DDL / DML & File Functions Blocked)
          </div>
          <button className="btn-primary cursor-pointer" onClick={handleExecute} disabled={executing || !query.trim()}>
            {executing ? 'Executing Query...' : 'Run SQL Query →'}
          </button>
        </div>
      </div>

      {/* Error Output Pane */}
      {error && (
        <div style={{ background: 'rgba(255, 107, 107, 0.15)', borderLeft: '4px solid var(--accent-danger)', padding: '1rem', borderRadius: '8px', color: 'var(--accent-danger)', marginBottom: '1rem' }}>
          <h4 style={{ marginBottom: '0.25rem' }} className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">warning</span>
            <span>Query Rejected / Failed</span>
          </h4>
          <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>{error}</pre>
        </div>
      )}

      {/* Query Execution Result */}
      {result && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span className="badge-pill badge-emerald">✓ STATUS: {result.validation_status}</span>
              <span className="badge-pill badge-cyan">{result.returned_rows} rows returned</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Latency: {result.execution_time_ms} ms
            </div>
          </div>

          <div style={{ overflowX: 'auto', maxHeight: '350px' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  {result.columns.map((col, idx) => (
                    <th key={idx}>{col}</th>
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
