import React from 'react';

export const EvaluationView: React.FC = () => {
  const failedQueries = [
    { question: 'Compare Q3 revenue vs Q2 hardware returns by vendor', status: 'SYNTAX_ERROR', retries: 2, latency: '4.2s' },
    { question: 'Calculate median customer lifetime value grouped by acquisition channel', status: 'TIMEOUT', retries: 3, latency: '8.0s' },
    { question: 'Find null values in unparsed JSON payload column', status: 'SCHEMA_MISMATCH', retries: 1, latency: '1.8s' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid #1A1D21', paddingBottom: '1rem' }}>
        <div>
          <h2 className="font-display text-2xl font-bold text-on-surface mb-1">Evaluation Dashboard</h2>
          <p className="font-body text-sm text-on-surface-variant">Real-time benchmark evaluation and response accuracy metrics for local AI models.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary">
            <span className="material-symbols-outlined text-[16px]">download</span>
            Export Benchmark Data
          </button>
          <button className="btn-primary">
            <span className="material-symbols-outlined text-[16px]">play_arrow</span>
            Run Evaluation Suite
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {/* KPI 1 */}
        <div className="bg-surface-container hardware-border rounded-lg p-5 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <span className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Answer Accuracy</span>
            <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display text-3xl font-bold text-on-surface">92%</span>
            <span className="text-xs text-success flex items-center font-semibold">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +2.4%
            </span>
          </div>
          <div className="w-full bg-surface-variant h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[92%] rounded-full" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container hardware-border rounded-lg p-5 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <span className="font-label text-xs text-on-surface-variant uppercase tracking-wider">SQL Success Rate</span>
            <span className="material-symbols-outlined text-primary text-[20px]">data_object</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display text-3xl font-bold text-on-surface">97%</span>
            <span className="text-xs text-on-surface-variant">Avg over 7 days</span>
          </div>
          <div className="w-full bg-surface-variant h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[97%] rounded-full" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-surface-container hardware-border rounded-lg p-5 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <span className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Avg Execution Latency</span>
            <span className="material-symbols-outlined text-primary text-[20px]">speed</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display text-3xl font-bold text-on-surface">2.3s</span>
            <span className="text-xs text-success flex items-center font-semibold">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span> -0.2s
            </span>
          </div>
          <div className="w-full bg-surface-variant h-1.5 mt-3 rounded-full overflow-hidden">
            <div className="bg-tertiary h-full w-[35%] rounded-full" />
          </div>
        </div>
      </div>

      {/* Benchmark Accuracy Chart Card */}
      <div className="bg-surface-container hardware-border rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-lg font-semibold text-on-surface">Question Accuracy & Latency Over Time</h3>
          <div className="flex gap-2 text-xs">
            <span className="px-2.5 py-1 rounded bg-primary text-on-primary font-semibold">7D</span>
            <span className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface cursor-pointer">30D</span>
            <span className="px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant hover:text-on-surface cursor-pointer">ALL</span>
          </div>
        </div>

        {/* Chart Graphic Area */}
        <div className="h-56 w-full relative flex items-end pt-6 pb-6 px-4 bg-surface-main rounded border border-micro">
          <svg className="absolute inset-0 h-full w-full pointer-events-none p-4" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path d="M0,50 C20,40 40,25 60,30 C80,35 90,15 100,10" fill="none" stroke="#c6bfff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path d="M0,50 C20,40 40,25 60,30 C80,35 90,15 100,10 L100,100 L0,100 Z" fill="rgba(198, 191, 255, 0.1)" />
          </svg>

          <div className="w-full flex justify-between text-xs text-on-surface-variant z-10 font-code pt-4 border-t border-micro">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </div>

      {/* Failed Benchmark Questions Table */}
      <div className="bg-surface-container hardware-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-micro">
          <h4 className="font-semibold text-on-surface text-sm">Failed Benchmark Questions Log</h4>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Question Prompt</th>
              <th>Status</th>
              <th>Retries</th>
              <th>Latency</th>
            </tr>
          </thead>
          <tbody>
            {failedQueries.map((q, idx) => (
              <tr key={idx}>
                <td className="font-body text-sm text-on-surface">{q.question}</td>
                <td>
                  <span className="px-2 py-0.5 rounded bg-danger/20 text-danger text-xs font-semibold">
                    {q.status}
                  </span>
                </td>
                <td className="text-on-surface-variant text-xs">{q.retries}</td>
                <td className="text-on-surface-variant text-xs font-code">{q.latency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
