"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import AuroraView from "../auroratext/Auroratext";
import { FiPlus, FiX, FiCheckCircle, FiStar } from "react-icons/fi";
import { SiGoogle } from "react-icons/si";

interface Testimonial {
  _id?: string;
  id?: string;
  name: string;
  role?: string; // fallback for mapping
  position?: string; // model field
  avatar?: string; // model field
  text?: string; // fallback mapping
  feedback?: string; // model field
  spanClass?: string;
}

const initialTestimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah Johnson",
    position: "UX Researcher",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    feedback: '"The insights provided by Ashik were invaluable for our project."',
    spanClass: "lg:col-span-1 lg:row-span-1",
  },
  {
    id: "t2",
    name: "Md Moinuddin",
    position: "Product Designer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    feedback: '"Ashik shipped a high-quality MARN stack application in record time, demonstrating great skill in Next.js, Node.js, and modern UI design patterns."',
    spanClass: "lg:col-span-2 lg:row-span-2",
  },
  {
    id: "t3",
    name: "Lisa Chen",
    position: "Project Manager",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    feedback: '"Ashik\'s attention to detail and proactive communication ensured a smooth delivery process from start to finish."',
    spanClass: "lg:col-span-1 lg:row-span-1",
  },
  {
    id: "t4",
    name: "Carlos Mendes",
    position: "UI Developer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    feedback: '"Working with Ashik has transformed the way we approach frontend design and responsive architectures."',
    spanClass: "lg:col-span-1 lg:row-span-1",
  },
  {
    id: "t5",
    name: "Marcus Aurelius",
    position: "Lead Architect",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    feedback: '"Exceptional clean code standards and a great understanding of developer workflows."',
    spanClass: "lg:col-span-1 lg:row-span-1",
  },
];

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <div
      className="h-full rounded-[22px] border border-[#164962] bg-transparent px-6 py-6 shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-[#2f8dbd] hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <img
            src={item.avatar || `https://placehold.co/100x100/101f30/ffffff?text=${item.name[0]}`}
            alt={item.name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full border border-white/10 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = `https://placehold.co/100x100/101f30/ffffff?text=${item.name[0]}`;
            }}
          />
          <div className="flex flex-col">
            <span className="text-white text-base font-semibold leading-tight">{item.name}</span>
            <span className="text-white/40 text-xs mt-0.5">{item.position || item.role}</span>
          </div>
        </div>
        <p className="text-white/85 text-[15px] leading-[160%] font-medium tracking-normal select-none">
          {item.feedback || item.text}
        </p>
      </div>
    </div>
  );
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function CommunitySection() {
  const { data: session, status } = useSession();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [position, setPosition] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/community`);
        if (response.ok) {
          const json = await response.json();
          if (json.data && json.data.length > 0) {
            // Map dynamic index to grid sizes
            const mapped = json.data.map((item: Testimonial, index: number) => {
              let spanClass = "lg:col-span-1 lg:row-span-1";
              if (index % 4 === 1) spanClass = "lg:col-span-2 lg:row-span-2";
              else if (index % 4 === 3) spanClass = "lg:col-span-2 lg:row-span-1";
              return { ...item, spanClass };
            });
            setTestimonials(mapped);
          } else {
            setTestimonials(initialTestimonials);
          }
        } else {
          setTestimonials(initialTestimonials);
        }
      } catch (error) {
        console.error("Failed to load community feedback:", error);
        setTestimonials(initialTestimonials);
      }
    };

    void fetchTestimonials();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    if (!position.trim() || !feedbackText.trim()) {
      setSubmitError("Position and feedback are required.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/community`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: session.user.name,
          avatar: session.user.image,
          position: position,
          feedback: feedbackText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback.");
      }

      setSubmitSuccess(true);
      setPosition("");
      setFeedbackText("");
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
      }, 3000);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Something went wrong.";
      setSubmitError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-24 flex flex-col items-center justify-center relative">
      <AuroraView normaltext="Loved" highlighttext="by community" />
      <p className="text-white/45 text-center text-sm sm:text-base max-w-[60ch] mt-4 px-4">
        I like exploring and learning new. I always build projects try out new
        tools and concepts
      </p>

      {/* Write Feedback Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#2f62ff]/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f62ff]/20 hover:border-white/20 active:scale-95"
      >
        <FiPlus />
        Share Your Feedback
      </button>

      {/* Bento Grid layout */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 grid-flow-row-dense w-full px-4 sm:px-6 md:px-8 max-w-[1400px]">
        {testimonials.map((item, index) => (
          <div key={item._id || item.id || index} className={`${item.spanClass}`}>
            <TestimonialCard item={item} />
          </div>
        ))}
      </div>

      {/* Feedback Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-md">
          <div
            className="w-full max-w-lg rounded-3xl border border-white/15 bg-gradient-to-br from-[#0c142c] to-[#060913] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.55)] text-white relative"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition"
            >
              <FiX size={20} />
            </button>

            {submitSuccess ? (
              <div className="text-center py-8 flex flex-col items-center gap-4">
                <FiCheckCircle size={52} className="text-emerald-400" />
                <h3 className="text-xl font-bold">Feedback Submitted!</h3>
                <p className="text-white/50 text-sm max-w-xs leading-relaxed">
                  Thank you! Your testimonial has been submitted successfully and is currently waiting for admin moderation.
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-bold tracking-tight mb-2">Share Your Testimonial</h3>
                <p className="text-white/50 text-xs mb-6 leading-relaxed">
                  Leave a feedback about your experience working with me. Testimonials are displayed dynamically after admin approval.
                </p>

                {status !== "authenticated" ? (
                  <div className="text-center py-6 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                    <FiStar className="text-white/20 mx-auto mb-3" size={32} />
                    <p className="text-sm text-white/75 mb-4">Please log in with Google to submit feedback.</p>
                    <button
                      onClick={() => void signIn("google")}
                      className="inline-flex items-center gap-3 rounded-xl bg-white text-black px-6 py-3 text-sm font-semibold hover:bg-white/95 transition shadow-lg"
                    >
                      <SiGoogle />
                      Login with Google
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handlePostSubmit} className="space-y-4">
                    {/* User info row */}
                    <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-3">
                      <img
                        src={session.user?.image || ""}
                        alt={session.user?.name || "avatar"}
                        className="w-10 h-10 rounded-full object-cover border border-white/10"
                      />
                      <div>
                        <div className="text-sm font-bold text-white leading-tight">{session.user?.name}</div>
                        <div className="text-xs text-white/35">Google Logged In</div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-white/45 mb-2 font-medium">Your Position</label>
                      <input
                        type="text"
                        placeholder="e.g. CEO, Senior Developer, Client"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-white/[0.06] transition"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-white/45 mb-2 font-medium">Feedback / Testimonial</label>
                      <textarea
                        rows={4}
                        placeholder="Share your experience working with me..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#2f62ff]/50 focus:bg-white/[0.06] transition resize-none"
                        required
                      />
                    </div>

                    {submitError && (
                      <div className="text-rose-400 text-xs font-semibold">{submitError}</div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#2f62ff] hover:bg-[#3d73ff] disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed text-white text-sm font-bold py-3.5 shadow-lg shadow-[#2f62ff]/20 transition duration-200"
                    >
                      {submitting ? "Submitting..." : "Submit Feedback"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
