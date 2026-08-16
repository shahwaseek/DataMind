import { useState, useEffect, useCallback } from 'react';
import { LandingPage } from './components/pages/LandingPage';
import { LoginPage } from './components/pages/LoginPage';
import { Sidebar } from './components/navigation/Sidebar';
import { Header } from './components/navigation/Header';
import { MobileBottomNav } from './components/navigation/MobileBottomNav';
import { CommandPalette } from './components/navigation/CommandPalette';
import { OverviewDashboard } from './components/overview/OverviewDashboard';
import { DatasetExplorer } from './components/datasets/DatasetExplorer';
import { AnalystWorkspace } from './components/analyst/AnalystWorkspace';
import { InsightsView } from './components/insights/InsightsView';
import { ReportsView } from './components/reports/ReportsView';
import { EvaluationView } from './components/evaluation/EvaluationView';
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
  const [viewMode, setViewMode] = useState<'app' | 'landing' | 'login'>('app');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'datasets' | 'analyst' | 'insights' | 'reports' | 'evaluation' | 'settings'>('analyst');
  
  const [loadingBackend, setLoadingBackend] = useState<boolean>(true);
  const [backendHealthy, setBackendHealthy] = useState<boolean>(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
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

  const handlePaletteAction = (action: string) => {
    if (action === 'open_palette') {
      setIsPaletteOpen(true);
      return;
    }
    if (['overview', 'datasets', 'analyst', 'insights', 'reports', 'evaluation', 'settings'].includes(action)) {
      setActiveTab(action as any);
    }
  };

  if (viewMode === 'landing') {
    return <LandingPage onTryDataMind={() => setViewMode('app')} onLogin={() => setViewMode('login')} />;
  }

  if (viewMode === 'login') {
    return <LoginPage onSuccess={() => setViewMode('app')} onBackToLanding={() => setViewMode('landing')} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Left Sidebar Navigation (240px Desktop) */}
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
        onOpenPalette={() => setIsPaletteOpen(true)}
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

        {/* View Routing */}
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
                <div className="bg-surface-container border border-outline-variant p-10 rounded-lg text-center max-w-lg mx-auto">
                  <h3 className="text-on-surface text-xl font-bold mb-2">Upload a Dataset to Begin</h3>
                  <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                    Select or upload a CSV, XLSX, JSON, or Parquet dataset to activate AI query analysis.
                  </p>
                  <button className="btn-primary" onClick={() => setActiveTab('datasets')}>
                    <span className="material-symbols-outlined text-[18px]">folder</span> Go to Dataset Ingestion →
                  </button>
                </div>
              )
            ) : activeTab === 'insights' ? (
              <InsightsView datasetName={selectedDataset ? selectedDataset.name : 'Workspace'} />
            ) : activeTab === 'reports' ? (
              <ReportsView projectId={selectedProjectId} />
            ) : activeTab === 'evaluation' ? (
              <EvaluationView />
            ) : (
              <SettingsView />
            )
          ) : (
            <div className="bg-surface-container border border-outline-variant p-12 rounded-lg text-center max-w-md mx-auto my-12">
              <h3 className="text-on-surface text-xl font-bold mb-2">Welcome to DataMind</h3>
              <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                Create your first analytical workspace to upload datasets and begin evidence-backed AI analysis.
              </p>
              <button className="btn-primary w-full justify-center" onClick={() => setIsProjectModalOpen(true)}>
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
              onClick={() => setViewMode('landing')}
              style={{ background: 'none', border: 'none', color: '#c6bfff', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Landing Page
            </button>
            <span>•</span>
            <button
              onClick={() => setLegalModalType('privacy')}
              style={{ background: 'none', border: 'none', color: '#c6bfff', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              onClick={() => setLegalModalType('terms')}
              style={{ background: 'none', border: 'none', color: '#c6bfff', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Terms & Conditions
            </button>
          </div>
        </footer>
      </main>

      {/* Mobile Phone View Bottom Navigation (Hidden on Desktop) */}
      <MobileBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Command Palette (Ctrl+K) Overlay */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelectAction={handlePaletteAction}
      />

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
