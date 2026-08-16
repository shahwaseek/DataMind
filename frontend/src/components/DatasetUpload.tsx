import React, { useState, useRef } from 'react';

interface DatasetUploadProps {
  projectId: string;
  onUploadSuccess: (dataset: any) => void;
}

export const DatasetUpload: React.FC<DatasetUploadProps> = ({ projectId, onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls', '.json', '.parquet'];

  const handleFile = async (file: File) => {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported file extension ${ext}. Allowed formats: CSV, XLSX, JSON, Parquet`);
      return;
    }

    if (file.size === 0) {
      setError('Selected file is empty (0 bytes).');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/projects/${projectId}/datasets/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.detail || 'Upload failed');
      }

      const dataset = await res.json();
      onUploadSuccess(dataset);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload dataset');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-surface-container border border-outline-variant rounded-xl p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-display font-semibold text-base text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">file_upload</span>
          Ingest Analytical Dataset
        </h3>
        <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-semibold">
          Deterministic Verification
        </span>
      </div>

      {error && (
        <div className="bg-error-container/20 border-l-4 border-danger p-3 rounded text-danger text-sm mb-4">
          ⚠️ {error}
        </div>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? 'border-primary bg-primary/10 hardware-glow'
            : 'border-outline-variant hover:border-primary/50 hover:bg-surface-container-high'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.json,.parquet"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          disabled={uploading}
        />

        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
          <span className={`material-symbols-outlined text-2xl ${uploading ? 'animate-spin' : ''}`}>
            {uploading ? 'refresh' : 'cloud_upload'}
          </span>
        </div>

        <h4 className="font-display font-semibold text-on-surface text-sm mb-1">
          {uploading ? 'Parsing & Ingesting Dataset...' : 'Click or Drag & Drop Dataset File'}
        </h4>
        <p className="font-body text-xs text-on-surface-variant mb-3">
          Upload raw datasets for local DuckDB indexing & AI profiling
        </p>

        <div className="flex justify-center gap-2">
          {['CSV', 'XLSX', 'JSON', 'Parquet'].map((fmt) => (
            <span key={fmt} className="px-2 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant font-code text-[10px] border border-outline-variant">
              {fmt}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
