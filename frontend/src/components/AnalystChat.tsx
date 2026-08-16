import React, { useState, useEffect, useCallback } from 'react';
import { ChartViewer } from './ChartViewer';

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

interface AnalystChatProps {
  projectId: string;
  datasetId: string;
  datasetName: string;
}

export const AnalystChat: React.FC<AnalystChatProps> = ({ projectId, datasetId, datasetName }) => {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Question Input Card */}
      <div className="glass-card card" style={{ borderLeft: '4px solid var(--accent-indigo)' }}>
        <div className="card-header" style={{ marginBottom: '0.75rem' }}>
          <h3 className="card-title">
            <span className="material-symbols-outlined text-primary text-[20px]">psychology</span> AI Analyst Assistant
          </h3>
          <span className="brand-badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-indigo)' }}>
            Active Dataset: {datasetName}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <textarea
            className="form-input"
            rows={3}
            style={{ width: '100%', resize: 'vertical' }}
            placeholder={`Ask any natural-language question about ${datasetName}... (e.g. 'What are the top 5 regions by total revenue?')`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={analyzing}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                'Top records by metric',
                'Average values & count',
                'Highest values grouped by region',
              ].map((suggest, idx) => (
                <button
                  key={idx}
                  className="btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                  onClick={() => handleAskQuestion(suggest)}
                >
                  {suggest}
                </button>
              ))}
            </div>

            <button
              className="btn-primary"
              onClick={() => handleAskQuestion()}
              disabled={analyzing || !question.trim()}
            >
              {analyzing ? 'Analyzing Plan...' : 'Submit Question →'}
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert Banner */}
      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', borderLeft: '4px solid #ef4444', color: '#f87171', borderRadius: '8px' }}>
          <span className="material-symbols-outlined text-[18px] mr-1 align-sub">warning</span> {error}
        </div>
      )}

      {/* Current Analysis Output Card */}
      {currentAnalysis && (
        <div className="glass-card card" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className="badge-pill" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-indigo)' }}>
                INTENT: {currentAnalysis.intent.toUpperCase()}
              </span>
              <span className="badge-pill badge-emerald">
                ✓ VALIDATION: {currentAnalysis.validation_status}
              </span>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Model: <code style={{ color: 'var(--accent-cyan)' }}>{currentAnalysis.model_identifier}</code> | Latency: {currentAnalysis.execution_time_ms} ms
            </div>
          </div>

          <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Q: "{currentAnalysis.question}"
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem' }}>
            <span className="material-symbols-outlined text-primary text-[18px] mr-1 align-sub">lightbulb</span> <strong>AI Explanation:</strong> {currentAnalysis.explanation}
          </p>

          {/* Validated SQL Display Pane */}
          <div style={{ background: 'var(--bg-darker)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.25rem', fontWeight: 600 }}>
              Validated DuckDB SQL Query
            </div>
            <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              {currentAnalysis.generated_sql}
            </code>
          </div>

          {/* Re-run Reproducibility Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <button
              className="btn-secondary"
              style={{ fontSize: '0.8rem' }}
              onClick={() => handleRerun(currentAnalysis.id)}
              disabled={analyzing}
            >
              🔄 Re-run Analysis (Verify Reproducibility)
            </button>
          </div>

          {/* Visualization Component */}
          <ChartViewer datasetId={datasetId} datasetName={datasetName} />

          {/* Result Data Table */}
          {currentAnalysis.execution_result && (
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h5 style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Execution Data Result</h5>
                <span className="badge-pill badge-cyan" style={{ fontSize: '0.7rem' }}>
                  {currentAnalysis.execution_result.returned_rows} rows returned
                </span>
              </div>

              <div style={{ overflowX: 'auto', maxHeight: '300px' }}>
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
        </div>
      )}

      {/* History Drawer List */}
      {history.length > 1 && (
        <div className="glass-card card">
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
            Analysis History ({history.length})
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {history.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '0.5rem 0.75rem',
                  background: currentAnalysis?.id === item.id ? 'rgba(99, 102, 241, 0.15)' : 'var(--surface-container)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem',
                }}
                onClick={() => setCurrentAnalysis(item)}
              >
                <span style={{ color: 'var(--text-primary)' }}>"{item.question}"</span>
                <span className="badge-pill" style={{ fontSize: '0.65rem' }}>{item.intent.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
