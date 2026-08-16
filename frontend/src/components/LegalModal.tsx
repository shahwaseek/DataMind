import React from 'react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="glass-card modal-content"
        style={{ maxWidth: '700px', maxHeight: '80vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.25rem' }}>
            {type === 'privacy' ? '🔒 Privacy Policy' : '📜 Terms & Conditions'}
          </h2>
          <button className="btn btn-secondary" style={{ padding: '0.25rem 0.65rem' }} onClick={onClose}>
            ✕
          </button>
        </div>

        {type === 'privacy' ? (
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <h4 style={{ color: 'var(--accent-cyan)', marginTop: '0.5rem' }}>1. Local-First Data Sovereignty</h4>
            <p>DataMind operates on a strict local-first architecture. All uploaded datasets (CSV, Excel, JSON, Parquet), SQLite database records, and DuckDB query caches remain exclusively on your host machine.</p>

            <h4 style={{ color: 'var(--accent-cyan)', marginTop: '1rem' }}>2. Local AI & LLM Processing</h4>
            <p>Natural language query planning is processed locally using self-hosted Ollama. Your raw dataset rows are never sent to external AI servers or used to train third-party models.</p>

            <h4 style={{ color: 'var(--accent-cyan)', marginTop: '1rem' }}>3. Data Retention & Control</h4>
            <p>You retain 100% control over all data. Deleting a project permanently purges associated local database records and storage files.</p>
          </div>
        ) : (
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <h4 style={{ color: 'var(--accent-indigo)', marginTop: '0.5rem' }}>1. License & Software Use</h4>
            <p>DataMind grants you a non-exclusive license to use the application for local data analysis in compliance with open-source dependencies (FastAPI, DuckDB, Pandas, React).</p>

            <h4 style={{ color: 'var(--accent-indigo)', marginTop: '1rem' }}>2. AI Generated Content Disclaimer</h4>
            <p>Generated query plans and charts are provided for analytical assistance. Users are responsible for inspecting SQL queries and verifying business insights before taking critical actions.</p>

            <h4 style={{ color: 'var(--accent-indigo)', marginTop: '1rem' }}>3. Limitation of Liability</h4>
            <p>DataMind is provided "AS IS" without warranties of any kind. Maintainers shall not be liable for any data loss or indirect damages arising from software usage.</p>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
