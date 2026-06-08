"use client";

import { useEffect, useState } from "react";
import { FiArrowUpRight, FiClock, FiLayers, FiUsers, FiMessageSquare } from "react-icons/fi";
import Link from "next/link";

interface Metric {
  label: string;
  value: string | number;
  delta: string;
  link: string;
}

interface Project {
  _id: string;
  title: string;
  status: string;
  type: string;
}

interface CommunityFeedback {
  approved: boolean;
}

interface GalleryItem {
  type: "image" | "video";
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: "Projects published", value: "...", delta: "Loading projects...", link: "/admin/dashboard/projects" },
    { label: "Team members", value: "...", delta: "Loading team...", link: "/admin/dashboard/team" },
    { label: "Gallery achievements", value: "...", delta: "Loading gallery...", link: "/admin/dashboard/gallery" },
  ]);
  const [pendingCount, setPendingCount] = useState<number | "...">("...");
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("admin-token") || "" : "";
      const adminHeaders = {
        "x-admin-token": token,
        "Content-Type": "application/json",
      };

      try {
        // Fetch projects
        const projRes = await fetch(`${API_BASE_URL}/api/projects`, { headers: adminHeaders });
        const projJson = projRes.ok ? await projRes.json() : { data: [] };
        const projects: Project[] = projJson.data || [];

        // Fetch team
        const teamRes = await fetch(`${API_BASE_URL}/api/team`, { headers: adminHeaders });
        const teamJson = teamRes.ok ? await teamRes.json() : { data: [] };
        const team = teamJson.data || [];

        // Fetch gallery
        const galRes = await fetch(`${API_BASE_URL}/api/gallery`, { headers: adminHeaders });
        const galJson = galRes.ok ? await galRes.json() : { data: [] };
        const gallery: GalleryItem[] = galJson.data || [];

        // Fetch community feedback (admin endpoint)
        const commRes = await fetch(`${API_BASE_URL}/api/community/admin`, { headers: adminHeaders });
        const commJson = commRes.ok ? await commRes.json() : { data: [] };
        const community: CommunityFeedback[] = commJson.data || [];
        const pending = community.filter((c) => !c.approved).length;

        // Set metrics
        setMetrics([
          {
            label: "Projects published",
            value: projects.filter((p) => p.status === "Published").length,
            delta: `${projects.filter((p) => p.status !== "Published").length} drafts/reviews`,
            link: "/admin/dashboard/projects",
          },
          {
            label: "Team members",
            value: team.length,
            delta: "Active roster",
            link: "/admin/dashboard/team",
          },
          {
            label: "Gallery achievements",
            value: gallery.length,
            delta: `${gallery.filter((g) => g.type === "video").length} videos, ${gallery.filter((g) => g.type === "image").length} photos`,
            link: "/admin/dashboard/gallery",
          },
        ]);

        setPendingCount(pending);
        setRecentProjects(projects.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch dashboard overview metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      {/* Metrics Row */}
      <section className="grid gap-4 md:grid-cols-3 xl:col-span-2">
        {metrics.map((metric) => (
          <Link
            href={metric.link}
            key={metric.label}
            className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.08]"
          >
            <div className="text-sm text-white/45">{metric.label}</div>
            <div className="mt-3 text-4xl font-black tracking-[-0.06em]">{metric.value}</div>
            <div className="mt-3 text-sm text-[#7fb0ff]/80">{metric.delta}</div>
          </Link>
        ))}
      </section>

      {/* Upload/Moderation Queue */}
      <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0d1632] to-[#090e1c] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.3)] flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-white/70">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2f62ff] text-white shadow-[0_0_20px_rgba(47,98,255,0.4)]">
              <FiMessageSquare />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.22em] text-white/35">Moderation Queue</div>
              <div className="font-semibold text-white">Pending Testimonials</div>
            </div>
          </div>

          <div className="mt-8 text-center py-6 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <div className="text-5xl font-black text-[#7fb0ff] tracking-tighter">
              {pendingCount}
            </div>
            <p className="mt-2 text-sm text-white/50">Testimonials waiting for approval</p>
          </div>
        </div>

        <Link
          href="/admin/dashboard/community"
          className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2f62ff] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3b70ff]"
        >
          Open Moderation Panel
          <FiArrowUpRight />
        </Link>
      </section>

      {/* Recent Projects */}
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl xl:col-span-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-white/35">Pipeline</div>
            <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em]">Recent projects</h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-white/65">
            <FiClock />
            {loading ? "Refreshing..." : "Synced with DB"}
          </div>
        </div>

        {recentProjects.length === 0 ? (
          <div className="mt-8 text-center py-12 text-white/40 text-sm border border-dashed border-white/5 rounded-3xl">
            No projects in pipeline. Add some projects to get started!
          </div>
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <article
                key={project._id}
                className="rounded-[28px] border border-white/10 bg-[#090f20] p-5 transition hover:-translate-y-1 hover:border-white/20 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5">
                      <FiLayers />
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

                  <h3 className="mt-5 text-xl font-bold text-white line-clamp-1">{project.title}</h3>
                  <p className="mt-2 text-sm text-white/50 line-clamp-1">{project.type}</p>
                </div>

                <Link
                  href="/admin/dashboard/projects"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#7fb0ff]"
                >
                  Manage projects
                  <FiArrowUpRight />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Guide / Quick Help Section */}
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl xl:col-span-2">
        <div className="flex items-center gap-3">
          <FiUsers className="text-[#7fb0ff] text-xl" />
          <h2 className="text-xl font-bold">Quick Administration Guide</h2>
        </div>
        <p className="mt-2 text-sm text-white/50">
          Use the left sidebar navigation items to manage different modules. Testimonials submitted by visitors logging in with Google will show up in the &quot;Moderation Queue&quot; above, where you can approve them to be displayed on the landing page bento grid.
        </p>
      </section>
    </div>
  );
}