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
    <div className="glass-card card">
      <div className="card-header">
        <h3 className="card-title">
          <span className="card-icon">📂</span> Ingest Analytical Dataset
        </h3>
        <span className="brand-badge">Deterministic Profile</span>
      </div>

      {error && (
        <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
          ⚠️ {error}
        </div>
      )}

      <div
        className={`dropzone ${dragActive ? 'active' : ''}`}
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
          style={{ display: 'none' }}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          disabled={uploading}
        />

        <div className="dropzone-icon">{uploading ? '🔄' : '📊'}</div>
        <div className="dropzone-title">
          {uploading ? 'Processing & Ingesting Dataset...' : 'Click or Drag & Drop Dataset File'}
        </div>
        <div className="dropzone-subtitle">
          Supports <strong>CSV, XLSX, JSON, Parquet</strong> files up to 100MB
        </div>
      </div>
    </div>
  );
};
