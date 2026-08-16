import React, { useState, useEffect, useCallback } from 'react';
import { ChartViewer } from '@/components/ChartViewer';

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
    <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full py-4">
      {/* Central Input Hero (Matching Stitch Exact HTML Markup) */}
      <div className="w-full text-center mb-6">
        <h2 className="font-display text-3xl font-semibold text-on-surface mb-2 tracking-tight">
          What would you like to understand?
        </h2>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant mb-6">
          <span className="material-symbols-outlined text-primary text-sm">database</span>
          <span className="font-code text-xs text-on-surface-variant">Analyzing: {datasetName}</span>
        </div>

        {/* Input Container with Glowing Gradient */}
        <div className="relative group text-left">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-inverse-primary rounded-xl opacity-20 group-hover:opacity-40 transition duration-500 blur-sm" />
          <div className="relative bg-surface-container border border-outline-variant rounded-xl p-3 flex flex-col gap-2 transition-colors focus-within:border-primary">
            <textarea
              className="w-full bg-transparent border-none resize-none font-body text-base text-on-surface placeholder:text-on-surface-variant focus:ring-0 p-2 outline-none"
              placeholder="Ask anything about your dataset..."
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAskQuestion())}
              disabled={analyzing}
            />

            <div className="flex items-center justify-between border-t border-outline-variant pt-2 px-2">
              <div className="flex gap-3 text-on-surface-variant text-xs items-center">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-success">verified_user</span>
                  Read-Only Guard
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-primary">psychology</span>
                  Local Ollama
                </span>
              </div>

              <button
                className="bg-primary text-on-primary px-4 py-1.5 rounded-lg font-body text-sm font-semibold flex items-center gap-2 hover:bg-primary-fixed transition-colors cursor-pointer"
                onClick={() => handleAskQuestion()}
                disabled={analyzing}
              >
                {analyzing ? 'Analyzing...' : 'Analyze'}
                <span className="material-symbols-outlined text-sm">send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Suggested Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {[
            { icon: 'star', label: 'Top products', q: 'Which category or region generated highest metrics?' },
            { icon: 'trending_up', label: 'Revenue trend', q: 'How many total records exist in this dataset?' },
            { icon: 'map', label: 'Regional performance', q: 'What is the average value for numeric columns?' },
            { icon: 'query_stats', label: 'Why did revenue decline?', q: 'Find top 5 records ordered by values' },
          ].map((chip, idx) => (
            <button
              key={idx}
              className="px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant font-label text-xs hover:bg-surface-container-high hover:text-on-surface transition-colors flex items-center gap-1 cursor-pointer"
              onClick={() => handleAskQuestion(chip.q)}
            >
              <span className="material-symbols-outlined text-[14px]">{chip.icon}</span>
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="w-full bg-error-container/20 border-l-4 border-danger p-4 rounded text-danger mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Result Display */}
      {currentAnalysis && (
        <div className="w-full flex flex-col gap-6 text-left">
          {/* AI Evidence Card */}
          <div className="bg-surface-container border-l-4 border-primary border border-outline-variant p-6 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="flex gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                  INTENT: {currentAnalysis.intent.toUpperCase()}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-success/20 text-success text-xs font-semibold">
                  ✓ VALIDATION: {currentAnalysis.validation_status}
                </span>
              </div>
              <div className="text-xs text-on-surface-variant">
                Model: <code className="text-primary">{currentAnalysis.model_identifier}</code> | {currentAnalysis.execution_time_ms} ms
              </div>
            </div>

            <h3 className="text-xl font-bold text-on-surface mb-2">Q: "{currentAnalysis.question}"</h3>
            <p className="text-on-surface-variant text-sm mb-4 leading-relaxed flex items-start gap-1.5">
              <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">lightbulb</span>
              <span><strong>AI Explanation:</strong> {currentAnalysis.explanation}</span>
            </p>

            {/* Validated DuckDB SQL Pane */}
            <div className="bg-surface-container-lowest p-3 rounded border border-outline-variant mb-4">
              <div className="text-xs text-primary font-semibold uppercase mb-1">Validated DuckDB SQL Query</div>
              <code className="font-code text-sm text-on-surface">{currentAnalysis.generated_sql}</code>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-surface-container-high hover:bg-surface-variant text-on-surface text-xs font-semibold py-1.5 px-3 rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                onClick={() => handleRerun(currentAnalysis.id)}
                disabled={analyzing}
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
                Re-run Analysis (Verify Reproducibility)
              </button>
            </div>
          </div>

          {/* Interactive Visualization Chart */}
          <ChartViewer datasetId={datasetId} datasetName={datasetName} />

          {/* Evidence Data Table */}
          {currentAnalysis.execution_result && (
            <div className="bg-surface-container border border-outline-variant p-6 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-on-surface">Evidence Result Data Table</h4>
                <span className="text-xs text-primary font-semibold">
                  {currentAnalysis.execution_result.returned_rows} rows returned
                </span>
              </div>

              <div className="overflow-x-auto max-h-[350px]">
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
                        <td className="text-on-surface-variant">{rIdx + 1}</td>
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

          {/* Analysis History List */}
          {history.length > 1 && (
            <div className="bg-surface-container border border-outline-variant p-4 rounded-lg">
              <h4 className="font-semibold text-on-surface text-sm mb-3">Analysis Execution History ({history.length})</h4>
              <div className="flex flex-col gap-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 rounded flex justify-between items-center cursor-pointer text-xs transition-colors ${
                      currentAnalysis?.id === item.id ? 'bg-primary/20 text-primary font-semibold' : 'bg-surface-container-low hover:bg-surface-container-high text-on-surface'
                    }`}
                    onClick={() => setCurrentAnalysis(item)}
                  >
                    <span>"{item.question}"</span>
                    <span className="px-2 py-0.5 rounded bg-primary/20 text-primary uppercase text-[10px]">
                      {item.intent}
                    </span>
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
