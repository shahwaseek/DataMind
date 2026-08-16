import { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/navigation/Sidebar';
import { Header } from './components/navigation/Header';
import { OverviewDashboard } from './components/overview/OverviewDashboard';
import { DatasetExplorer } from './components/datasets/DatasetExplorer';
import { AnalystWorkspace } from './components/analyst/AnalystWorkspace';
import { InsightsView } from './components/insights/InsightsView';
import { ReportsView } from './components/reports/ReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { ProjectModal } from './components/ProjectModal';
import { LegalModal } from './components/LegalModal';

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
  
  const [activeTab, setActiveTab] = useState<'overview' | 'datasets' | 'analyst' | 'insights' | 'reports' | 'settings'>('analyst');
  
  const [loadingBackend, setLoadingBackend] = useState<boolean>(true);
  const [backendHealthy, setBackendHealthy] = useState<boolean>(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

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
          setSelectedDataset(data[0]);
        } else {
          setSelectedDataset(null);
        }
      }
    } catch (err) {
      console.error('Failed to fetch datasets:', err);
    }
  }, []);

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
    setSelectedDataset(newDataset);
    fetchProjects();
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--bg-dark)' }}>
      {/* Left Sidebar Navigation (240px) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewProject={() => setIsProjectModalOpen(true)}
      />

      {/* Top Header Bar */}
      <Header
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        backendHealthy={backendHealthy}
        loadingBackend={loadingBackend}
        onRefresh={fetchProjects}
      />

      {/* Main Workspace Area */}
      <main
        style={{
          marginLeft: 'var(--sidebar-width)',
          marginTop: 'var(--header-height)',
          width: 'calc(100vw - var(--sidebar-width))',
          height: 'calc(100vh - var(--header-height))',
          overflowY: 'auto',
          position: 'relative',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Ambient Grid Pattern */}
        <div className="bg-ambient-pattern" />

        {/* Content View Routing */}
        <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
          {selectedProjectId ? (
            activeTab === 'overview' ? (
              <OverviewDashboard
                datasets={datasets}
                selectedDataset={selectedDataset}
                onNavigateToAnalyst={() => setActiveTab('analyst')}
                onNavigateToDatasets={() => setActiveTab('datasets')}
              />
            ) : activeTab === 'datasets' ? (
              <DatasetExplorer
                projectId={selectedProjectId}
                datasets={datasets}
                selectedDataset={selectedDataset}
                onSelectDataset={setSelectedDataset}
                onUploadSuccess={handleUploadSuccess}
              />
            ) : activeTab === 'analyst' ? (
              selectedDataset ? (
                <AnalystWorkspace
                  projectId={selectedProjectId}
                  datasetId={selectedDataset.id}
                  datasetName={selectedDataset.name}
                />
              ) : (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                  <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Upload a Dataset to Begin</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Select or upload a CSV, XLSX, JSON, or Parquet dataset to activate AI query analysis.
                  </p>
                  <button className="btn-primary" onClick={() => setActiveTab('datasets')}>
                    📁 Go to Dataset Ingestion →
                  </button>
                </div>
              )
            ) : activeTab === 'insights' ? (
              <InsightsView datasetName={selectedDataset ? selectedDataset.name : 'Workspace'} />
            ) : activeTab === 'reports' ? (
              <ReportsView projectId={selectedProjectId} />
            ) : (
              <SettingsView />
            )
          ) : (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '2rem auto' }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1.4rem' }}>
                Welcome to DataMind
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', lineHeight: '1.6' }}>
                Create your first analytical workspace to upload datasets and begin evidence-backed AI analysis.
              </p>
              <button className="btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }} onClick={() => setIsProjectModalOpen(true)}>
                + Create First Workspace Project
              </button>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <footer style={{ position: 'relative', zIndex: 1, marginTop: '3rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div>DataMind Local AI Data Analyst &copy; 2026. Impeccable Design & Evidence Engine.</div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setLegalModalType('privacy')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setLegalModalType('terms')}
              style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Terms & Conditions
            </button>
          </div>
        </footer>
      </main>

      {/* New Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

      {/* Legal Modal */}
      <LegalModal
        isOpen={legalModalType !== null}
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
