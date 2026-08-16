import React from 'react';
import { IconOverview, IconDataset, IconBrain, IconLightbulb, IconReport } from '../ui/Icons';

interface MobileBottomNavProps {
  activeTab: 'overview' | 'datasets' | 'analyst' | 'insights' | 'reports' | 'settings';
  setActiveTab: (tab: 'overview' | 'datasets' | 'analyst' | 'insights' | 'reports' | 'settings') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Home', Icon: IconOverview },
    { id: 'datasets', label: 'Data', Icon: IconDataset },
    { id: 'analyst', label: 'Ask', Icon: IconBrain },
    { id: 'insights', label: 'Insights', Icon: IconLightbulb },
    { id: 'reports', label: 'Reports', Icon: IconReport },
  ] as const;

  return (
    <nav
      className="mobile-only-nav"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'rgba(12, 20, 30, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-subtle)',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 0.5rem',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const { Icon } = tab;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem',
              color: isActive ? 'var(--accent-light)' : 'var(--text-muted)',
              fontSize: '0.7rem',
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              flex: 1,
            }}
          >
            <Icon size={18} color={isActive ? 'var(--accent-light)' : 'var(--text-muted)'} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
