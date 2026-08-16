import React, { useState } from 'react';
import { DatasetUpload } from '../DatasetUpload';
import { DatasetPreview } from '../DatasetPreview';
import { DatasetProfileView } from '../DatasetProfile';
import { SQLConsole } from '../SQLConsole';

interface Dataset {
  id: string;
  project_id: string;
  name: string;
  file_type: string;
  file_size_bytes: number;
  created_at: string;
  latest_version?: {
    row_count: number;
    column_count: number;
    columns: any[];
  };
}

interface DatasetExplorerProps {
  projectId: string;
  datasets: Dataset[];
  selectedDataset: Dataset | null;
  onSelectDataset: (dataset: Dataset) => void;
  onUploadSuccess: (dataset: Dataset) => void;
}

export const DatasetExplorer: React.FC<DatasetExplorerProps> = ({
  projectId,
  datasets,
  selectedDataset,
  onSelectDataset,
  onUploadSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preview' | 'sql'>('profile');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* File Upload Zone */}
      <DatasetUpload projectId={projectId} onUploadSuccess={onUploadSuccess} />

      {/* Dataset Grid List */}
      {datasets.length > 0 && (
        <div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>
            Workspace Datasets ({datasets.length})
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {datasets.map((ds) => {
              const isSelected = selectedDataset?.id === ds.id;
              return (
                <div
                  key={ds.id}
                  className="glass-panel glass-panel-hover"
                  style={{
                    padding: '1.25rem',
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    background: isSelected ? 'rgba(140, 128, 255, 0.12)' : 'var(--surface-container)',
                  }}
                  onClick={() => onSelectDataset(ds)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{ds.name}</strong>
                    <span className="badge-pill badge-cyan" style={{ fontSize: '0.65rem' }}>{ds.file_type.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div>Size: {(ds.file_size_bytes / 1024).toFixed(1)} KB</div>
                    {ds.latest_version && (
                      <div>Dimensions: {ds.latest_version.row_count} rows × {ds.latest_version.column_count} cols</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Dataset Views */}
          {selectedDataset && (
            <div style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
                <button
                  className={`btn-secondary ${activeTab === 'profile' ? 'btn-primary' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  📊 Quality Profile & Intelligence
                </button>
                <button
                  className={`btn-secondary ${activeTab === 'preview' ? 'btn-primary' : ''}`}
                  onClick={() => setActiveTab('preview')}
                >
                  🔍 Row Data Preview
                </button>
                <button
                  className={`btn-secondary ${activeTab === 'sql' ? 'btn-primary' : ''}`}
                  onClick={() => setActiveTab('sql')}
                >
                  ⚡ DuckDB SQL Console
                </button>
              </div>

              {activeTab === 'profile' ? (
                <DatasetProfileView datasetId={selectedDataset.id} />
              ) : activeTab === 'preview' ? (
                <DatasetPreview dataset={selectedDataset} previewData={null} loading={false} />
              ) : (
                <SQLConsole datasetId={selectedDataset.id} datasetName={selectedDataset.name} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
