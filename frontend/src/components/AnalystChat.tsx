import React, { useState, useEffect, useCallback } from 'react';

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
    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Natural Language Prompt Bar */}
      <div className="glass-card card">
        <div className="card-header">
          <h3 className="card-title">
            <span className="card-icon">🧠</span> Ask DataMind AI Analyst
          </h3>
          <span className="brand-badge">Evidence-Backed</span>
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>Suggested Questions:</span>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            onClick={() => handleAskQuestion('Which category or region generated highest metrics?')}
          >
            Highest Metrics
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            onClick={() => handleAskQuestion('How many total rows are in this dataset?')}
          >
            Total Row Count
          </button>
          <button
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
            onClick={() => handleAskQuestion('What is the average value for numeric columns?')}
          >
            Average Values
          </button>
        </div>

        {/* Question Input Form */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: 1, fontSize: '0.95rem' }}
            placeholder={`Ask a question about ${datasetName} in plain English...`}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
            disabled={analyzing}
          />
          <button className="btn btn-primary" onClick={() => handleAskQuestion()} disabled={analyzing}>
            {analyzing ? 'Analyzing...' : 'Ask AI'}
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="glass-card card" style={{ borderLeft: '4px solid #ef4444', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Current Analysis & Evidence View */}
      {currentAnalysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* AI Planning & Evidence Summary Card */}
          <div className="glass-card card" style={{ borderLeft: '4px solid var(--accent-indigo)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <span className="brand-badge" style={{ marginRight: '0.5rem' }}>Intent: {currentAnalysis.intent.toUpperCase()}</span>
                <span className="status-badge" style={{ color: 'var(--accent-green)' }}>
                  ✓ Validation: {currentAnalysis.validation_status}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Model: <code>{currentAnalysis.model_identifier}</code> | {currentAnalysis.execution_time_ms} ms
              </div>
            </div>

            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.15rem' }}>
              Q: "{currentAnalysis.question}"
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1rem' }}>
              💡 <strong>AI Explanation:</strong> {currentAnalysis.explanation}
            </p>

            {/* Generated SQL Code Block */}
            <div style={{ background: 'rgba(10, 13, 20, 0.9)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.25rem', fontWeight: 600 }}>
                Validated DuckDB SQL Query
              </div>
              <code style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                {currentAnalysis.generated_sql}
              </code>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}
                onClick={() => handleRerun(currentAnalysis.id)}
                disabled={analyzing}
              >
                🔄 Re-run Analysis (Verify Reproducibility)
              </button>
            </div>
          </div>

          {/* Results Table */}
          {currentAnalysis.execution_result && (
            <div className="glass-card card">
              <div className="card-header" style={{ marginBottom: '1rem' }}>
                <h4 style={{ color: 'var(--text-primary)' }}>Evidence Result Data Table</h4>
                <span className="status-badge" style={{ color: 'var(--accent-cyan)' }}>
                  {currentAnalysis.execution_result.returned_rows} rows returned
                </span>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      {currentAnalysis.execution_result.columns.map((col, cIdx) => (
                        <th key={cIdx}>{col}</th>
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

      {/* Analysis History Side Pane */}
      {history.length > 1 && (
        <div className="glass-card card" style={{ marginTop: '1rem' }}>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Analysis History ({history.length})</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {history.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '0.6rem 0.85rem',
                  background: currentAnalysis?.id === item.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(18, 24, 36, 0.5)',
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
                <span className="schema-type" style={{ fontSize: '0.75rem' }}>{item.intent.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
