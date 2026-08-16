import React from 'react';

interface SidebarProps {
  activeTab: 'overview' | 'datasets' | 'analyst' | 'insights' | 'reports' | 'evaluation' | 'settings';
  setActiveTab: (tab: 'overview' | 'datasets' | 'analyst' | 'insights' | 'reports' | 'evaluation' | 'settings') => void;
  onNewProject: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onNewProject }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'datasets', label: 'Datasets', icon: 'database' },
    { id: 'analyst', label: 'Analyst', icon: 'analytics' },
    { id: 'insights', label: 'Insights', icon: 'lightbulb' },
    { id: 'reports', label: 'Reports', icon: 'description' },
    { id: 'evaluation', label: 'Evaluation', icon: 'quiz' },
  ] as const;

  return (
    <nav className="fixed left-0 top-0 h-full w-[240px] bg-surface-container border-r border-outline-variant z-20 flex flex-col py-6 transition-colors duration-200 ease-in-out">
      {/* Brand Header */}
      <div className="px-6 mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center text-on-primary-container">
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            analytics
          </span>
        </div>
        <div>
          <h1 className="font-display font-bold text-lg text-primary leading-tight">DataMind</h1>
          <p className="font-body text-xs text-on-surface-variant">Local-first AI Analyst</p>
        </div>
      </div>

      {/* New Project Action Button */}
      <div className="px-6 mb-6">
        <button
          className="w-full py-2 px-4 rounded bg-primary text-on-primary font-body text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          onClick={onNewProject}
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Project
        </button>
      </div>

      {/* Navigation Links */}
      <ul className="flex flex-col gap-1 px-3 flex-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded font-body text-sm transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Footer System Nav & Profile */}
      <div className="mt-auto px-3">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded font-body text-sm transition-all duration-200 text-left mb-4 ${
            activeTab === 'settings'
              ? 'bg-secondary-container text-on-secondary-container font-bold'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span>Settings</span>
        </button>

        {/* User Profile Card */}
        <div className="pt-3 border-t border-outline-variant flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs">
            AM
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-body text-xs font-semibold text-on-surface truncate">Alex Mercer</span>
            <span className="font-body text-xs text-on-surface-variant opacity-70">Data Scientist</span>
          </div>
        </div>
      </div>
    </nav>
  );
};
