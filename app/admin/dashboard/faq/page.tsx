'use client';

import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiHelpCircle, FiX, FiCheckCircle } from 'react-icons/fi';

interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const TOKEN_KEY = 'admin-token';

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [order, setOrder] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/faqs`);
      if (res.ok) {
        const json = await res.json();
        setFaqs(json.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setQuestion('');
    setAnswer('');
    setCategory('General');
    setOrder(faqs.length + 1);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: FaqItem) => {
    setEditingId(item._id);
    setQuestion(item.question);
    setAnswer(item.answer);
    setCategory(item.category || 'General');
    setOrder(item.order || 0);
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ question?')) return;
    const token = localStorage.getItem(TOKEN_KEY);

    try {
      const res = await fetch(`${API_BASE_URL}/api/faqs/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-token': token || '',
          Authorization: `Bearer ${token || ''}`,
        },
      });

      if (res.ok) {
        setFaqs((prev) => prev.filter((f) => f._id !== id));
      } else {
        alert('Failed to delete FAQ.');
      }
    } catch (err) {
      console.error('Error deleting FAQ:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setErrorMsg('Question and Answer are required.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    const token = localStorage.getItem(TOKEN_KEY);

    const payload = {
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim(),
      order: Number(order),
    };

    try {
      const url = editingId
        ? `${API_BASE_URL}/api/faqs/${editingId}`
        : `${API_BASE_URL}/api/faqs`;
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token || '',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to save FAQ.');
      }

      setIsModalOpen(false);
      fetchFaqs();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f62ff]/20 border border-[#2f62ff]/40 text-[#2f62ff]">
            <FiHelpCircle className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-white/50">Manage dynamic FAQs displayed on your portfolio landing page</p>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2f62ff] hover:bg-[#3b70ff] px-5 py-3 text-sm font-semibold text-white transition shadow-[0_10px_30px_rgba(47,98,255,0.35)]"
        >
          <FiPlus />
          Add New FAQ
        </button>
      </div>

      {/* FAQs List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white/50">
          Loading FAQs...
        </div>
      ) : faqs.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-white/10 bg-white/5 text-white/50">
          <FiHelpCircle size={36} />
          <p className="text-sm">No FAQs found. Click "Add New FAQ" to create your first item!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {faqs.map((item) => (
            <div
              key={item._id}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition hover:border-[#2f62ff]/40 hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-[#2f62ff]">
                      {item.category || 'General'}
                    </span>
                    <span className="text-xs text-white/35">Order: {item.order}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{item.question}</h3>
                  <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{item.answer}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/15 hover:text-white"
                    title="Edit FAQ"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 transition hover:bg-rose-500 hover:text-white"
                    title="Delete FAQ"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-gradient-to-br from-[#0c142c] via-[#080d1e] to-[#04060e] p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.85)] text-white relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-white/40 hover:text-white transition"
            >
              <FiX size={22} />
            </button>

            <h3 className="text-2xl font-bold tracking-tight mb-2">
              {editingId ? 'Edit FAQ Item' : 'Add New FAQ Item'}
            </h3>
            <p className="text-white/50 text-xs mb-6">
              This question and answer will appear live in the portfolio FAQ accordion.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-white/45 mb-2 font-medium">Question</label>
                <input
                  type="text"
                  placeholder="e.g. What services do you provide?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2f62ff]/60 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/45 mb-2 font-medium">Answer</label>
                <textarea
                  rows={4}
                  placeholder="Provide a clear, detailed answer..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2f62ff]/60 transition resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/45 mb-2 font-medium">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. General, Process, Timeline"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2f62ff]/60 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/45 mb-2 font-medium">Display Order</label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2f62ff]/60 transition"
                  />
                </div>
              </div>

              {errorMsg && <div className="text-rose-400 text-xs font-semibold">{errorMsg}</div>}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-semibold text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl bg-[#2f62ff] hover:bg-[#3d73ff] disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-[#2f62ff]/25 transition"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update FAQ' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
