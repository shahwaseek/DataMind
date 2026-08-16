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
}

export const Header: React.FC<HeaderProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  backendHealthy,
  loadingBackend,
  onRefresh,
}) => {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 'calc(100% - var(--sidebar-width))',
        height: 'var(--header-height)',
        background: 'rgba(12, 20, 30, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        zIndex: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 1.5rem',
      }}
    >
      {/* Project Selector Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Workspace:</span>
        {projects.length > 0 ? (
          <select
            className="form-input"
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.85rem',
              width: 'auto',
              minWidth: '200px',
              cursor: 'pointer',
            }}
            value={selectedProjectId || ''}
            onChange={(e) => onSelectProject(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.dataset_count} datasets)
              </option>
            ))}
          </select>
        ) : (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No projects created yet</span>
        )}
      </div>

      {/* Right Action Bar & Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Global Search Bar */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search datasets, SQL, insights..."
            style={{
              paddingLeft: '2.2rem',
              width: '220px',
              fontSize: '0.8rem',
              borderRadius: '9999px',
            }}
          />
          <span
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
            }}
          >
            🔍
          </span>
        </div>

        {/* Backend & Ollama Telemetry Status Badge */}
        <div
          className="badge-pill"
          style={{
            borderColor: loadingBackend
              ? 'var(--accent-warning)'
              : backendHealthy
              ? 'rgba(16, 185, 129, 0.4)'
              : 'rgba(255, 107, 107, 0.4)',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: loadingBackend
                ? 'var(--accent-warning)'
                : backendHealthy
                ? 'var(--accent-emerald)'
                : 'var(--accent-danger)',
              boxShadow: backendHealthy ? '0 0 10px var(--accent-emerald)' : 'none',
            }}
          />
          <span style={{ color: 'var(--text-primary)' }}>
            {loadingBackend ? 'Connecting...' : backendHealthy ? 'Ollama & DuckDB Ready' : 'Offline'}
          </span>
        </div>

        <button className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={onRefresh}>
          🔄 Refresh
        </button>
      </div>
    </header>
  );
};
