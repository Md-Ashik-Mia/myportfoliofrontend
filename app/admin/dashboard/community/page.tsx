"use client";

import { useState, useEffect } from "react";
import { FiCheck, FiX, FiTrash2, FiMessageSquare, FiAlertCircle } from "react-icons/fi";

interface Testimonial {
  _id: string;
  name: string;
  position: string;
  avatar: string;
  feedback: string;
  approved: boolean;
  createdAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function AdminCommunityPage() {
  const [feedbacks, setFeedbacks] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const getAdminHeaders = () => {
    const token = (typeof window !== "undefined" && window.localStorage.getItem("admin-token")) || "portfolio-admin-token";
    return {
      "x-admin-token": token,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/community/admin`, {
        headers: getAdminHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        setFeedbacks(json.data || []);
      }
    } catch (error) {
      console.error("Failed to load feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleToggleApproval = async (item: Testimonial) => {
    const updatedApproved = !item.approved;
    setFeedbacks((prev) =>
      prev.map((f) => (f._id === item._id ? { ...f, approved: updatedApproved } : f))
    );

    try {
      await fetch(`${API_BASE_URL}/api/community/${item._id}`, {
        method: "PUT",
        headers: getAdminHeaders(),
        body: JSON.stringify({
          ...item,
          approved: updatedApproved,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;

    // Immediately remove item locally for instant feedback
    setFeedbacks((prev) => prev.filter((f) => f._id !== id));


    try {
      await fetch(`${API_BASE_URL}/api/community/${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const pendingList = feedbacks.filter((f) => !f.approved);
  const approvedList = feedbacks.filter((f) => f.approved);

  return (
    <div className="space-y-8">
      {/* Moderation Panel Header */}
      <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0d1632] to-[#090e1c] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2f62ff] text-white">
            <FiMessageSquare />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-white/35">Community Testimonials</div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Moderation dashboard</h1>
          </div>
        </div>
        <p className="mt-3 text-sm text-white/50 max-w-2xl leading-relaxed">
          Here you can review client and user feedback submitted through the Google log in portal on the landing page. Approve them to immediately display them on the homepage Bento Grid, or disapprove/delete them as needed.
        </p>
      </div>

      {loading ? (
        <div className="flex h-[200px] items-center justify-center text-white/40">
          Loading feedbacks...
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Reviews */}
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-amber-400" />
              <h2 className="text-xl font-bold text-white">Pending Approval ({pendingList.length})</h2>
            </div>

            {pendingList.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-12 text-white/35 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                <FiAlertCircle />
                <span className="text-sm">No feedback waiting for review.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingList.map((item) => (
                  <article key={item._id} className="rounded-2xl border border-white/10 bg-[#090f20] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <div className="text-sm font-bold text-white">{item.name}</div>
                          <div className="text-xs text-white/40">{item.position}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleApproval(item)}
                          className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition"
                          title="Approve and Publish"
                        >
                          <FiCheck size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-[#94a3b8] italic leading-relaxed">
                      "{item.feedback}"
                    </p>
                    <div className="mt-3 text-[10px] text-white/25">
                      Submitted on {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Approved & Live Feedbacks */}
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
              <h2 className="text-xl font-bold text-white">Live on Landing Page ({approvedList.length})</h2>
            </div>

            {approvedList.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-12 text-white/35 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                <FiAlertCircle />
                <span className="text-sm">No live feedback. Approve some testimonials!</span>
              </div>
            ) : (
              <div className="space-y-4">
                {approvedList.map((item) => (
                  <article key={item._id} className="rounded-2xl border border-white/10 bg-[#090f20] p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-10 h-10 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <div className="text-sm font-bold text-white">{item.name}</div>
                          <div className="text-xs text-white/40">{item.position}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleApproval(item)}
                          className="p-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition"
                          title="Hide from Landing Page"
                        >
                          <FiX size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-[#94a3b8] leading-relaxed">
                      "{item.feedback}"
                    </p>
                    <div className="mt-3 text-[10px] text-white/25">
                      Published on {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
