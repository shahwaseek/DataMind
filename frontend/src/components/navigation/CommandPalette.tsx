import React, { useEffect, useState } from 'react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectAction }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelectAction('open_palette');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelectAction]);

  if (!isOpen) return null;

  const commands = [
    { id: 'analyst', label: 'Ask AI Analyst', category: 'Navigation', icon: 'psychology' },
    { id: 'datasets', label: 'Ingest Dataset / Upload', category: 'Navigation', icon: 'database' },
    { id: 'reports', label: 'Generate Executive Report', category: 'Actions', icon: 'description' },
    { id: 'evaluation', label: 'Open Model Evaluation Dashboard', category: 'Analytics', icon: 'quiz' },
    { id: 'insights', label: 'View Auto-Discovered Insights', category: 'Analytics', icon: 'lightbulb' },
    { id: 'settings', label: 'Workspace & Model Settings', category: 'System', icon: 'settings' },
  ];

  const filtered = commands.filter(
    (c) => c.label.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="bg-surface-container border border-outline-variant rounded-xl w-full max-w-xl shadow-2xl overflow-hidden hardware-glow"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant bg-surface-container-high">
          <span className="material-symbols-outlined text-primary">search</span>
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none font-body text-sm text-on-surface placeholder:text-on-surface-variant"
            placeholder="Type a command or search workspace... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <kbd className="px-2 py-0.5 rounded bg-surface-container-lowest border border-outline-variant text-[10px] text-on-surface-variant font-code">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-72 overflow-y-auto p-2 flex flex-col gap-1">
          {filtered.length > 0 ? (
            filtered.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => {
                  onSelectAction(cmd.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded hover:bg-surface-container-highest text-left transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors text-[20px]">
                    {cmd.icon}
                  </span>
                  <span className="font-body text-sm text-on-surface font-medium">{cmd.label}</span>
                </div>
                <span className="font-code text-[10px] text-on-surface-variant uppercase px-2 py-0.5 rounded bg-surface-container-lowest border border-micro">
                  {cmd.category}
                </span>
              </button>
            ))
          ) : (
            <div className="p-6 text-center text-on-surface-variant font-body text-sm">
              No matching commands found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
