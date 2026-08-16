import React, { useState, useEffect, useCallback } from 'react';

interface ColumnProfile {
  name: string;
  data_type: string;
  null_count: number;
  null_percentage: number;
  distinct_count: number;
  is_numeric: boolean;
  is_datetime: boolean;
  is_bool: boolean;
  stats?: {
    min: number | null;
    max: number | null;
    mean: number | null;
    median: number | null;
    std_dev: number | null;
    outlier_count: number;
  };
  top_frequencies: {
    value: any;
    count: number;
    percentage: number;
  }[];
}

interface ProfileData {
  total_rows: number;
  total_columns: number;
  duplicate_rows: number;
  overall_null_percentage: number;
  data_quality_score: number;
  quality_warnings: string[];
  columns: ColumnProfile[];
}

interface DatasetProfileProps {
  datasetId: string;
}

export const DatasetProfileView: React.FC<DatasetProfileProps> = ({ datasetId }) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
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
      setError(err instanceof Error ? err.message : 'Error fetching profile');
    } finally {
      setLoading(false);
    }
  }, [datasetId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="glass-card card" style={{ marginTop: '1.5rem', textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>🔄 Calculating deterministic dataset intelligence & quality metrics...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="glass-card card" style={{ marginTop: '1.5rem', color: '#ef4444' }}>
        ⚠️ {error || 'Failed to load profile'}
      </div>
    );
  }

  const scoreColor =
    profile.data_quality_score >= 85
      ? 'var(--accent-green)'
      : profile.data_quality_score >= 65
      ? 'var(--accent-amber)'
      : '#ef4444';

  return (
    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Telemetry & Quality Score Banner */}
      <div className="glass-card card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h3 className="card-title" style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>
            <span className="card-icon">📈</span> Deterministic Dataset Intelligence
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {profile.total_rows.toLocaleString()} rows × {profile.total_columns} columns | {profile.duplicate_rows} duplicate rows | {profile.overall_null_percentage}% missing cells
          </p>
        </div>

        {/* Quality Score Ring/Gauge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(18, 24, 36, 0.7)', padding: '0.75rem 1.25rem', borderRadius: '12px', border: `1px solid ${scoreColor}` }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Data Quality Score</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: scoreColor, fontFamily: 'var(--font-heading)' }}>
              {profile.data_quality_score} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quality Warnings Banner */}
      {profile.quality_warnings.length > 0 && (
        <div className="glass-card card" style={{ borderLeft: '4px solid var(--accent-amber)', background: 'rgba(245, 158, 11, 0.08)' }}>
          <h4 style={{ color: 'var(--accent-amber)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚠️ Quality Warnings Detected ({profile.quality_warnings.length})
          </h4>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            {profile.quality_warnings.map((w, idx) => (
              <li key={idx}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Per-Column Profiling Cards Grid */}
      <div>
        <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Column Statistical Profiles ({profile.columns.length})
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {profile.columns.map((col, idx) => (
            <div className="glass-card card" key={idx}>
              <div className="card-header" style={{ marginBottom: '0.75rem' }}>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>{col.name}</strong>
                <span className="brand-badge" style={{ fontSize: '0.7rem' }}>{col.data_type}</span>
              </div>

              <div className="info-list" style={{ gap: '0.5rem', fontSize: '0.85rem' }}>
                <div className="info-item">
                  <span className="info-label">Missing Values</span>
                  <span className="info-value" style={{ color: col.null_percentage > 5 ? 'var(--accent-amber)' : 'var(--text-primary)' }}>
                    {col.null_count} ({col.null_percentage}%)
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Distinct Cardinality</span>
                  <span className="info-value">{col.distinct_count.toLocaleString()} unique</span>
                </div>

                {/* Numeric Statistics */}
                {col.is_numeric && col.stats && (
                  <>
                    <div className="info-item">
                      <span className="info-label">Min / Max</span>
                      <span className="info-value">{col.stats.min} → {col.stats.max}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Mean / Median</span>
                      <span className="info-value">{col.stats.mean} / {col.stats.median}</span>
                    </div>
                    {col.stats.outlier_count > 0 && (
                      <div className="info-item" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                        <span className="info-label" style={{ color: '#ef4444' }}>Outliers (1.5 IQR)</span>
                        <span className="info-value" style={{ color: '#ef4444' }}>{col.stats.outlier_count} values</span>
                      </div>
                    )}
                  </>
                )}

                {/* Categorical Top Values */}
                {col.top_frequencies && col.top_frequencies.length > 0 && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
                      Top Frequency Values
                    </div>
                    {col.top_frequencies.slice(0, 3).map((freq, fIdx) => (
                      <div key={fIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>
                        <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                          "{String(freq.value)}"
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)' }}>{freq.count} ({freq.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
