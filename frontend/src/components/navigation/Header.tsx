import React from 'react';

interface Project {
  id: string;
  name: string;
  dataset_count: number;
}

interface HeaderProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  backendHealthy: boolean;
  loadingBackend: boolean;
  onRefresh: () => void;
  onOpenPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  backendHealthy,
  loadingBackend,
  onRefresh,
  onOpenPalette,
}) => {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-240px)] h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant z-10 flex justify-between items-center px-6 transition-all duration-200">
      {/* Project Selector Breadcrumb */}
      <div className="flex items-center gap-4 h-full">
        {projects.length > 0 ? (
          <select
            className="bg-surface-container border border-outline-variant rounded py-1.5 px-3 font-body text-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
            value={selectedProjectId || ''}
            onChange={(e) => onSelectProject(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                Workspace: {p.name} ({p.dataset_count} datasets)
              </option>
            ))}
          </select>
        ) : (
          <span className="font-body text-sm text-on-surface-variant">No projects created yet</span>
        )}
      </div>

      {/* Right Action Bar & Search */}
      <div className="flex items-center gap-4">
        {/* Global Search Input triggering Command Palette */}
        <button
          onClick={onOpenPalette}
          className="relative bg-surface-container border border-outline-variant rounded-full py-1.5 pl-9 pr-4 text-left font-body text-sm text-on-surface-variant hover:border-primary hover:text-on-surface w-56 flex items-center justify-between transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">
            search
          </span>
          <span>Search or Ctrl+K...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest border border-micro font-code text-[10px]">
            ⌘K
          </kbd>
        </button>

        {/* Telemetry Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant text-xs font-semibold">
          <span
            className={`w-2 h-2 rounded-full ${
              loadingBackend ? 'bg-tertiary animate-pulse' : backendHealthy ? 'bg-success' : 'bg-danger'
            }`}
          />
          <span className="text-on-surface">
            {loadingBackend ? 'Connecting...' : backendHealthy ? 'Ollama & DuckDB Ready' : 'Offline'}
          </span>
        </div>

        <button
          className="text-on-surface-variant hover:text-on-surface transition-colors p-1 cursor-pointer"
          title="Refresh Workspace"
          onClick={onRefresh}
        >
          <span className="material-symbols-outlined text-[20px]">refresh</span>
        </button>

        <button className="text-on-surface-variant hover:text-on-surface transition-colors p-1 cursor-pointer" title="Help">
          <span className="material-symbols-outlined text-[20px]">help</span>
        </button>

        <button className="text-on-surface-variant hover:text-on-surface transition-colors p-1 relative cursor-pointer" title="Notifications">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-danger rounded-full" />
        </button>
      </div>
    </header>
  );
};
