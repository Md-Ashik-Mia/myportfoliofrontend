"use client";

import React, { useState, useEffect } from "react";
import { AuroraText } from "../auroratext/Auroratext";
import { GsapReveal, GsapStagger } from "../gsap/GsapAnimations";

interface FAQItem {
  _id?: string;
  id?: number;
  question: string;
  answer: string;
}

const initialFaqs: FAQItem[] = [
  {
    id: 1,
    question: "What technologies do you work with?",
    answer:
      "I specialize in the MERN stack — MongoDB, Express.js, React, and Node.js — along with Next.js, TypeScript, TailwindCSS, and Figma for UI design. I also work with Firebase, Astro, and Git for version control.",
  },
  {
    id: 2,
    question: "Are you available for freelance projects?",
    answer:
      "Yes! I'm open to freelance and contract work. Feel free to reach out via the contact section or WhatsApp and we can discuss your project requirements, timeline, and budget.",
  },
  {
    id: 3,
    question: "How long does it typically take to build a web app?",
    answer:
      "It depends on the complexity. A simple landing page can take 3–5 days, while a full-stack web application with authentication and a dashboard typically takes 2–6 weeks. I always provide a clear timeline estimate before starting.",
  },
  {
    id: 4,
    question: "Do you provide post-launch support?",
    answer:
      "Absolutely. I offer a 2-week post-launch support period for all projects, during which I fix any bugs or issues at no additional cost. Ongoing maintenance plans are also available.",
  },
  {
    id: 5,
    question: "Can you work with an existing codebase?",
    answer:
      "Yes, I'm comfortable jumping into existing projects. I'll review the codebase, understand the architecture, and make improvements or additions while maintaining code quality and consistency.",
  },
];

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`flex-shrink-0 text-white/40 transition-transform duration-300 ${
      open ? "rotate-180 text-cyan-400" : ""
    }`}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const FAQAccordionItem: React.FC<{ item: FAQItem }> = ({ item }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border-b border-white/8 transition-colors duration-200 ${
        open ? "border-b-[#164962]" : ""
      }`}
    >
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
        aria-expanded={open}
      >
        <span
          className={`text-base font-medium transition-colors duration-200 ${
            open ? "text-white" : "text-white/70 group-hover:text-white"
          }`}
        >
          {item.question}
        </span>
        <ChevronIcon open={open} />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-60 pb-5 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-white/50 text-sm leading-[170%]">{item.answer}</p>
      </div>
    </div>
  );
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/faqs`);
        if (response.ok) {
          const json = await response.json();
          if (json.data && json.data.length > 0) {
            setFaqs(json.data);
          } else {
            setFaqs(initialFaqs);
          }
        } else {
          setFaqs(initialFaqs);
        }
      } catch (error) {
        console.error("Failed to fetch FAQs:", error);
        setFaqs(initialFaqs);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <div className="min-h-screen py-24 flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

        {/* Left — sticky title */}
        <GsapReveal direction="left" className="lg:sticky lg:top-24">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-[-0.04em] text-white">
            Frequently
            <br />
            Asked{" "}
            <AuroraText
              speed={1}
              colors={["#38BDF8", "#3B82F6", "#6366f1", "#EC4899"]}
            >
              Questions
            </AuroraText>
          </h2>
          <p className="mt-6 text-white/40 text-base leading-relaxed max-w-[36ch]">
            Have something on your mind? Here are answers to the most common
            questions clients ask before working with me.
          </p>
        </GsapReveal>

        {/* Right — dynamic accordion */}
        <GsapStagger className="w-full">
          {faqs.map((item) => (
            <FAQAccordionItem key={item._id || item.id} item={item} />
          ))}
        </GsapStagger>
      </div>
    </div>
  );
}
