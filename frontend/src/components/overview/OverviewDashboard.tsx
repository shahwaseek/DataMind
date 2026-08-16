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
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Hero Welcome Card */}
      <div className="bg-surface-container border border-outline-variant p-8 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <h2 className="font-display text-3xl font-bold text-on-surface mb-2">
          Local-First AI Analytical Instrument
        </h2>
        <p className="font-body text-sm text-on-surface-variant max-w-2xl leading-relaxed mb-6">
          DataMind executes deterministic profiling, safe AST-validated DuckDB SQL queries, and evidence-backed AI analysis entirely on your local machine.
        </p>

        <div className="flex gap-4">
          <button className="btn-primary cursor-pointer" onClick={onNavigateToAnalyst}>
            <span className="material-symbols-outlined text-[18px]">psychology</span> Start AI Analysis →
          </button>
          <button className="btn-secondary cursor-pointer" onClick={onNavigateToDatasets}>
            <span className="material-symbols-outlined text-[18px]">folder</span> Manage Datasets ({datasets.length})
          </button>
        </div>
      </div>

      {/* Overview Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-surface-container border border-outline-variant p-6 rounded-lg">
          <div className="font-label text-xs text-on-surface-variant uppercase font-semibold mb-1">Active Project Datasets</div>
          <div className="font-display text-3xl font-bold text-on-surface">{datasets.length}</div>
          <div className="font-body text-xs text-on-surface-variant mt-1">Indexed in local SQLite / DuckDB</div>
        </div>

        <div className="bg-surface-container border border-outline-variant p-6 rounded-lg">
          <div className="font-label text-xs text-on-surface-variant uppercase font-semibold mb-1">Active Workspace Dataset</div>
          <div className="font-display text-lg font-bold text-primary truncate">
            {selectedDataset ? selectedDataset.name : 'None selected'}
          </div>
          <div className="font-body text-xs text-on-surface-variant mt-1">
            {selectedDataset ? `${selectedDataset.file_type.toUpperCase()} format` : 'Upload a dataset to begin'}
          </div>
        </div>

        <div className="bg-surface-container border border-outline-variant p-6 rounded-lg">
          <div className="font-label text-xs text-on-surface-variant uppercase font-semibold mb-1">Security & Execution Model</div>
          <div className="font-display text-lg font-bold text-success">100% Read-Only Guard</div>
          <div className="font-body text-xs text-on-surface-variant mt-1">DDL/DML & file access blocked</div>
        </div>
      </div>
    </div>
  );
};
