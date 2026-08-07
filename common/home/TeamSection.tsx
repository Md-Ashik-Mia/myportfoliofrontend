"use client";

import React, { useState, useEffect } from "react";
import AuroraView from "../auroratext/Auroratext";
import { GsapReveal, GsapStagger, GsapCard3DTilt } from "../gsap/GsapAnimations";


type TeamMember = {
  _id?: string;
  name: string;
  role: string;
  imageUrl: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
};

// Fallback initial team members if DB is empty
const initialTeamMembers: TeamMember[] = [
  {
    name: "Zane Whitaker",
    role: "Founder & CEO",
    imageUrl: "https://i.postimg.cc/W1rCvYnT/nazmul-hossain.jpg",
  },
  {
    name: "Emily Jonson",
    role: "CEO",
    imageUrl: "https://i.pinimg.com/736x/8c/6d/db/8c6ddb5fe6600fcc4b183cb2ee228eb7.jpg",
  },
  {
    name: "Harshita Patel",
    role: "HR",
    imageUrl: "https://i.pinimg.com/736x/6f/a3/6a/6fa36aa2c367da06b2a4c8ae1cf9ee02.jpg",
  },
  {
    name: "Eleanor Morales",
    role: "HR",
    imageUrl: "https://i.pinimg.com/1200x/c2/4e/27/c24e271f2f992fd7e62e8c1e8d9b3e2f.jpg",
  },
];

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.31l5.74-6.57L0 .75h5.063l3.495 4.633L12.6.75ZM11.47 13.5h1.146L4.74 2.15H3.522l7.95 11.35Z" />
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003Zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.282.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.231 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.843-.038 1.096-.047 3.232-.047h.001Zm4.905 1.882a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4ZM8 4.465a3.535 3.535 0 1 0 0 7.07 3.535 3.535 0 0 0 0-7.07ZM8 5.535a2.465 2.465 0 1 1 0 4.93 2.465 2.465 0 0 1 0-4.93Z" />
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0 0 3.603 0 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H11.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
  </svg>
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
  return (
    <div
      className="group flex flex-col items-center text-center p-6 rounded-[22px] border border-[#164962] bg-transparent transition-all duration-300 hover:-translate-y-2 hover:border-[#2f62ff]/50 hover:shadow-[0_20px_50px_rgba(47,98,255,0.25)]"
    >
      <div className="relative w-28 h-28 md:w-32 md:h-32 mb-5">
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-cyan-400/30 via-blue-500/30 to-violet-500/30 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300" />
        <img
          className="relative w-full h-full rounded-full object-cover ring-2 ring-[#164962] group-hover:ring-[#2f8dbd] transition-all duration-300"
          src={member.imageUrl}
          alt={`Portrait of ${member.name}`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `https://placehold.co/200x200/0a1929/94a3b8?text=${member.name
              .split(" ")
              .map((n) => n[0])
              .join("")}`;
          }}
        />
      </div>

      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors duration-300">
        {member.name}
      </h3>

      <span className="text-xs font-medium text-white/50 mb-5 px-3 py-1 rounded-full border border-[#164962] bg-[#0a1929]/40">
        {member.role}
      </span>

      <div className="flex items-center gap-2">
        <a
          href={member.twitter || "#"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name}'s X profile`}
          className="p-2 rounded-full bg-white/5 border border-white/8 text-white/40 hover:bg-[#194BFB] hover:text-white hover:border-[#194BFB] transition-all duration-200 hover:scale-110"
        >
          <XIcon />
        </a>
        <a
          href={member.instagram || "#"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name}'s Instagram profile`}
          className="p-2 rounded-full bg-white/5 border border-white/8 text-white/40 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-pink-500 transition-all duration-200 hover:scale-110"
        >
          <InstagramIcon />
        </a>
        <a
          href={member.facebook || "#"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name}'s Facebook profile`}
          className="p-2 rounded-full bg-white/5 border border-white/8 text-white/40 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 hover:scale-110"
        >
          <FacebookIcon />
        </a>
      </div>
    </div>
  );
};

export default function TeamSection() {
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/team`);
        if (response.ok) {
          const json = await response.json();
          if (json.data && json.data.length > 0) {
            setMembers(json.data);
          } else {
            setMembers(initialTeamMembers);
          }
        } else {
          setMembers(initialTeamMembers);
        }
      } catch (error) {
        console.error("Failed to fetch team members:", error);
        setMembers(initialTeamMembers);
      }
    };

    fetchTeam();
  }, []);

  return (
    <div className="min-h-screen py-24 flex flex-col items-center justify-center">
      <GsapReveal direction="up">
        <AuroraView normaltext="Our" highlighttext="Exceptional Team" />
      </GsapReveal>

      <GsapReveal direction="up" delay={0.15}>
        <p className="text-white/45 text-center text-sm sm:text-base max-w-[60ch] mt-4 px-4 mb-16">
          Meet our outstanding team — a synergy of talent, creativity, and dedication, crafting success together with passion and innovation.
        </p>
      </GsapReveal>

      <GsapStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full px-4 sm:px-6 md:px-8 max-w-[1400px]">
        {members.map((member) => (
          <GsapCard3DTilt key={member._id || member.name} maxTilt={6}>
            <TeamMemberCard member={member} />
          </GsapCard3DTilt>
        ))}
      </GsapStagger>

    </div>
  );
}
