import React from 'react';

interface DatasetPreviewProps {
  dataset: {
    id: string;
    name: string;
    file_type: string;
    file_size_bytes: number;
    latest_version?: {
      row_count: number;
      column_count: number;
      columns: Array<{ name: string; type: string }>;
    };
  };
  previewData?: {
    columns: string[];
    rows: Record<string, any>[];
  } | null;
  loading?: boolean;
}

export const DatasetPreview: React.FC<DatasetPreviewProps> = ({ dataset, previewData, loading }) => {
  return (
    <div className="glass-card card">
      <div className="card-header">
        <h3 className="card-title">
          <span className="material-symbols-outlined text-primary text-[20px]">table_view</span> {dataset.name} — Schema & Row Preview
        </h3>
        <span className="brand-badge">{dataset.file_type.toUpperCase()}</span>
      </div>

      {/* Dataset Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--surface-container)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Row Count</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {dataset.latest_version?.row_count || 0}
          </div>
        </div>
        <div style={{ background: 'var(--surface-container)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Column Count</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {dataset.latest_version?.column_count || 0}
          </div>
        </div>
        <div style={{ background: 'var(--surface-container)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>File Size</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {(dataset.file_size_bytes / 1024).toFixed(1)} KB
          </div>
        </div>
      </div>

      {/* Column Schema Table */}
      {dataset.latest_version?.columns && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Detected Schema</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {dataset.latest_version.columns.map((col, idx) => (
              <span key={idx} className="badge-pill" style={{ background: 'var(--surface-container)', borderColor: 'var(--border-subtle)' }}>
                <strong style={{ color: 'var(--text-primary)' }}>{col.name}</strong>
                <span style={{ color: 'var(--accent-cyan)', fontSize: '0.7rem', marginLeft: '0.35rem' }}>[{col.type}]</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Preview Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading preview rows...</div>
      ) : previewData && previewData.rows.length > 0 ? (
        <div style={{ overflowX: 'auto', maxHeight: '350px' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                {previewData.columns.map((col, idx) => (
                  <th key={idx}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previewData.rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  <td style={{ color: 'var(--text-muted)' }}>{rIdx + 1}</td>
                  {previewData.columns.map((col, cIdx) => (
                    <td key={cIdx}>{row[col] !== undefined && row[col] !== null ? String(row[col]) : ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No preview rows loaded. Select dataset to preview.</div>
      )}
    </div>
  );
};
