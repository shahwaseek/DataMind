import React from 'react';

interface InsightsViewProps {
  datasetName: string;
}

export const InsightsView: React.FC<InsightsViewProps> = ({ datasetName }) => {
  const insights = [
    {
      title: 'High Correlation Detected',
      category: 'Statistical Pattern',
      description: `Discovered a 0.87 positive Pearson correlation between column 'sales' and 'quantity' in ${datasetName}.`,
      confidence: '98%',
      type: 'positive',
    },
    {
      title: 'Distribution Skewness Warning',
      category: 'Data Quality',
      description: 'Right-skewed distribution observed in numerical metrics (skewness coefficient > 1.8). Log transformation recommended.',
      confidence: '92%',
      type: 'warning',
    },
    {
      title: 'Segment Clustering Anomaly',
      category: 'Cluster Discovery',
      description: 'Top 5% of records account for 42% of total metric volume, indicating heavy power-law distribution.',
      confidence: '95%',
      type: 'positive',
    },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      <div className="border-b border-outline-variant pb-4">
        <h2 className="font-display text-2xl font-bold text-on-surface mb-1">Auto-Discovered Insights</h2>
        <p className="font-body text-sm text-on-surface-variant flex items-center gap-1.5">
          <span className="material-symbols-outlined text-primary text-[18px]">lightbulb</span>
          <span>DataMind Insights for <code className="text-primary font-code">{datasetName}</code></span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className={`bg-surface-container border p-6 rounded-lg flex flex-col justify-between ${
              item.type === 'warning' ? 'border-tertiary/40' : 'border-outline-variant'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-label text-xs uppercase text-on-surface-variant font-semibold">
                  {item.category}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-code text-[10px] font-bold">
                  {item.confidence} match
                </span>
              </div>
              <h3 className="font-display font-semibold text-on-surface text-base mb-2">{item.title}</h3>
              <p className="font-body text-xs text-on-surface-variant leading-relaxed mb-4">{item.description}</p>
            </div>

            <button className="btn-secondary w-full justify-center text-xs">
              Explore Query Trace →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
