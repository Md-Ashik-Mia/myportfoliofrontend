"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX, FiUsers, FiTwitter, FiInstagram, FiFacebook } from "react-icons/fi";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  imageUrl: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getAdminHeaders = () => {
    const token = typeof window !== "undefined" ? window.localStorage.getItem("admin-token") || "" : "";
    return {
      "x-admin-token": token,
      "Content-Type": "application/json",
    };
  };

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchTeam = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/team`, {
          headers: getAdminHeaders(),
        });
        if (response.ok) {
          const json = await response.json();
          setMembers(json.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch team:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchTeam();
  }, [refreshTrigger]);

  const handleEdit = (member: TeamMember) => {
    setIsEditing(true);
    setCurrentId(member._id);
    setName(member.name);
    setRole(member.role);
    setImageUrl(member.imageUrl);
    setTwitter(member.twitter || "");
    setInstagram(member.instagram || "");
    setFacebook(member.facebook || "");
    setFormError("");
  };

  const handleResetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setName("");
    setRole("");
    setImageUrl("");
    setTwitter("");
    setInstagram("");
    setFacebook("");
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !imageUrl.trim()) {
      setFormError("Name, role, and image URL are required.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    const payload = { name, role, imageUrl, twitter, instagram, facebook };
    const url = isEditing ? `${API_BASE_URL}/api/team/${currentId}` : `${API_BASE_URL}/api/team`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: getAdminHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errPayload = await response.json();
        throw new Error(errPayload.message || "Failed to save team member.");
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
    if (!window.confirm("Are you sure you want to delete this team member?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/team/${id}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete team member.");
      }

      setRefreshTrigger((prev) => prev + 1);
      if (currentId === id) {
        handleResetForm();
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting team member.");
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
      {/* Team Roster */}
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-white/35">Team</div>
            <h2 className="text-2xl font-bold tracking-[-0.04em]">Manage dynamic team members</h2>
          </div>
          {isEditing && (
            <button
              onClick={handleResetForm}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
            >
              <FiPlus /> Add Member
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex h-[300px] items-center justify-center text-white/40">
            Loading team list...
          </div>
        ) : members.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-white/40 border border-dashed border-white/10 rounded-2xl">
            No team members in database. Create one on the right!
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <article
                key={member._id}
                className="rounded-[28px] border border-white/10 bg-[#090f20] p-5 transition hover:border-white/20 flex flex-col justify-between items-center text-center"
              >
                <div className="flex flex-col items-center">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-20 h-20 rounded-full object-cover ring-2 ring-white/10"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = `https://placehold.co/150x150/101f30/ffffff?text=${member.name[0]}`;
                    }}
                  />
                  <h3 className="mt-4 text-lg font-bold text-white leading-tight">{member.name}</h3>
                  <span className="mt-1 text-xs text-white/55 px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.02]">{member.role}</span>
                  
                  {/* Social media presence */}
                  <div className="flex gap-3 mt-4 text-white/35">
                    {member.twitter && <FiTwitter size={14} className="hover:text-sky-400 transition" />}
                    {member.instagram && <FiInstagram size={14} className="hover:text-pink-400 transition" />}
                    {member.facebook && <FiFacebook size={14} className="hover:text-blue-500 transition" />}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-center gap-2 w-full">
                  <button
                    onClick={() => handleEdit(member)}
                    className="p-2 rounded-xl bg-white/5 text-white/70 hover:bg-[#2f62ff]/20 hover:text-[#7fb0ff] transition"
                    title="Edit member"
                  >
                    <FiEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="p-2 rounded-xl bg-white/5 text-white/70 hover:bg-rose-500/20 hover:text-rose-400 transition"
                    title="Delete member"
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
            <FiUsers />
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-white/35">Team Roster Editor</div>
            <div className="font-semibold text-white">{isEditing ? "Edit details" : "Add member"}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-white/45 mb-1.5 font-medium">Name</label>
            <input
              type="text"
              placeholder="e.g. Zane Whitaker"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-white/[0.06] transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/45 mb-1.5 font-medium">Role</label>
            <input
              type="text"
              placeholder="e.g. Founder & CEO, Lead Developer"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-white/[0.06] transition"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-white/45 mb-1.5 font-medium">Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or postimg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-white/[0.06] transition"
              required
            />
          </div>

          <div className="border-t border-white/5 pt-4">
            <h4 className="text-xs font-semibold text-white/45 uppercase tracking-wider mb-3">Social Handles (Optional)</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-white/35 mb-1.5">Twitter URL</label>
                <input
                  type="url"
                  placeholder="https://twitter.com/..."
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-white/[0.06] transition"
                />
              </div>

              <div>
                <label className="block text-xs text-white/35 mb-1.5">Instagram URL</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-white/[0.06] transition"
                />
              </div>

              <div>
                <label className="block text-xs text-white/35 mb-1.5">Facebook URL</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/..."
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-white/[0.06] transition"
                />
              </div>
            </div>
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
              <FiSave /> {submitting ? "Saving..." : isEditing ? "Update" : "Save Member"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
