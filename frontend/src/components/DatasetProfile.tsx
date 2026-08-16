import React, { useEffect, useState, useCallback } from 'react';

interface ColumnProfile {
  name: string;
  type: string;
  null_count: number;
  unique_count: number;
  min: any;
  max: any;
  mean?: number;
  median?: number;
  stddev?: number;
  outliers_count?: number;
  top_categories?: Record<string, number>;
}

interface ProfilingData {
  dataset_id: string;
  version_id: string;
  row_count: number;
  column_count: number;
  quality_score: number;
  quality_warnings: string[];
  columns: Record<string, ColumnProfile>;
  computed_at: string;
}

interface DatasetProfileProps {
  datasetId: string;
}

export const DatasetProfileView: React.FC<DatasetProfileProps> = ({ datasetId }) => {
  const [profile, setProfile] = useState<ProfilingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/datasets/${datasetId}/profile`);
      if (!res.ok) {
        throw new Error('Failed to fetch dataset profile');
      }
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown profiling error');
    } finally {
      setLoading(false);
    }
  }, [datasetId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="glass-card card" style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="dropzone-icon">
          <span className="material-symbols-outlined text-primary text-3xl animate-spin">refresh</span>
        </div>
        <p style={{ color: 'var(--text-muted)' }}>Calculating statistical profile & IQR outlier metrics...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="glass-card card" style={{ padding: '1.5rem', color: 'var(--text-muted)' }}>
        <span className="material-symbols-outlined text-danger text-[18px] mr-1 align-sub">warning</span> {error || 'Failed to load profile'}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Overview Metric Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="glass-card card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-emerald)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quality Health Score</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
            {profile.quality_score.toFixed(1)} / 100
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Deterministic Data Evaluation
          </div>
        </div>

        <div className="glass-card card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Records</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {profile.row_count}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            across {profile.column_count} columns
          </div>
        </div>

        <div className="glass-card card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quality Warnings</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: profile.quality_warnings.length > 0 ? 'var(--accent-warning)' : 'var(--accent-emerald)' }}>
            {profile.quality_warnings.length}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            {profile.quality_warnings.length === 0 ? 'Zero schema anomalies' : 'Anomalies detected'}
          </div>
        </div>
      </div>

      {/* Warnings List */}
      {profile.quality_warnings.length > 0 && (
        <div className="glass-card card" style={{ borderLeft: '4px solid var(--accent-warning)' }}>
          <h4 style={{ color: 'var(--accent-warning)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
            <span className="material-symbols-outlined text-[18px] mr-1 align-sub">warning</span> Quality Warnings Detected ({profile.quality_warnings.length})
          </h4>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {profile.quality_warnings.map((w, idx) => (
              <li key={idx} style={{ marginBottom: '0.25rem' }}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Column Breakdown Cards */}
      <div className="glass-card card">
        <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '1rem' }}>
          Column Statistical Breakdown
        </h4>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Column</th>
                <th>Type</th>
                <th>Nulls</th>
                <th>Uniques</th>
                <th>Min / Max</th>
                <th>Mean ± StdDev</th>
                <th>1.5×IQR Outliers</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(profile.columns).map(([colName, col]) => (
                <tr key={colName}>
                  <td><strong style={{ color: 'var(--text-primary)' }}>{colName}</strong></td>
                  <td><span className="badge-pill badge-cyan" style={{ fontSize: '0.65rem' }}>{col.type}</span></td>
                  <td style={{ color: col.null_count > 0 ? 'var(--accent-warning)' : 'var(--text-secondary)' }}>
                    {col.null_count}
                  </td>
                  <td>{col.unique_count}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {col.min !== null ? String(col.min) : '-'} / {col.max !== null ? String(col.max) : '-'}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {col.mean !== undefined && col.mean !== null ? (
                      `${col.mean.toFixed(2)} ± ${col.stddev?.toFixed(2) || '0'}`
                    ) : '-'}
                  </td>
                  <td>
                    {col.outliers_count !== undefined && col.outliers_count > 0 ? (
                      <span className="badge-pill" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                        {col.outliers_count} outliers
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>None</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
