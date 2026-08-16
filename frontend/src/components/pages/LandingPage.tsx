import React from 'react';
import { IconBrain } from '@/components/ui/Icons';

interface LandingPageProps {
  onTryDataMind: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onTryDataMind, onLogin }) => {
  return (
    <div style={{ minHeight: '100vh', background: '#080A0C', color: '#F5F7FA', display: 'flex', flexDirection: 'column' }}>
      {/* Top Brand Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          height: '64px',
          background: 'rgba(19, 18, 27, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #1A1D21',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #5845d9, #c6bfff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
            }}
          >
            <IconBrain size={20} color="#ffffff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            DataMind
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            onClick={onLogin}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            Log In
          </button>
          <button className="btn-primary" onClick={onTryDataMind}>
            Launch App →
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Badge Pill */}
        <div
          className="badge-pill badge-purple"
          style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', marginBottom: '2rem' }}
        >
          <IconBrain size={14} color="var(--accent-light)" />
          <span>Local-First AI Engine 2.0</span>
        </div>

        {/* Hero Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '3.5rem',
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: '1.15',
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            maxWidth: '900px',
          }}
        >
          Understand your data. <br />
          <span style={{ color: '#6F7784' }}>Without writing the query.</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: '#94a3b8',
            fontSize: '1.15rem',
            textAlign: 'center',
            maxWidth: '680px',
            lineHeight: '1.6',
            marginBottom: '2.5rem',
          }}
        >
          A high-performance analytical instrument that turns natural language into complex data queries, executing entirely on your local machine.
        </p>

        {/* Action CTA Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '4rem' }}>
          <button
            className="btn-primary"
            style={{ padding: '0.85rem 2rem', fontSize: '1rem', borderRadius: '8px' }}
            onClick={onTryDataMind}
          >
            Try DataMind Free →
          </button>
          <button
            className="btn-secondary"
            style={{ padding: '0.85rem 2rem', fontSize: '1rem', borderRadius: '8px' }}
            onClick={onTryDataMind}
          >
            View Interactive Demo
          </button>
        </div>

        {/* Hardware Preview Card (Matching Stitch Design) */}
        <div
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '1000px',
            borderRadius: '12px',
            border: '1px solid #1A1D21',
            overflow: 'hidden',
            boxShadow: '0 0 50px rgba(124, 108, 255, 0.15)',
          }}
        >
          {/* Frame Header */}
          <div style={{ height: '40px', background: '#111418', borderBottom: '1px solid #1A1D21', display: 'flex', alignItems: 'center', padding: '0 1rem', gap: '0.5rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#343B46' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#343B46' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#343B46' }} />
            <span style={{ marginLeft: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#6F7784' }}>
              analyst_session_782
            </span>
          </div>

          {/* Frame Body */}
          <div style={{ padding: '2rem', background: '#0B0D10', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.25rem', borderLeft: '4px solid var(--accent-primary)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge-pill badge-purple">INTENT: AGGREGATION</span>
                <span className="badge-pill badge-emerald">✓ VALIDATION: PASSED</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', color: '#F5F7FA', marginBottom: '0.35rem' }}>
                Q: "Why did revenue decline in Q2?"
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }} className="flex items-center gap-1">
                <span className="material-symbols-outlined text-primary text-[16px]">lightbulb</span>
                <span>DataMind identified West region hardware sales drop as primary factor.</span>
              </p>
            </div>

            <div style={{ background: '#080A0C', padding: '1rem', borderRadius: '8px', border: '1px solid #1A1D21', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#c6bfff' }}>
              SELECT region, SUM(revenue) AS total_revenue FROM dataset GROUP BY region ORDER BY total_revenue DESC
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1A1D21', padding: '2rem', textAlign: 'center', color: '#6F7784', fontSize: '0.85rem' }}>
        &copy; 2026 DataMind AI Systems. Local-First Analytical Instrument.
      </footer>
    </div>
  );
};
