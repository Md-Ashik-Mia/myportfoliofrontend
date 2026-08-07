"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube, FaGithub } from "react-icons/fa6";
import NoiseCard from "@/common/noise-card/NoiseCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

interface SocialLinksData {
  facebook?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  github?: string;
  twitter?: string;
}

export default function FooterSection() {
  const [socialLinks, setSocialLinks] = useState<SocialLinksData>({});

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/social-links`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setSocialLinks(json.data);
          }
        }
      } catch (e) {
        console.error("Failed to fetch footer social links:", e);
      }
    };
    void fetchSocials();
  }, []);

  return (
    <footer className="pb-20 pt-8 px-4 sm:px-6 md:px-8 flex justify-center">
      <div className="w-full max-w-[1240px]">
        <NoiseCard
          className="w-full rounded-[28px] border border-[#164962]/40 pt-12 pb-10 px-6 sm:px-12 flex flex-col items-center shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
          bgColor="bg-[#060912]"
          noiseOpacity={0.08}
          grainSize={1}
        >
          {/* Logo Section */}
          <div className="flex items-center gap-3 select-none mb-8">
            <Image
              src="/logo/ashiklogo.png"
              width={48}
              height={48}
              alt="Ashik Logo"
              className="object-contain"
            />
            <span className="text-[1.6rem] font-bold leading-none tracking-[-0.03em] text-white sm:text-[1.8rem]">
              Ashik
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 md:gap-x-12 text-sm md:text-[15px] font-medium text-white/60 mb-8">
            <a
              href="#experiences"
              className="transition duration-300 hover:text-white hover:-translate-y-0.5"
            >
              Experiences
            </a>
            <a
              href="#projects"
              className="transition duration-300 hover:text-white hover:-translate-y-0.5"
            >
              Project
            </a>
            <a
              href="#skills"
              className="transition duration-300 hover:text-white hover:-translate-y-0.5"
            >
              Skills
            </a>
            <a
              href="#pricing"
              className="transition duration-300 hover:text-white hover:-translate-y-0.5"
            >
              Pricing
            </a>
            <a
              href="#contact"
              className="transition duration-300 hover:text-white hover:-translate-y-0.5"
            >
              Contact
            </a>
            <a
              href="#contact"
              className="border border-white/10 rounded-lg px-4.5 py-1.75 text-white font-medium hover:border-white/20 hover:bg-white/5 hover:-translate-y-0.5 transition duration-300"
            >
              Hire Me
            </a>
          </nav>

          {/* Dynamic Social Media Icons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            {Boolean(socialLinks.facebook?.trim()) && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook Profile"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#164962]/40 bg-[#08101f]/80 text-white/60 hover:border-blue-400 hover:bg-blue-500/20 hover:text-white hover:-translate-y-0.5 shadow-[0_6px_18px_rgba(0,0,0,0.25)] transition duration-300"
              >
                <FaFacebookF size={14} />
              </a>
            )}
            {Boolean(socialLinks.linkedin?.trim()) && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#164962]/40 bg-[#08101f]/80 text-white/60 hover:border-cyan-400 hover:bg-cyan-500/20 hover:text-white hover:-translate-y-0.5 shadow-[0_6px_18px_rgba(0,0,0,0.25)] transition duration-300"
              >
                <FaLinkedinIn size={14} />
              </a>
            )}
            {Boolean(socialLinks.instagram?.trim()) && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#164962]/40 bg-[#08101f]/80 text-white/60 hover:border-pink-400 hover:bg-pink-500/20 hover:text-white hover:-translate-y-0.5 shadow-[0_6px_18px_rgba(0,0,0,0.25)] transition duration-300"
              >
                <FaInstagram size={14} />
              </a>
            )}
            {Boolean(socialLinks.youtube?.trim()) && (
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube Channel"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#164962]/40 bg-[#08101f]/80 text-white/60 hover:border-red-400 hover:bg-red-500/20 hover:text-white hover:-translate-y-0.5 shadow-[0_6px_18px_rgba(0,0,0,0.25)] transition duration-300"
              >
                <FaYoutube size={14} />
              </a>
            )}
            {Boolean(socialLinks.github?.trim()) && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#164962]/40 bg-[#08101f]/80 text-white/60 hover:border-purple-400 hover:bg-purple-500/20 hover:text-white hover:-translate-y-0.5 shadow-[0_6px_18px_rgba(0,0,0,0.25)] transition duration-300"
              >
                <FaGithub size={14} />
              </a>
            )}
            {Boolean(socialLinks.twitter?.trim()) && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter Profile"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#164962]/40 bg-[#08101f]/80 text-white/60 hover:border-sky-400 hover:bg-sky-500/20 hover:text-white hover:-translate-y-0.5 shadow-[0_6px_18px_rgba(0,0,0,0.25)] transition duration-300"
              >
                <FaTwitter size={14} />
              </a>
            )}
          </div>

          {/* Copyright Text */}
          <p className="text-xs sm:text-sm text-white/35 tracking-wide font-normal">
            &copy; 2026 Ashik. All rights reserved.
          </p>
        </NoiseCard>
      </div>
    </footer>
  );
}
