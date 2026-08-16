import React from 'react';

export const SettingsView: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.25rem', fontSize: '1.2rem' }}>
          ⚙️ DataMind System & AI Settings
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
              Local Ollama Base URL
            </label>
            <input className="form-input" defaultValue="http://localhost:11434" readOnly />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
              Communicates asynchronously with local Ollama service over localhost HTTP.
            </span>
          </div>

          <div>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
              Default Ollama Model
            </label>
            <input className="form-input" defaultValue="llama3.2" readOnly />
          </div>

          <div>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
              DuckDB Analytics Engine
            </label>
            <div className="badge-pill badge-emerald">In-Memory Read-Only (:memory:)</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
              Enforces read-only AST query rules blocking DDL, DML, and file manipulation functions.
            </span>
          </div>

          <div>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem', fontWeight: 600 }}>
              Local Storage Path
            </label>
            <input className="form-input" defaultValue="./data/datamind.db" readOnly />
          </div>
        </div>
      </div>
    </div>
  );
};
