import React, { useEffect, useState, useCallback } from 'react';

interface ChartSpec {
  chart_type: string;
  title: string;
  x_axis: string;
  y_axis: string;
  data: Record<string, any>[];
  recommendation_reason: string;
}

interface ChartViewerProps {
  datasetId: string;
  datasetName: string;
}

export const ChartViewer: React.FC<ChartViewerProps> = ({ datasetId, datasetName }) => {
  const [spec, setSpec] = useState<ChartSpec | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartSpec = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/datasets/${datasetId}/chart-spec`);
      if (!res.ok) {
        throw new Error('Failed to generate chart recommendation spec');
      }
      const data: ChartSpec = await res.json();
      setSpec(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown chart error');
    } finally {
      setLoading(false);
    }
  }, [datasetId]);

  useEffect(() => {
    fetchChartSpec();
  }, [fetchChartSpec]);

  if (loading) {
    return (
      <div className="glass-card card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="dropzone-icon">
          <span className="material-symbols-outlined text-primary text-3xl animate-spin">refresh</span>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>Recommending and rendering optimal visualization specs...</p>
      </div>
    );
  }

  if (error || !spec || spec.data.length === 0) {
    return (
      <div className="glass-card card" style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>
        <span className="material-symbols-outlined text-danger text-[18px] mr-1 align-sub">warning</span> {error || 'No chart data available to render'}
      </div>
    );
  }

  const maxY = Math.max(...spec.data.map((d) => Number(d[spec.y_axis]) || 0), 1);

  return (
    <div className="glass-card card" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h4 style={{ color: 'var(--text-primary)', fontSize: '1.05rem', fontWeight: 600 }}>
            {spec.title}
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Dataset: {datasetName} | Reason: {spec.recommendation_reason}
          </span>
        </div>

        <span className="badge-pill badge-cyan" style={{ fontSize: '0.7rem' }}>
          TYPE: {spec.chart_type.toUpperCase()}
        </span>
      </div>

      {/* Dynamic SVG Bar Chart Renderer */}
      <div style={{ background: 'var(--bg-darker)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '200px', width: '100%', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
          {spec.data.slice(0, 8).map((item, idx) => {
            const val = Number(item[spec.y_axis]) || 0;
            const heightPercent = Math.max(10, Math.min(100, (val / maxY) * 100));
            const label = String(item[spec.x_axis] || `Item ${idx + 1}`);

            return (
              <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifySelf: 'flex-end' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                  <div
                    style={{
                      width: '100%',
                      height: `${heightPercent}%`,
                      background: 'linear-gradient(180deg, var(--accent-cyan) 0%, rgba(6, 182, 212, 0.2) 100%)',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.5s ease',
                      position: 'relative',
                    }}
                    title={`${label}: ${val}`}
                  />
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)',
                    marginTop: '0.5rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '100%',
                  }}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>X-Axis: <strong>{spec.x_axis}</strong></span>
          <span>Y-Axis: <strong>{spec.y_axis}</strong></span>
        </div>
      </div>
    </div>
  );
};
