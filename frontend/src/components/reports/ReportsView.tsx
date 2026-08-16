import React, { useState } from 'react';

interface ReportsViewProps {
  projectId: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ projectId }) => {
  const [reportMarkdown, setReportMarkdown] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/projects/${projectId}/reports/generate`);
      if (res.ok) {
        const json = await res.json();
        setReportMarkdown(json.report_markdown);
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.25rem', fontSize: '1.2rem' }}>
            📝 Executive Analytical Reports
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Generate a full evidence-backed markdown report summarizing datasets, quality scores, and analysis runs.
          </p>
        </div>
        <button className="btn-primary" onClick={handleGenerateReport} disabled={loading}>
          {loading ? 'Generating...' : '⚡ Generate Report'}
        </button>
      </div>

      {reportMarkdown && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
            {reportMarkdown}
          </pre>
        </div>
      )}
    </div>
  );
};
