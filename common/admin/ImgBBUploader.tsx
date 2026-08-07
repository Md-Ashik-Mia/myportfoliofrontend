'use client';

import React, { useState, type ChangeEvent } from 'react';
import { uploadToImgBB } from '@/lib/imgbb';
import { FiUploadCloud, FiCheckCircle, FiAlertCircle, FiRefreshCw, FiImage, FiX } from 'react-icons/fi';

interface ImgBBUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function ImgBBUploader({
  value,
  onChange,
  label = 'Image URL / Upload to ImgBB',
  placeholder = 'https://i.ibb.co/...',
  className = '',
}: ImgBBUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file!');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const imgbbUrl = await uploadToImgBB(file);
      onChange(imgbbUrl);
      setSuccessMsg('🎉 Image uploaded to ImgBB!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'ImgBB upload failed';
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-semibold text-white/70">{label}</label>}

      {/* Preview Box if image exists */}
      {value ? (
        <div className="relative flex items-center gap-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3">
          <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/10 bg-black/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="ImgBB Upload Preview" className="h-full w-full object-cover" />
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
              <FiCheckCircle size={14} />
              <span>ImgBB CDN Link Active</span>
            </div>
            <p className="mt-1 truncate text-[11px] text-white/60 select-all font-mono">{value}</p>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition"
            title="Remove image"
          >
            <FiX size={16} />
          </button>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50 transition"
            />
          </div>

          <label className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-xs font-bold text-cyan-300 cursor-pointer hover:bg-cyan-500/20 transition">
            {uploading ? <FiRefreshCw className="animate-spin" /> : <FiUploadCloud size={16} />}
            <span>{uploading ? 'Uploading to ImgBB...' : 'Upload Image'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Status Messages */}
      {error && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-red-400">
          <FiAlertCircle size={14} />
          <span>{error}</span>
        </p>
      )}
      {successMsg && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <FiCheckCircle size={14} />
          <span>{successMsg}</span>
        </p>
      )}
    </div>
  );
}
