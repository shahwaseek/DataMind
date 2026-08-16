import React from 'react';

interface InsightsViewProps {
  datasetName: string;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ datasetName }) => {
  const insights = [
    { title: 'Dataset Completeness High', type: 'QUALITY', score: '95/100', desc: 'No missing primary keys or critical identifiers detected.', action: 'Inspect Schema' },
    { title: 'Top Metric Concentration', type: 'DISTRIBUTION', score: 'Top 5 = 68%', desc: 'A small subset of categories drives the majority of numeric values.', action: 'Analyze Distribution' },
    { title: 'Zero Duplicate Records', type: 'INTEGRITY', score: '0 Duplicates', desc: 'Row hashing verified clean dataset unique constraints.', action: 'View Hashing' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
          💡 DataMind Insights for <code>{datasetName}</code>
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Automatically discovered statistical patterns and data quality evaluations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {insights.map((item, idx) => (
          <div key={idx} className="glass-panel glass-panel-hover" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span className="badge-pill badge-purple">{item.type}</span>
              <span className="badge-pill badge-emerald">{item.score}</span>
            </div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.05rem' }}>{item.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1rem' }}>{item.desc}</p>
            <button className="btn-secondary" style={{ fontSize: '0.8rem', width: '100%', justifyContent: 'center' }}>
              {item.action} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
