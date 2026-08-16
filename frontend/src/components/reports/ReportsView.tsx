import React, { useState } from 'react';

interface ReportsViewProps {
  projectId: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ projectId }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/projects/${projectId}/reports/generate`);
      if (!res.ok) {
        throw new Error('Failed to generate report');
      }
      const data = await res.json();
      setReport(data.report_markdown);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown report generation error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="flex justify-between items-center border-b border-outline-variant pb-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-on-surface mb-1">Executive Reports Generator</h2>
          <p className="font-body text-sm text-on-surface-variant">Compile evidence-backed executive markdown summaries for stakeholders.</p>
        </div>
        <button className="btn-primary" onClick={handleGenerateReport} disabled={loading}>
          <span className="material-symbols-outlined text-[18px]">description</span>
          {loading ? 'Generating...' : 'Generate Executive Report'}
        </button>
      </div>

      {error && (
        <div className="bg-error-container/20 border-l-4 border-danger p-4 rounded text-danger text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">warning</span>
          <span>{error}</span>
        </div>
      )}

      {report ? (
        <div className="bg-surface-container border border-outline-variant p-8 rounded-lg">
          <div className="flex justify-between items-center mb-6 border-b border-micro pb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">
              EXECUTIVE REPORT GENERATED
            </span>
            <button
              className="btn-secondary text-xs"
              onClick={() => navigator.clipboard.writeText(report)}
            >
              Copy Markdown
            </button>
          </div>
          <pre className="font-code text-sm text-on-surface whitespace-pre-wrap leading-relaxed">
            {report}
          </pre>
        </div>
      ) : (
        <div className="bg-surface-container border border-outline-variant p-12 rounded-lg text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-2xl">description</span>
          </div>
          <h3 className="font-display font-semibold text-on-surface text-base mb-1">No Report Generated Yet</h3>
          <p className="font-body text-xs text-on-surface-variant max-w-sm mx-auto mb-4">
            Click 'Generate Executive Report' above to synthesize dataset metadata, profile metrics, and AI analysis findings into a structured summary.
          </p>
        </div>
      )}
    </div>
  );
};
