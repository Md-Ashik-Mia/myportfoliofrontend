'use client';

import { useState, useEffect, type ChangeEvent } from 'react';
import AdminShell from '@/common/admin/AdminShell';
import { FiUploadCloud, FiFileText, FiCheckCircle, FiExternalLink, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface ResumeData {
  title: string;
  fileUrl: string;
  fileName: string;
  fileSize?: string;
  updatedAt?: string;
}

export default function AdminResumePage() {
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [titleInput, setTitleInput] = useState('Md Ashik Mia Resume');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch active resume from MongoDB Atlas
  const fetchResume = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/resume`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setCurrentResume(json.data);
          setTitleInput(json.data.title || 'Md Ashik Mia Resume');
        }
      }
    } catch (err) {
      console.error('Failed to fetch resume:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchResume();
  }, []);

  // Handle PDF file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setMessage({ type: 'error', text: 'Please select a valid .pdf file!' });
      return;
    }

    setSelectedFile(file);
    setMessage(null);

    // Convert file to Base64
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFileBase64(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Upload new resume to MongoDB Atlas
  const handleUpload = async () => {
    if (!fileBase64 || !selectedFile) {
      setMessage({ type: 'error', text: 'Please select a PDF file first!' });
      return;
    }

    setUploading(true);
    setMessage(null);

    const formattedSize = `${(selectedFile.size / 1024).toFixed(1)} KB`;

    try {
      const res = await fetch(`${API_BASE_URL}/api/resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': window.localStorage.getItem('admin-token') || '',
        },
        body: JSON.stringify({
          title: titleInput,
          fileUrl: fileBase64,
          fileName: selectedFile.name,
          fileSize: formattedSize,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setMessage({ type: 'success', text: '🎉 Resume updated in MongoDB Atlas successfully!' });
        setCurrentResume(json.data);
        setSelectedFile(null);
        setFileBase64('');
      } else {
        throw new Error(json.message || 'Failed to upload resume');
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Upload failed';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setUploading(false);
    }
  };

  return (
    <AdminShell>
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Resume Management</h1>
            <p className="mt-1 text-sm text-white/50">
              Upload your updated resume PDF directly into MongoDB Atlas. The landing page download button will update automatically.
            </p>
          </div>
          <button
            onClick={() => void fetchResume()}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur hover:bg-white/10 transition"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`flex items-center gap-3 rounded-2xl border p-4 text-sm font-medium backdrop-blur ${
              message.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-red-500/30 bg-red-500/10 text-red-300'
            }`}
          >
            {message.type === 'success' ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Active Resume Status Card */}
          <div className="rounded-3xl border border-white/10 bg-[#08101f] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Live MongoDB Status</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Active in Atlas
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-sm text-white/40">Loading current resume...</div>
            ) : currentResume ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/5 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
                    <FiFileText size={24} />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-white truncate">{currentResume.fileName}</h3>
                    <p className="text-xs text-white/40">{currentResume.fileSize || 'PDF Document'}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-white/60">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Title:</span>
                    <span className="font-medium text-white">{currentResume.title}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span>Last Updated:</span>
                    <span className="font-medium text-white">
                      {currentResume.updatedAt ? new Date(currentResume.updatedAt).toLocaleString() : 'Just now'}
                    </span>
                  </div>
                </div>

                <a
                  href={currentResume.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-xs font-bold text-white shadow-lg hover:from-cyan-400 hover:to-blue-500 transition"
                >
                  <FiExternalLink />
                  Preview Live Resume PDF
                </a>
              </div>
            ) : (
              <div className="py-8 text-center text-sm text-white/40">No resume found in MongoDB Atlas.</div>
            )}
          </div>

          {/* Upload New Resume PDF Form */}
          <div className="rounded-3xl border border-white/10 bg-[#08101f] p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-white/10 pb-3">Upload Updated Resume</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1.5">Resume Title</label>
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="e.g. Md Ashik Mia Resume 2026"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1.5">Select PDF File</label>
                <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-6 text-center cursor-pointer hover:border-cyan-400/50 hover:bg-white/10 transition">
                  <FiUploadCloud size={32} className="text-cyan-400 mb-2" />
                  <span className="text-xs font-semibold text-white">
                    {selectedFile ? selectedFile.name : 'Click to browse or drop PDF file'}
                  </span>
                  <span className="mt-1 text-[11px] text-white/40">
                    {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Supports .pdf files up to 50MB'}
                  </span>
                  <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              <button
                onClick={() => void handleUpload()}
                disabled={uploading || !selectedFile}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {uploading ? (
                  <>
                    <FiRefreshCw className="animate-spin" />
                    <span>Uploading to MongoDB Atlas...</span>
                  </>
                ) : (
                  <>
                    <FiUploadCloud />
                    <span>Upload Resume to Atlas</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
