'use client';

import { useState, useEffect } from 'react';
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube, FaGithub, FaTwitter } from 'react-icons/fa6';
import { FiCheckCircle, FiAlertCircle, FiSave, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface SocialLinksData {
  facebook: string;
  linkedin: string;
  instagram: string;
  youtube: string;
  github: string;
  twitter: string;
}

export default function AdminSocialLinksPage() {
  const [links, setLinks] = useState<SocialLinksData>({
    facebook: '',
    linkedin: '',
    instagram: '',
    youtube: '',
    github: '',
    twitter: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch current social links from MongoDB Atlas
  const fetchSocialLinks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/social-links`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setLinks({
            facebook: json.data.facebook || '',
            linkedin: json.data.linkedin || '',
            instagram: json.data.instagram || '',
            youtube: json.data.youtube || '',
            github: json.data.github || '',
            twitter: json.data.twitter || '',
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch social links:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchSocialLinks();
  }, []);

  const handleChange = (field: keyof SocialLinksData, value: string) => {
    setLinks((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/social-links`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': window.localStorage.getItem('admin-token') || '',
        },
        body: JSON.stringify(links),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setMessage({ type: 'success', text: 'Social media links saved to MongoDB Atlas successfully!' });
        if (json.data) {
          setLinks({
            facebook: json.data.facebook || '',
            linkedin: json.data.linkedin || '',
            instagram: json.data.instagram || '',
            youtube: json.data.youtube || '',
            github: json.data.github || '',
            twitter: json.data.twitter || '',
          });
        }
      } else {
        throw new Error(json.message || 'Failed to save social links');
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Save failed';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setSaving(false);
    }
  };

  const platforms: { field: keyof SocialLinksData; label: string; placeholder: string; icon: React.ReactNode; color: string }[] = [
    {
      field: 'facebook',
      label: 'Facebook Profile URL',
      placeholder: 'https://facebook.com/yourprofile',
      icon: <FaFacebookF className="text-blue-500" size={18} />,
      color: 'border-blue-500/30',
    },
    {
      field: 'linkedin',
      label: 'LinkedIn Profile URL',
      placeholder: 'https://linkedin.com/in/yourprofile',
      icon: <FaLinkedinIn className="text-cyan-400" size={18} />,
      color: 'border-cyan-500/30',
    },
    {
      field: 'instagram',
      label: 'Instagram Profile URL',
      placeholder: 'https://instagram.com/yourprofile',
      icon: <FaInstagram className="text-pink-500" size={18} />,
      color: 'border-pink-500/30',
    },
    {
      field: 'youtube',
      label: 'YouTube Channel URL',
      placeholder: 'https://youtube.com/@yourchannel',
      icon: <FaYoutube className="text-red-500" size={18} />,
      color: 'border-red-500/30',
    },
    {
      field: 'github',
      label: 'GitHub Profile URL',
      placeholder: 'https://github.com/yourusername',
      icon: <FaGithub className="text-purple-400" size={18} />,
      color: 'border-purple-500/30',
    },
    {
      field: 'twitter',
      label: 'Twitter / X Profile URL',
      placeholder: 'https://x.com/yourhandle',
      icon: <FaTwitter className="text-sky-400" size={18} />,
      color: 'border-sky-500/30',
    },
  ];

  const activeCount = Object.values(links).filter((val) => Boolean(val && val.trim() !== '')).length;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Social Media Links</h1>
          <p className="mt-1 text-sm text-white/50">
            Configure your active social links. Leave any platform URL empty to automatically hide its icon from the landing page.
          </p>
        </div>
        <button
          onClick={() => void fetchSocialLinks()}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur hover:bg-white/10 transition"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Feedback Message */}
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

      {/* Live Active Icons Preview Banner */}
      <div className="rounded-3xl border border-white/10 bg-[#08101f] p-6 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Live Landing Page Preview</span>
          <span className="text-xs text-white/50">{activeCount} of 6 icons visible on landing page</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {platforms.map((p) => {
            const hasLink = Boolean(links[p.field] && links[p.field].trim() !== '');
            return (
              <div
                key={p.field}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  hasLink
                    ? `${p.color} bg-white/10 text-white shadow-md`
                    : 'border-white/5 bg-white/5 text-white/20 line-through'
                }`}
              >
                {p.icon}
                <span>{p.field}</span>
                {hasLink ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                ) : (
                  <span className="text-[10px] text-white/30">(Hidden)</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Fields */}
      <div className="rounded-3xl border border-white/10 bg-[#08101f] p-6 shadow-xl space-y-6">
        <h2 className="text-lg font-bold text-white border-b border-white/10 pb-3">Edit Social URLs</h2>

        {loading ? (
          <div className="py-12 text-center text-sm text-white/40">Loading social links...</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {platforms.map((p) => (
              <div key={p.field} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-semibold text-white/70">
                    {p.icon}
                    <span>{p.label}</span>
                  </label>
                  {links[p.field] && (
                    <button
                      onClick={() => handleChange(p.field, '')}
                      className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition"
                      title="Clear & hide icon"
                    >
                      <FiTrash2 size={12} />
                      Clear
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  value={links[p.field]}
                  onChange={(e) => handleChange(p.field, e.target.value)}
                  placeholder={p.placeholder}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50 transition"
                />
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={() => void handleSave()}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 px-8 py-3 text-sm font-bold text-white shadow-lg hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 transition"
          >
            {saving ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
            <span>{saving ? 'Saving...' : 'Save Social Links'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
