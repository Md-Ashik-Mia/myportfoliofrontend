"use client";

import React, { useState, useEffect } from "react";
import AuroraView from "../auroratext/Auroratext";
import NoiseCard from "../noise-card/NoiseCard";
import ShimmerButton from "./ShimmerButton";

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
    <div id="projects" className="min-h-screen py-24 flex flex-col items-center justify-center">
      <AuroraView normaltext="My" highlighttext="Projects" />
      <p className="text-white/45 text-center text-sm sm:text-base max-w-[60ch] mt-4 px-4 mb-12">
        I like exploring and learning new. I always build projects to try out new
        tools and concepts.
      </p>

      {loading ? (
        <div className="flex h-[300px] items-center justify-center text-white/50">
          Loading projects...
        </div>
      ) : projects.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center text-white/45">
          No projects found. Add projects from the Admin Dashboard!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full px-4 sm:px-6 md:px-8 max-w-[1400px]">
          {projects.map((project) => (
            <NoiseCard
              key={project._id}
              className="h-[520px] rounded-[22px] border border-[#164962] px-4 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.18)] sm:px-6 flex flex-col justify-between"
              bgColor="bg-[#08101F]"
              noiseOpacity={0.09}
              grainSize={1}
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  {project.iframeUrl ? (
                    <iframe
                      src={project.iframeUrl}
                      width="100%"
                      height="230"
                      title={project.title}
                      className="rounded-lg border border-white/5 bg-black/30"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-[230px] rounded-lg bg-linear-to-br from-[#0d1632] to-[#090e1c] flex items-center justify-center text-white/30 border border-white/5 text-sm">
                      Interactive Preview Not Available
                    </div>
                  )}
                  <div className="flex justify-between items-start mt-4 gap-2">
                    <h3 className="text-white text-lg font-bold leading-tight line-clamp-1">{project.title}</h3>
                    <span className="text-[#a0c4ff] text-xs px-2 py-0.5 rounded-full border border-[#164962] bg-[#0a1929]/55 whitespace-nowrap">{project.type}</span>
                  </div>
                  <p className="mt-3 text-sm text-[#94a3b8] line-clamp-4 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="mt-4 flex justify-between items-center gap-4">
                  {project.codeUrl ? (
                    <ShimmerButton href={project.codeUrl} text="Code" icon="" />
                  ) : (
                    <div className="w-32 h-14" /> /* spacer */
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-14 items-center gap-3 rounded-xl bg-[#194BFB] px-10 text-base font-semibold text-white shadow-[0_15px_40px_rgba(47,98,255,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#3d73ff] hover:shadow-[0_15px_50px_rgba(47,98,255,0.55)]"
                    >
                      Live
                    </a>
                  )}
                </div>
              </div>
            </NoiseCard>
          ))}
        </div>
      )}
    </div>
  );
}
