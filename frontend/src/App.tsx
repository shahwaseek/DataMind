import { useState, useEffect, useCallback } from 'react';
import { ProjectModal } from './components/ProjectModal';
import { DatasetUpload } from './components/DatasetUpload';
import { DatasetPreview } from './components/DatasetPreview';
import { DatasetProfileView } from './components/DatasetProfile';
import { SQLConsole } from './components/SQLConsole';
import { AnalystChat } from './components/AnalystChat';
import { ChartViewer } from './components/ChartViewer';

interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  dataset_count: number;
}

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

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [previewData, setPreviewData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'profile' | 'preview' | 'sql' | 'chart'>('chat');
  
  const [loadingBackend, setLoadingBackend] = useState<boolean>(true);
  const [backendHealthy, setBackendHealthy] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loadingPreview, setLoadingPreview] = useState<boolean>(false);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
        setBackendHealthy(true);
        if (data.length > 0 && !selectedProjectId) {
          setSelectedProjectId(data[0].id);
        }
      }
    } catch {
      setBackendHealthy(false);
    } finally {
      setLoadingBackend(false);
    }
  }, [selectedProjectId]);

  const fetchProjectDatasets = useCallback(async (projId: string) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/projects/${projId}/datasets`);
      if (res.ok) {
        const data = await res.json();
        setDatasets(data);
        if (data.length > 0) {
          handleSelectDataset(data[0]);
        } else {
          setSelectedDataset(null);
          setPreviewData(null);
        }
      }
    } catch (err) {
      console.error('Failed to fetch datasets:', err);
    }
  }, []);

  const handleSelectDataset = async (dataset: Dataset) => {
    setSelectedDataset(dataset);
    setLoadingPreview(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/datasets/${dataset.id}/preview`);
      if (res.ok) {
        const preview = await res.json();
        setPreviewData(preview);
      }
    } catch (err) {
      console.error('Failed to fetch dataset preview:', err);
    } finally {
      setLoadingPreview(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectDatasets(selectedProjectId);
    }
  }, [selectedProjectId, fetchProjectDatasets]);

  const handleProjectCreated = (newProj: Project) => {
    setProjects((prev) => [newProj, ...prev]);
    setSelectedProjectId(newProj.id);
  };

  const handleUploadSuccess = (newDataset: Dataset) => {
    setDatasets((prev) => [newDataset, ...prev]);
    handleSelectDataset(newDataset);
    fetchProjects();
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-logo">DM</div>
          <div>
            <span className="brand-title">DataMind</span>
            <span className="brand-badge" style={{ marginLeft: '8px' }}>Phase 6 & 7</span>
          </div>
        </div>

        <div className="nav-status">
          <div className="status-badge">
            <span
              className={`status-indicator ${
                loadingBackend ? 'loading' : backendHealthy ? 'healthy' : 'offline'
              }`}
            />
            <span>
              {loadingBackend
                ? 'Connecting...'
                : backendHealthy
                ? 'Backend Ready'
                : 'Backend Disconnected'}
            </span>
          </div>
          <button className="btn btn-secondary" onClick={fetchProjects}>
            Refresh API
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Action Header */}
        <div className="action-row">
          <div className="project-select">
            <label style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Active Workspace:</label>
            {projects.length > 0 ? (
              <select
                className="select-dropdown"
                value={selectedProjectId || ''}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.dataset_count} datasets)
                  </option>
                ))}
              </select>
            ) : (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No projects created yet</span>
            )}
          </div>

          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            + New Project
          </button>
        </div>

        {/* Ingestion & Dataset Section */}
        {selectedProjectId ? (
          <div>
            <DatasetUpload projectId={selectedProjectId} onUploadSuccess={handleUploadSuccess} />

            {/* Ingested Datasets List */}
            {datasets.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  Workspace Datasets ({datasets.length})
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {datasets.map((ds) => (
                    <div
                      key={ds.id}
                      className="glass-card card"
                      style={{
                        cursor: 'pointer',
                        borderColor: selectedDataset?.id === ds.id ? 'var(--accent-cyan)' : 'var(--border-color)',
                      }}
                      onClick={() => handleSelectDataset(ds)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{ds.name}</strong>
                        <span className="brand-badge" style={{ fontSize: '0.65rem' }}>{ds.file_type.toUpperCase()}</span>
                      </div>
                      <div className="info-list" style={{ gap: '0.4rem', fontSize: '0.8rem' }}>
                        <div className="info-item">
                          <span className="info-label">Size</span>
                          <span className="info-value">{(ds.file_size_bytes / 1024).toFixed(1)} KB</span>
                        </div>
                        {ds.latest_version && (
                          <div className="info-item">
                            <span className="info-label">Rows × Cols</span>
                            <span className="info-value">
                              {ds.latest_version.row_count} × {ds.latest_version.column_count}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* View Tabs */}
                {selectedDataset && (
                  <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                      <button
                        className={`btn ${activeTab === 'chat' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('chat')}
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
                      >
                        💬 AI Analyst Chat
                      </button>
                      <button
                        className={`btn ${activeTab === 'chart' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('chart')}
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
                      >
                        📈 Visualizations
                      </button>
                      <button
                        className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('profile')}
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
                      >
                        📊 Quality Profile & Intelligence
                      </button>
                      <button
                        className={`btn ${activeTab === 'preview' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('preview')}
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
                      >
                        🔍 Row Data Preview
                      </button>
                      <button
                        className={`btn ${activeTab === 'sql' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setActiveTab('sql')}
                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
                      >
                        ⚡ DuckDB SQL Console
                      </button>
                    </div>

                    {activeTab === 'chat' ? (
                      <AnalystChat projectId={selectedProjectId} datasetId={selectedDataset.id} datasetName={selectedDataset.name} />
                    ) : activeTab === 'chart' ? (
                      <ChartViewer datasetId={selectedDataset.id} datasetName={selectedDataset.name} />
                    ) : activeTab === 'profile' ? (
                      <DatasetProfileView datasetId={selectedDataset.id} />
                    ) : activeTab === 'preview' ? (
                      <DatasetPreview dataset={selectedDataset} previewData={previewData} loading={loadingPreview} />
                    ) : (
                      <SQLConsole datasetId={selectedDataset.id} datasetName={selectedDataset.name} />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card card" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Get Started by Creating a Project</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
              Create an analytical workspace to upload and profile CSV, Excel, JSON, and Parquet data files.
            </p>
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
              + Create First Project
            </button>
          </div>
        )}
      </main>

      {/* New Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {/* Footer */}
      <footer>
        <p>DataMind Local AI Data Analyst &copy; 2026. Phase 6 & 7 — Benchmark Suite & Visualization Engine Verified.</p>
      </footer>
    </div>
  );
}
