import React, { useState, useEffect, useCallback } from 'react';
import { ChartViewer } from '../ChartViewer';

interface AnalysisRecord {
  id: string;
  project_id: string;
  dataset_id: string;
  question: string;
  intent: string;
  explanation: string;
  generated_sql: string;
  execution_result: {
    columns: string[];
    rows: Record<string, any>[];
    total_rows: number;
    returned_rows: number;
    execution_time_ms: number;
    validation_status: string;
  };
  validation_status: string;
  model_identifier: string;
  execution_time_ms: number;
  created_at: string;
}

interface AnalystWorkspaceProps {
  projectId: string;
  datasetId: string;
  datasetName: string;
}

export const AnalystWorkspace: React.FC<AnalystWorkspaceProps> = ({ projectId, datasetId, datasetName }) => {
  const [question, setQuestion] = useState<string>('');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisRecord | null>(null);
  const [history, setHistory] = useState<AnalysisRecord[]>([]);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysisHistory = useCallback(async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/projects/${projectId}/analysis`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
        if (data.length > 0 && !currentAnalysis) {
          setCurrentAnalysis(data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch analysis history:', err);
    }
  }, [projectId, currentAnalysis]);

  useEffect(() => {
    fetchAnalysisHistory();
  }, [fetchAnalysisHistory]);

  const handleAskQuestion = async (qToSubmit?: string) => {
    const targetQ = qToSubmit || question;
    if (!targetQ.trim()) return;

    setAnalyzing(true);
    setError(null);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/v1/projects/${projectId}/datasets/${datasetId}/analysis`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: targetQ }),
        }
      );

      if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.detail || 'Analysis request failed');
      }

      const data: AnalysisRecord = await res.json();
      setCurrentAnalysis(data);
      setHistory((prev) => [data, ...prev]);
      setQuestion('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown analysis error');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRerun = async (analysisId: string) => {
    setAnalyzing(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/analysis/${analysisId}/rerun`, {
        method: 'POST',
      });
      if (res.ok) {
        const updated = await res.json();
        setCurrentAnalysis(updated);
      }
    } catch (err) {
      console.error('Failed to rerun analysis:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Central Input Hero (Matching Stitch Project Design) */}
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          What would you like to understand?
        </h2>
        <div className="badge-pill badge-purple" style={{ margin: '0 auto 1.5rem auto' }}>
          <span>📂</span>
          <span>Analyzing: {datasetName}</span>
        </div>

        {/* Glowing Input Box Card */}
        <div
          className="glass-panel"
          style={{
            padding: '1rem',
            textAlign: 'left',
            position: 'relative',
            border: '1px solid var(--border-glow)',
            boxShadow: '0 0 35px rgba(140, 128, 255, 0.15)',
          }}
        >
          <textarea
            rows={3}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              outline: 'none',
              resize: 'none',
            }}
            placeholder="Ask anything about your dataset in plain English..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAskQuestion())}
            disabled={analyzing}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              <span title="Read-only Execution Guard">🛡️ Read-Only Guard</span>
              <span>•</span>
              <span title="Ollama Model Identifier">🧠 Local Ollama</span>
            </div>

            <button className="btn-primary" onClick={() => handleAskQuestion()} disabled={analyzing}>
              {analyzing ? 'Analyzing Plan...' : 'Analyze →'}
            </button>
          </div>
        </div>

        {/* Suggested Chips */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          {[
            { label: '⭐ Top products & categories', q: 'Which category or region generated highest metrics?' },
            { label: '📈 Revenue & trend summary', q: 'How many total records exist in this dataset?' },
            { label: '🗺️ Compare metrics & averages', q: 'What is the average value for numeric columns?' },
            { label: '🔍 Find unusual patterns', q: 'Find top 5 records ordered by values' },
          ].map((chip, idx) => (
            <button
              key={idx}
              className="badge-pill"
              style={{ cursor: 'pointer', padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
              onClick={() => handleAskQuestion(chip.q)}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="glass-panel" style={{ borderLeft: '4px solid var(--accent-danger)', background: 'rgba(255, 107, 107, 0.1)', color: 'var(--accent-danger)', padding: '1rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Analysis Result Section */}
      {currentAnalysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* AI Evidence & Explanation Card */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span className="badge-pill badge-purple">INTENT: {currentAnalysis.intent.toUpperCase()}</span>
                <span className="badge-pill badge-emerald">✓ VALIDATION: {currentAnalysis.validation_status}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Model: <code style={{ color: 'var(--accent-cyan)' }}>{currentAnalysis.model_identifier}</code> | {currentAnalysis.execution_time_ms} ms
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Q: "{currentAnalysis.question}"
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              💡 <strong>AI Explanation:</strong> {currentAnalysis.explanation}
            </p>

            {/* Validated DuckDB SQL Pane */}
            <div style={{ background: 'var(--bg-darker)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.35rem', fontWeight: 600 }}>
                Validated DuckDB SQL Query
              </div>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {currentAnalysis.generated_sql}
              </code>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                style={{ fontSize: '0.85rem' }}
                onClick={() => handleRerun(currentAnalysis.id)}
                disabled={analyzing}
              >
                🔄 Re-run Analysis (Verify Reproducibility)
              </button>
            </div>
          </div>

          {/* Interactive Chart Viewer */}
          <ChartViewer datasetId={datasetId} datasetName={datasetName} />

          {/* Evidence Data Table */}
          {currentAnalysis.execution_result && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '1.05rem' }}>Evidence Result Data Table</h4>
                <span className="badge-pill badge-cyan">
                  {currentAnalysis.execution_result.returned_rows} rows returned
                </span>
              </div>

              <div style={{ overflowX: 'auto', maxHeight: '350px' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      {currentAnalysis.execution_result.columns.map((col, idx) => (
                        <th key={idx}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentAnalysis.execution_result.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td style={{ color: 'var(--text-muted)' }}>{rIdx + 1}</td>
                        {currentAnalysis.execution_result.columns.map((col, cIdx) => (
                          <td key={cIdx}>{row[col] !== undefined && row[col] !== null ? String(row[col]) : ''}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analysis History Side/Bottom List */}
          {history.length > 1 && (
            <div className="glass-panel" style={{ padding: '1.25rem' }}>
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1rem' }}>
                Analysis Execution History ({history.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {history.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '0.65rem 0.85rem',
                      background: currentAnalysis?.id === item.id ? 'rgba(140, 128, 255, 0.15)' : 'var(--surface-container)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.85rem',
                    }}
                    onClick={() => setCurrentAnalysis(item)}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>"{item.question}"</span>
                    <span className="badge-pill badge-purple" style={{ fontSize: '0.7rem' }}>{item.intent.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
