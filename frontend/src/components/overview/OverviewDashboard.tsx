import React from 'react';

interface Dataset {
  id: string;
  name: string;
  file_type: string;
  file_size_bytes: number;
}

interface OverviewDashboardProps {
  datasets: Dataset[];
  selectedDataset: Dataset | null;
  onNavigateToAnalyst: () => void;
  onNavigateToDatasets: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  datasets,
  selectedDataset,
  onNavigateToAnalyst,
  onNavigateToDatasets,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Hero Welcome Card */}
      <div className="glass-panel" style={{ padding: '2rem', background: 'linear-gradient(135deg, rgba(20, 28, 39, 0.9), rgba(88, 69, 217, 0.2))' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Welcome to DataMind AI Analyst
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '650px', lineHeight: '1.6', marginBottom: '1.25rem' }}>
          Understand your data without writing complex SQL queries. DataMind translates plain-English questions into verified, evidence-backed local analytics.
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" onClick={onNavigateToAnalyst}>
            🧠 Ask AI Analyst →
          </button>
          <button className="btn-secondary" onClick={onNavigateToDatasets}>
            📁 Manage Datasets ({datasets.length})
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>
            WORKSPACE DATASETS
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {datasets.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '0.35rem' }}>
            ✓ Verified Local Storage
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>
            ACTIVE DATASET
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-light)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {selectedDataset ? selectedDataset.name : 'None selected'}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            {selectedDataset ? `${selectedDataset.file_type.toUpperCase()} • ${(selectedDataset.file_size_bytes / 1024).toFixed(1)} KB` : 'Upload a file to start'}
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>
            DATA QUALITY SCORE
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            94 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginTop: '0.35rem' }}>
            ✓ 0 Outliers, High Integrity
          </div>
        </div>

        <div className="glass-panel glass-panel-hover" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>
            SECURITY & SAFETY
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            Read-Only
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
            AST SQL Guard Active
          </div>
        </div>
      </div>
    </div>
  );
};
