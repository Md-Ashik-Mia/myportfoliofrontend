"use client";

import { useState, useEffect, useCallback } from "react";
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiImage, FiVideo, FiPlay } from "react-icons/fi";
import ImgBBUploader from "@/common/admin/ImgBBUploader";


interface GalleryItem {
  _id: string;
  title: string;
  subtitle: string;
  type: "image" | "video";
  mediaUrl: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [type, setType] = useState<"image" | "video">("image");
  const [mediaUrl, setMediaUrl] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getAdminHeaders = () => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("admin-token") || "" : "";
    return {
      "x-admin-token": token,
      "Content-Type": "application/json",
    };
  };

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery`, {
        headers: getAdminHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        setItems(json.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch gallery items:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchGallery();
  }, [fetchGallery]);

  const handleEdit = (item: GalleryItem) => {
    setIsEditing(true);
    setCurrentId(item._id);
    setTitle(item.title);
    setSubtitle(item.subtitle);
    setType(item.type);
    setMediaUrl(item.mediaUrl);
    setFormError("");
  };

  const handleResetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitle("");
    setSubtitle("");
    setType("image");
    setMediaUrl("");
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subtitle.trim() || !mediaUrl.trim()) {
      setFormError("Title, event subtitle, and media URL are required.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    const payload = { title, subtitle, type, mediaUrl };
    const url = isEditing ? `${API_BASE_URL}/api/gallery/${currentId}` : `${API_BASE_URL}/api/gallery`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: getAdminHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errPayload = await response.json();
        throw new Error(errPayload.message || "Failed to save achievement.");
      }

      handleResetForm();
      fetchGallery();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Something went wrong.";
      setFormError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this achievement?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete achievement.");
      }

      fetchGallery();
      if (currentId === id) {
        handleResetForm();
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting achievement.");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      {/* Achievements List */}
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-white/35">Gallery</div>
            <h2 className="text-2xl font-bold tracking-[-0.04em]">Manage dynamic achievements & gallery</h2>
          </div>
          {isEditing && (
            <button
              onClick={handleResetForm}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
            >
              <FiPlus /> Add Achievement
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex h-[300px] items-center justify-center text-white/40">
            Loading achievements...
          </div>
        ) : items.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-white/40 border border-dashed border-white/10 rounded-2xl">
            No gallery items found. Create one on the right!
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article
                key={item._id}
                className="rounded-[28px] border border-white/10 bg-[#090f20] p-4 transition hover:border-white/20 flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/40 border border-white/5">
                    {item.type === "video" ? (
                      <div className="w-full h-full flex items-center justify-center relative bg-slate-900/60">
                        <video src={item.mediaUrl} className="w-full h-full object-cover" muted loop playsInline />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <FiPlay className="text-white text-3xl opacity-80" />
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = `https://placehold.co/400x300/101f30/ffffff?text=Image+Not+Found`;
                        }}
                      />
                    )}
                    <span className="absolute top-2 right-2 rounded-full bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] text-white/70 flex items-center gap-1">
                      {item.type === "video" ? <FiVideo /> : <FiImage />} {item.type}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-white line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-white/45 mt-0.5 line-clamp-1">{item.subtitle}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded-xl bg-white/5 text-white/70 hover:bg-[#2f62ff]/20 hover:text-[#7fb0ff] transition"
                    title="Edit achievement"
                  >
                    <FiEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-xl bg-white/5 text-white/70 hover:bg-rose-500/20 hover:text-rose-400 transition"
                    title="Delete achievement"
                  >
                    <FiTrash2 size={14} />
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
            <FiImage />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-white/35">Gallery Editor</div>
            <div className="font-semibold text-white">{isEditing ? "Edit details" : "Add achievement"}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/45 mb-1.5 font-medium">Achievement Title</label>
            <input
              type="text"
              placeholder="e.g. National Hackathon Winner"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-white/[0.06] transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/45 mb-1.5 font-medium">Event Name (Subtitle)</label>
            <input
              type="text"
              placeholder="e.g. National ICT Division Event"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-white/[0.06] transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/45 mb-1.5 font-medium">Media Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "image" | "video")}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-[#090f20] transition cursor-pointer"
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
          </div>

          {type === "image" ? (
            <ImgBBUploader
              value={mediaUrl}
              onChange={(url) => setMediaUrl(url)}
              label="Gallery Image (Upload to ImgBB)"
              placeholder="Upload photo or paste ImgBB link"
            />
          ) : (
            <div>
              <label className="block text-xs uppercase tracking-wider text-white/45 mb-1.5 font-medium">Video Source URL</label>
              <input
                type="url"
                placeholder="https://assets.mixkit.co/... .mp4"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-white/[0.06] transition"
                required
              />
            </div>
          )}


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
              <FiSave /> {submitting ? "Saving..." : isEditing ? "Update" : "Save Item"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
