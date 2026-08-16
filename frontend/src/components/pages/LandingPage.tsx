import React from 'react';
import Image from 'next/image';

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
          height: '72px',
          background: 'rgba(11, 13, 16, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #1A1D21',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2.5rem',
        }}
      >
        {/* 3D Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="relative w-10 h-10 rounded-xl overflow-hidden hardware-border hardware-glow">
            <Image
              src="/logo_3d.jpg"
              alt="DataMind 3D Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
              DataMind
            </span>
            <span className="block font-code text-[10px] text-primary uppercase font-bold tracking-widest">
              AI ANALYTICS ENGINE
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <button
            onClick={onLogin}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Sign In
          </button>
          <button className="btn-primary cursor-pointer" onClick={onTryDataMind}>
            Launch Application →
          </button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 2rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        {/* Badge Pill */}
        <div
          className="badge-pill badge-purple"
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', marginBottom: '2rem' }}
        >
          <span className="material-symbols-outlined text-primary text-[18px]">psychology</span>
          <span>Next.js 16 • Local-First 3D AI Data Engine</span>
        </div>

        {/* Hero Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '3.75rem',
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: '1.12',
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            maxWidth: '960px',
          }}
        >
          Understand your data. <br />
          <span className="bg-gradient-to-r from-primary via-inverse-primary to-accent-cyan bg-clip-text text-transparent">
            Without writing a single query.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            color: '#94a3b8',
            fontSize: '1.2rem',
            textAlign: 'center',
            maxWidth: '720px',
            lineHeight: '1.65',
            marginBottom: '3rem',
          }}
        >
          A high-performance analytical instrument that turns plain-English questions into AST-validated SQL, executing entirely on your local machine with 100% privacy.
        </p>

        {/* Action CTA Buttons */}
        <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '4.5rem' }}>
          <button
            className="btn-primary cursor-pointer"
            style={{ padding: '0.95rem 2.25rem', fontSize: '1.05rem', borderRadius: '8px' }}
            onClick={onTryDataMind}
          >
            Launch DataMind Workspace →
          </button>
          <button
            className="btn-secondary cursor-pointer"
            style={{ padding: '0.95rem 2.25rem', fontSize: '1.05rem', borderRadius: '8px' }}
            onClick={onTryDataMind}
          >
            <span className="material-symbols-outlined text-[20px]">play_circle</span>
            View Interactive Demo
          </button>
        </div>

        {/* 3D Render Showcase Frame */}
        <div
          className="glass-panel hardware-glow"
          style={{
            width: '100%',
            maxWidth: '1100px',
            borderRadius: '16px',
            border: '1px solid var(--border-glow)',
            overflow: 'hidden',
            boxShadow: '0 0 60px rgba(140, 128, 255, 0.25)',
            position: 'relative',
          }}
        >
          {/* Frame Header Bar */}
          <div style={{ height: '44px', background: '#111418', borderBottom: '1px solid #1A1D21', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F26D78' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffb875' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#32C48D' }} />
              <span style={{ marginLeft: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#6F7784' }}>
                datamind_3d_analytics_terminal.render
              </span>
            </div>
            <span className="badge-pill badge-emerald text-[10px]">
              3D HARDWARE ACCELERATED
            </span>
          </div>

          {/* 3D Render Image Container */}
          <div className="relative w-full aspect-video min-h-[460px] bg-[#0B0D10]">
            <Image
              src="/hero_3d.jpg"
              alt="DataMind 3D Rendered Dashboard Preview"
              fill
              className="object-cover"
              priority
            />

            {/* Floating Glass Overlay Cards */}
            <div className="absolute bottom-6 left-6 right-6 p-6 glass-panel border border-outline-variant rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-2xl">verified_user</span>
                </div>
                <div>
                  <h4 className="font-display font-bold text-on-surface text-base">Deterministic AST Execution</h4>
                  <p className="font-body text-xs text-on-surface-variant">DuckDB Read-Only AST validation prevents DDL/DML mutation risks</p>
                </div>
              </div>

              <button className="btn-primary text-sm cursor-pointer whitespace-nowrap" onClick={onTryDataMind}>
                Explore Terminal →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #1A1D21', padding: '2.5rem', textAlign: 'center', color: '#6F7784', fontSize: '0.85rem' }}>
        &copy; 2026 DataMind AI Systems. Local-First 3D Analytical Instrument.
      </footer>
    </div>
  );
};
