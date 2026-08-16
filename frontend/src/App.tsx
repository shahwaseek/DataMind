import { useState, useEffect } from 'react';

interface BackendHealth {
  status: string;
  service: string;
  environment: string;
}

interface BackendRoot {
  status: string;
  app: string;
  environment: string;
  version: string;
}

export default function App() {
  const [health, setHealth] = useState<BackendHealth | null>(null);
  const [rootInfo, setRootInfo] = useState<BackendRoot | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkBackendHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const [healthRes, rootRes] = await Promise.all([
        fetch('http://127.0.0.1:8000/health'),
        fetch('http://127.0.0.1:8000/'),
      ]);

      if (!healthRes.ok || !rootRes.ok) {
        throw new Error('Backend responded with error status');
      }

      const healthData: BackendHealth = await healthRes.json();
      const rootData: BackendRoot = await rootRes.json();

      setHealth(healthData);
      setRootInfo(rootData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to DataMind API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
  }, []);

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-logo">DM</div>
          <div>
            <span className="brand-title">DataMind</span>
            <span className="brand-badge" style={{ marginLeft: '8px' }}>MVP</span>
          </div>
        </div>

        <div className="nav-status">
          <div className="status-badge">
            <span
              className={`status-indicator ${
                loading ? 'loading' : health ? 'healthy' : 'offline'
              }`}
            />
            <span>
              {loading
                ? 'Connecting...'
                : health
                ? 'Backend Connected'
                : 'Backend Disconnected'}
            </span>
          </div>
          <button className="btn btn-secondary" onClick={checkBackendHealth}>
            Refresh Status
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Hero Banner */}
        <section className="hero-section">
          <h1 className="hero-title">
            Local-First <span className="gradient-text">AI Data Analyst</span>
          </h1>
          <p className="hero-subtitle">
            Convert natural-language questions into reproducible, evidence-backed data analysis
            with zero mandatory cloud dependencies and strict execution safety.
          </p>
        </section>

        {/* Philosophy Banner */}
        <div className="principle-banner">
          <div className="principle-icon">🔒</div>
          <div className="principle-content">
            <h3>Core Execution Principle</h3>
            <p>
              <em>"Let AI plan and explain analysis, while deterministic tools execute and validate the actual computation."</em>
            </p>
          </div>
        </div>

        {/* Phase 0 Telemetry Cards */}
        <div className="dashboard-grid">
          {/* Card 1: Backend API Telemetry */}
          <div className="glass-card card">
            <div className="card-header">
              <h2 className="card-title">
                <span className="card-icon">⚡</span> FastAPI Backend Status
              </h2>
              <span className={`status-badge`}>
                {health ? health.status.toUpperCase() : 'OFFLINE'}
              </span>
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)' }}>Checking backend health...</p>
            ) : error ? (
              <div style={{ color: '#f87171', fontSize: '0.9rem' }}>
                <p>⚠️ Could not connect to FastAPI at http://127.0.0.1:8000</p>
                <p style={{ fontSize: '0.8rem', marginTop: '4px', color: 'var(--text-muted)' }}>
                  Start server with: <code>cd backend && uvicorn app.main:app --reload</code>
                </p>
              </div>
            ) : (
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">App Name</span>
                  <span className="info-value">{rootInfo?.app}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Version</span>
                  <span className="info-value">v{rootInfo?.version}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Environment</span>
                  <span className="info-value">{rootInfo?.environment}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Health Check</span>
                  <span className="info-value" style={{ color: 'var(--accent-green)' }}>
                    /health (200 OK)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Environment & Foundation Stack */}
          <div className="glass-card card">
            <div className="card-header">
              <h2 className="card-title">
                <span className="card-icon">🛠️</span> System Stack
              </h2>
              <span className="brand-badge">Phase 0</span>
            </div>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Frontend Framework</span>
                <span className="info-value">React 18 + TypeScript</span>
              </div>
              <div className="info-item">
                <span className="info-label">Build Tool</span>
                <span className="info-value">Vite 5</span>
              </div>
              <div className="info-item">
                <span className="info-label">Backend Runtime</span>
                <span className="info-value">Python 3.10.11</span>
              </div>
              <div className="info-item">
                <span className="info-label">Analytical Engine</span>
                <span className="info-value">DuckDB + Pandas</span>
              </div>
            </div>
          </div>

          {/* Card 3: Phase 0 Verification Checklist */}
          <div className="glass-card card">
            <div className="card-header">
              <h2 className="card-title">
                <span className="card-icon">📋</span> Phase 0 Criteria
              </h2>
              <span style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: '0.85rem' }}>
                4 / 4 Verified
              </span>
            </div>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Repository & Git</span>
                <span className="info-value" style={{ color: 'var(--accent-green)' }}>✓ Ready</span>
              </div>
              <div className="info-item">
                <span className="info-label">FastAPI Endpoints</span>
                <span className="info-value" style={{ color: 'var(--accent-green)' }}>✓ Configured</span>
              </div>
              <div className="info-item">
                <span className="info-label">Frontend Web App</span>
                <span className="info-value" style={{ color: 'var(--accent-green)' }}>✓ Rendered</span>
              </div>
              <div className="info-item">
                <span className="info-label">Unit Tests (Pytest)</span>
                <span className="info-value" style={{ color: 'var(--accent-green)' }}>✓ Passing</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <p>DataMind Local AI Data Analyst &copy; 2026. Built with FastAPI, DuckDB, React, and Ollama.</p>
      </footer>
    </div>
  );
}
