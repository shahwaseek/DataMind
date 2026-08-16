import React from 'react';

interface MobileBottomNavProps {
  activeTab: 'overview' | 'datasets' | 'analyst' | 'insights' | 'reports' | 'evaluation' | 'settings';
  setActiveTab: (tab: 'overview' | 'datasets' | 'analyst' | 'insights' | 'reports' | 'evaluation' | 'settings') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Home', icon: 'dashboard' },
    { id: 'datasets', label: 'Data', icon: 'database' },
    { id: 'analyst', label: 'Ask', icon: 'psychology' },
    { id: 'insights', label: 'Insights', icon: 'lightbulb' },
    { id: 'reports', label: 'Reports', icon: 'description' },
    { id: 'evaluation', label: 'Eval', icon: 'quiz' },
  ] as const;

  return (
    <nav className="mobile-only-nav fixed bottom-0 left-0 right-0 h-14 bg-surface-container/95 backdrop-blur-md border-t border-outline-variant z-50 flex justify-around items-center px-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-colors ${
              isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
            <span className="text-[10px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
