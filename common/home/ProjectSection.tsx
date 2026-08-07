"use client";

import React, { useState, useEffect } from "react";
import AuroraView from "../auroratext/Auroratext";
import NoiseCard from "../noise-card/NoiseCard";
import ShimmerButton from "./ShimmerButton";
import { GsapReveal, GsapStagger } from "../gsap/GsapAnimations";
import { FiPlay, FiExternalLink, FiCode } from "react-icons/fi";

interface Project {
  _id: string;
  title: string;
  type: string;
  description: string;
  iframeUrl: string;
  codeUrl: string;
  liveUrl: string;
  status: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

function ProjectPreview({ project }: { project: Project }) {
  const [showIframe, setShowIframe] = useState(false);

  if (showIframe && project.iframeUrl) {
    return (
      <div className="relative w-full h-[220px] rounded-xl overflow-hidden border border-white/10 bg-black/80">
        <iframe
          src={project.iframeUrl}
          width="100%"
          height="100%"
          title={project.title}
          className="w-full h-full border-0"
          loading="lazy"
        />
        <button
          onClick={() => setShowIframe(false)}
          className="absolute top-2 right-2 px-2.5 py-1 text-xs font-semibold rounded-md bg-black/80 text-white/80 hover:text-white backdrop-blur border border-white/10"
        >
          Close Demo
        </button>
      </div>
    );
  }

  return (
    <div className="group relative w-full h-[220px] rounded-xl overflow-hidden bg-gradient-to-br from-[#0c1633] via-[#091024] to-[#050814] border border-white/8 flex flex-col items-center justify-center p-6 text-center transition-all duration-300">
      <div className="absolute inset-0 bg-radial from-[#2f62ff]/15 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f62ff]/15 border border-[#2f62ff]/30 text-[#2f62ff] shadow-[0_0_20px_rgba(47,98,255,0.2)] mb-3 group-hover:scale-110 transition-transform duration-300">
          <FiCode size={22} />
        </div>
        <h4 className="text-white font-bold text-base line-clamp-1">{project.title}</h4>
        <span className="text-xs text-white/40 mt-1">{project.type}</span>

        {project.iframeUrl && (
          <button
            onClick={() => setShowIframe(true)}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#2f62ff]/40 bg-[#2f62ff]/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-[#2f62ff] hover:shadow-[0_0_20px_rgba(47,98,255,0.4)]"
          >
            <FiPlay size={12} />
            Load Interactive Demo
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProjectSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/projects?status=Published`);
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

    fetchProjects();
  }, []);

  return (
    <div id="projects" className="min-h-screen py-20 flex flex-col items-center justify-center">
      <GsapReveal direction="up">
        <AuroraView normaltext="My" highlighttext="Projects" />
      </GsapReveal>
      
      <GsapReveal direction="up" delay={0.1}>
        <p className="text-white/45 text-center text-sm sm:text-base max-w-[60ch] mt-3 px-4 mb-12">
          Explore built web platforms and applications optimized for 60fps performance and high responsiveness.
        </p>
      </GsapReveal>

      {loading ? (
        <div className="flex h-[250px] items-center justify-center text-white/50">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center text-white/45">
          No projects found. Add projects from the Admin Dashboard!
        </div>
      ) : (
        <GsapStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4 sm:px-6 md:px-8 max-w-[1400px]">
          {projects.map((project) => (
            <NoiseCard
              key={project._id}
              className="h-[500px] rounded-[22px] border border-[#164962] px-4 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)] sm:px-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:border-[#2f62ff]/50 hover:shadow-[0_20px_60px_rgba(47,98,255,0.25)] transform-gpu"
              bgColor="bg-[#08101F]"
              noiseOpacity={0.09}
              grainSize={1}
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <ProjectPreview project={project} />

                  <div className="flex justify-between items-start mt-4 gap-2">
                    <h3 className="text-white text-lg font-bold leading-tight line-clamp-1">{project.title}</h3>
                    <span className="text-[#a0c4ff] text-xs px-2.5 py-1 rounded-full border border-[#164962] bg-[#0a1929]/55 whitespace-nowrap">{project.type}</span>
                  </div>
                  <p className="mt-2.5 text-sm text-[#94a3b8] line-clamp-3 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center gap-4">
                  {project.codeUrl ? (
                    <ShimmerButton href={project.codeUrl} text="Code" icon="" />
                  ) : (
                    <div className="w-32 h-12" />
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#194BFB] px-8 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(47,98,255,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#3d73ff] hover:shadow-[0_12px_40px_rgba(47,98,255,0.5)]"
                    >
                      Live <FiExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </NoiseCard>
          ))}
        </GsapStagger>
      )}
    </div>
  );
}
