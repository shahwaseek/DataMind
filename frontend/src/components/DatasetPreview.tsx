import React from 'react';

interface ColumnSchema {
  name: string;
  data_type: string;
  sample_values: any[];
}

interface DatasetPreviewProps {
  dataset: any;
  previewData: {
    columns: ColumnSchema[];
    row_count: number;
    preview_rows: Record<string, any>[];
  } | null;
  loading: boolean;
}

export const DatasetPreview: React.FC<DatasetPreviewProps> = ({ dataset, previewData, loading }) => {
  if (!dataset) return null;

  return (
    <div className="glass-card card" style={{ marginTop: '1.5rem' }}>
      <div className="card-header">
        <h3 className="card-title">
          <span className="card-icon">🔍</span> {dataset.name} — Schema & Row Preview
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span className="status-badge" style={{ color: 'var(--accent-cyan)' }}>
            Format: {dataset.file_type.toUpperCase()}
          </span>
          {previewData && (
            <span className="status-badge" style={{ color: 'var(--accent-green)' }}>
              Rows: {previewData.row_count.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)' }}>Loading dataset preview...</p>
      ) : !previewData ? (
        <p style={{ color: 'var(--text-muted)' }}>No preview available</p>
      ) : (
        <div>
          {/* Schema Badges */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
              Detected Column Schemas ({previewData.columns.length})
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {previewData.columns.map((col, idx) => (
                <span className="schema-pill" key={idx}>
                  <strong>{col.name}</strong>
                  <span className="schema-type">({col.data_type})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Row Preview Data Table */}
          <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            First {previewData.preview_rows.length} Data Rows
          </h4>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  {previewData.columns.map((col, idx) => (
                    <th key={idx}>{col.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.preview_rows.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td style={{ color: 'var(--text-muted)' }}>{rIdx + 1}</td>
                    {previewData.columns.map((col, cIdx) => (
                      <td key={cIdx}>{row[col.name] !== undefined ? String(row[col.name]) : ''}</td>
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
