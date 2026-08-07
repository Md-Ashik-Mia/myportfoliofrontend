"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiLayers, FiEye, FiLayout } from "react-icons/fi";

interface Project {
  _id: string;
  title: string;
  type: string;
  description: string;
  iframeUrl: string;
  codeUrl: string;
  liveUrl: string;
  status: "Draft" | "Published" | "Review";
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");
  const [codeUrl, setCodeUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [status, setStatus] = useState<"Draft" | "Published" | "Review">("Published");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getAdminHeaders = () => {
    const token = (typeof window !== "undefined" && window.localStorage.getItem("admin-token")) || "portfolio-admin-token";
    return {
      "x-admin-token": token,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/projects`, {
          headers: getAdminHeaders(),
        });
        if (response.ok) {
          const json = await response.json();
          setProjects(json.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchProjects();
  }, [refreshTrigger]);

  const handleEdit = (project: Project) => {
    setIsEditing(true);
    setCurrentId(project._id);
    setTitle(project.title);
    setType(project.type);
    setDescription(project.description);
    setIframeUrl(project.iframeUrl);
    setCodeUrl(project.codeUrl);
    setLiveUrl(project.liveUrl);
    setStatus(project.status);
    setFormError("");
  };

  const handleResetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitle("");
    setType("");
    setDescription("");
    setIframeUrl("");
    setCodeUrl("");
    setLiveUrl("");
    setStatus("Published");
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !type.trim() || !description.trim()) {
      setFormError("Title, type, and description are required.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    const payload = { title, type, description, iframeUrl, codeUrl, liveUrl, status };
    const url = isEditing ? `${API_BASE_URL}/api/projects/${currentId}` : `${API_BASE_URL}/api/projects`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: getAdminHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errPayload = await response.json();
        throw new Error(errPayload.message || "Failed to save project.");
      }

      handleResetForm();
      setRefreshTrigger((prev) => prev + 1);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Something went wrong.";
      setFormError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    setProjects((prev) => prev.filter((p) => p._id !== id));
    if (currentId === id) {
      handleResetForm();
    }

    try {
      await fetch(`${API_BASE_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      {/* List of projects */}
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-white/35">Projects</div>
            <h2 className="text-2xl font-bold tracking-[-0.04em]">Manage dynamic projects</h2>
          </div>
          {isEditing && (
            <button
              onClick={handleResetForm}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
            >
              <FiPlus /> Add New Project
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex h-[300px] items-center justify-center text-white/40">
            Loading project pipeline...
          </div>
        ) : projects.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-white/40 border border-dashed border-white/10 rounded-2xl">
            No projects in database. Create one on the right!
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project._id}
                className="rounded-[28px] border border-white/10 bg-[#090f20] p-5 transition hover:border-white/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-white/70">
                      <FiLayout />
                    </div>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        project.status === "Published"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                          : project.status === "Draft"
                          ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                          : "border-cyan-500/20 bg-cyan-500/10 text-cyan-300"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold text-white line-clamp-1">{project.title}</h3>
                  <p className="mt-1 text-xs text-white/50">{project.type}</p>
                  <p className="mt-3 text-sm text-[#94a3b8] line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 rounded-xl bg-white/5 text-white/70 hover:bg-[#2f62ff]/20 hover:text-[#7fb0ff] transition"
                    title="Edit project"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="p-2 rounded-xl bg-white/5 text-white/70 hover:bg-rose-500/20 hover:text-rose-400 transition"
                    title="Delete project"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Editor sidebar panel */}
      <section className="rounded-[32px] border border-white/10 bg-[#090f20] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2f62ff] text-white shadow-[0_0_15px_rgba(47,98,255,0.3)]">
            <FiLayers />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-white/35">Project Editor</div>
            <div className="font-semibold text-white">{isEditing ? "Edit details" : "Add new project"}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/45 mb-1.5 font-medium">Project Title</label>
            <input
              type="text"
              placeholder="e.g. Extra Handen AI"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-white/[0.06] transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/45 mb-1.5 font-medium">Project Type</label>
            <input
              type="text"
              placeholder="e.g. Educational Platform"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-white/[0.06] transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/45 mb-1.5 font-medium">Description</label>
            <textarea
              rows={4}
              placeholder="Provide a detailed description of the project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-white/[0.06] transition resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/45 mb-1.5 font-medium">Preview Iframe URL</label>
            <input
              type="url"
              placeholder="e.g. https://extrahanden.ai/"
              value={iframeUrl}
              onChange={(e) => setIframeUrl(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-white/[0.06] transition"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/45 mb-1.5 font-medium">Code (GitHub) URL</label>
            <input
              type="url"
              placeholder="https://github.com/..."
              value={codeUrl}
              onChange={(e) => setCodeUrl(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-white/[0.06] transition"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/45 mb-1.5 font-medium">Live Website URL</label>
            <input
              type="url"
              placeholder="https://..."
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-white/[0.06] transition"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/45 mb-1.5 font-medium">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "Draft" | "Published" | "Review")}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-[#090f20] transition cursor-pointer"
            >
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
              <option value="Review">Review</option>
            </select>
          </div>

          {formError && (
            <p className="text-rose-400 text-xs font-semibold">{formError}</p>
          )}

          <div className="flex gap-2 pt-2">
            {isEditing && (
              <button
                type="button"
                onClick={handleResetForm}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/70 hover:bg-white/5 transition"
              >
                <FiX /> Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="flex-2 w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2f62ff] hover:bg-[#3b70ff] disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 transition shadow-[0_10px_20px_rgba(47,98,255,0.2)]"
            >
              <FiSave /> {submitting ? "Saving..." : isEditing ? "Update" : "Save Project"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}