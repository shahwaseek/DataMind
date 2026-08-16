import React from 'react';
import {
  IconOverview,
  IconDataset,
  IconBrain,
  IconLightbulb,
  IconReport,
  IconSettings,
  IconPlus,
} from '../ui/Icons';

interface SidebarProps {
  activeTab: 'overview' | 'datasets' | 'analyst' | 'insights' | 'reports' | 'settings';
  setActiveTab: (tab: 'overview' | 'datasets' | 'analyst' | 'insights' | 'reports' | 'settings') => void;
  onNewProject: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onNewProject }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', Icon: IconOverview },
    { id: 'datasets', label: 'Datasets', Icon: IconDataset },
    { id: 'analyst', label: 'AI Analyst', Icon: IconBrain },
    { id: 'insights', label: 'Insights', Icon: IconLightbulb },
    { id: 'reports', label: 'Reports', Icon: IconReport },
  ] as const;

  return (
    <aside
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: 'var(--sidebar-width)',
        height: '100vh',
        background: 'var(--surface-container)',
        borderRight: '1px solid var(--border-subtle)',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem 0.75rem',
      }}
    >
      {/* Brand Header */}
      <div style={{ padding: '0 0.75rem 1.25rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-primary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 0 15px rgba(140, 128, 255, 0.4)',
          }}
        >
          <IconBrain size={22} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>
            DataMind
          </h1>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Local-first AI Analyst
          </span>
        </div>
      </div>

      {/* New Project Action Button */}
      <div style={{ padding: '0 0.25rem 1.25rem 0.25rem' }}>
        <button
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.65rem 1rem' }}
          onClick={onNewProject}
        >
          <IconPlus size={18} /> New Project
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const { Icon } = item;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'linear-gradient(90deg, rgba(140, 128, 255, 0.2), rgba(88, 69, 217, 0.1))' : 'transparent',
                color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
                borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={18} color={isActive ? 'var(--accent-light)' : 'var(--text-secondary)'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer System Nav */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
        <button
          onClick={() => setActiveTab('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 0.85rem',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'settings' ? 'rgba(140, 128, 255, 0.2)' : 'transparent',
            color: activeTab === 'settings' ? 'var(--accent-light)' : 'var(--text-secondary)',
            fontWeight: 500,
            fontSize: '0.9rem',
            cursor: 'pointer',
            width: '100%',
            marginBottom: '0.75rem',
          }}
        >
          <IconSettings size={18} color={activeTab === 'settings' ? 'var(--accent-light)' : 'var(--text-secondary)'} />
          <span>Settings</span>
        </button>

        {/* User Profile Card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.6rem 0.75rem',
            background: 'var(--surface-base)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#ffffff',
            }}
          >
            AM
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              Alex Mercer
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Data Scientist</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
