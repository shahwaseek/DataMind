import React, { useState } from 'react';
import { DatasetUpload } from '@/components/DatasetUpload';
import { DatasetPreview } from '@/components/DatasetPreview';
import { DatasetProfileView } from '@/components/DatasetProfile';
import { SQLConsole } from '@/components/SQLConsole';

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
    <div className="flex flex-col gap-6">
      {/* File Upload Zone */}
      <DatasetUpload projectId={projectId} onUploadSuccess={onUploadSuccess} />

      {/* Dataset Grid List */}
      {datasets.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-base text-on-surface mb-4">
            Workspace Datasets ({datasets.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {datasets.map((ds) => {
              const isSelected = selectedDataset?.id === ds.id;
              return (
                <div
                  key={ds.id}
                  className={`bg-surface-container border p-5 rounded-lg cursor-pointer transition-all ${
                    isSelected ? 'border-primary bg-primary/10 hardware-glow' : 'border-outline-variant hover:border-primary/50 hover:bg-surface-container-high'
                  }`}
                  onClick={() => onSelectDataset(ds)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <strong className="font-display font-semibold text-on-surface text-sm">{ds.name}</strong>
                    <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-code text-[10px] uppercase font-bold">
                      {ds.file_type}
                    </span>
                  </div>
                  <div className="font-body text-xs text-on-surface-variant flex flex-col gap-1">
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
            <div className="mt-8">
              <div className="flex gap-3 border-b border-outline-variant pb-3 mb-6">
                <button
                  className={`px-4 py-2 rounded font-body text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  <span className="material-symbols-outlined text-[18px]">analytics</span>
                  Quality Profile & Intelligence
                </button>
                <button
                  className={`px-4 py-2 rounded font-body text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high'
                  }`}
                  onClick={() => setActiveTab('preview')}
                >
                  <span className="material-symbols-outlined text-[18px]">table_view</span>
                  Row Data Preview
                </button>
                <button
                  className={`px-4 py-2 rounded font-body text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'sql'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high'
                  }`}
                  onClick={() => setActiveTab('sql')}
                >
                  <span className="material-symbols-outlined text-[18px]">terminal</span>
                  DuckDB SQL Console
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
