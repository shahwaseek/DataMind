import React, { useState, useEffect, useCallback } from 'react';

interface ChartSpec {
  chart_type: 'bar' | 'line' | 'pie' | 'table';
  title: string;
  x_axis: string;
  y_axis: string[];
  data: Record<string, any>[];
}

interface ChartViewerProps {
  datasetId: string;
  datasetName: string;
}

export const ChartViewer: React.FC<ChartViewerProps> = ({ datasetId, datasetName }) => {
  const [chartSpec, setChartSpec] = useState<ChartSpec | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/datasets/${datasetId}/chart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql_query: 'SELECT * FROM dataset LIMIT 15', intent: 'top_n' }),
      });

      if (!res.ok) throw new Error('Failed to generate chart specification');

      const json = await res.json();
      setChartSpec(json.chart_spec);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Visualization error');
    } finally {
      setLoading(false);
    }
  }, [datasetId]);

  useEffect(() => {
    fetchChart();
  }, [fetchChart]);

  if (loading) {
    return (
      <div className="glass-card card" style={{ marginTop: '1.5rem', textAlign: 'center', padding: '2.5rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>📊 Recommending and rendering optimal visualization specs...</p>
      </div>
    );
  }

  if (error || !chartSpec || !chartSpec.data || chartSpec.data.length === 0) {
    return (
      <div className="glass-card card" style={{ marginTop: '1.5rem', color: '#ef4444' }}>
        ⚠️ {error || 'No chart data available to render'}
      </div>
    );
  }

  const yKey = chartSpec.y_axis[0] || 'value';
  const values = chartSpec.data.map((d) => Number(d[yKey]) || 0);
  const maxVal = Math.max(...values, 1);

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card card">
        <div className="card-header">
          <h3 className="card-title">
            <span className="card-icon">📈</span> {chartSpec.title}
          </h3>
          <span className="status-badge" style={{ color: 'var(--accent-cyan)' }}>
            Type: {chartSpec.chart_type.toUpperCase()}
          </span>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          Recommended for dataset <code>{datasetName}</code> ({chartSpec.data.length} data points)
        </p>

        {/* Bar Chart SVG Renderer */}
        <div style={{ background: 'rgba(10, 13, 20, 0.8)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', height: '240px', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
            {chartSpec.data.map((item, idx) => {
              const val = Number(item[yKey]) || 0;
              const heightPct = Math.max(8, Math.round((val / maxVal) * 100));

              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', marginBottom: '0.25rem', fontFamily: 'var(--font-mono)' }}>
                    {val.toLocaleString()}
                  </div>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '48px',
                      height: `${heightPct}%`,
                      background: 'linear-gradient(180deg, var(--accent-cyan), var(--accent-indigo))',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)',
                      transition: 'height 0.5s ease',
                    }}
                  />
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      marginTop: '0.5rem',
                      textAlign: 'center',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      maxWidth: '80px',
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>X-Axis: {chartSpec.x_axis}</span>
            <span>Y-Axis Metric: {yKey}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
