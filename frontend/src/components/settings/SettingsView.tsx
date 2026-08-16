import React from 'react';

export const SettingsView: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <div className="border-b border-outline-variant pb-4">
        <h2 className="font-display text-2xl font-bold text-on-surface mb-1">Workspace & System Settings</h2>
        <p className="font-body text-sm text-on-surface-variant">Configure local LLM parameters, database engine behavior, and privacy boundaries.</p>
      </div>

      <div className="bg-surface-container border border-outline-variant p-6 rounded-lg flex flex-col gap-5">
        <h3 className="font-display text-lg font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">psychology</span>
          Local LLM Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-label text-xs uppercase text-on-surface-variant font-semibold block mb-1.5">
              Ollama Model Identifier
            </label>
            <input
              type="text"
              className="form-input"
              defaultValue="qwen2.5-coder:7b"
              readOnly
            />
          </div>

          <div>
            <label className="font-label text-xs uppercase text-on-surface-variant font-semibold block mb-1.5">
              Sampling Temperature
            </label>
            <input
              type="text"
              className="form-input"
              defaultValue="0.0 (Deterministic SQL)"
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="bg-surface-container border border-outline-variant p-6 rounded-lg flex flex-col gap-5">
        <h3 className="font-display text-lg font-semibold text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">database</span>
          DuckDB Engine Security
        </h3>

        <div className="flex items-center justify-between p-4 bg-surface-container-lowest rounded border border-micro">
          <div>
            <div className="font-body text-sm font-semibold text-on-surface">AST Read-Only Guard Boundary</div>
            <div className="font-body text-xs text-on-surface-variant">Blocks DDL, DML, write queries, and file-system read functions.</div>
          </div>
          <span className="px-3 py-1 rounded-full bg-success/20 text-success font-code text-xs font-bold">
            ACTIVE
          </span>
        </div>
      </div>
    </div>
  );
};
