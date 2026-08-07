"use client";

import React, { useState } from "react";
import NoiseCard from "@/common/noise-card/NoiseCard";
import AuroraView from "../auroratext/Auroratext";
import { SiWhatsapp } from "react-icons/si";
import { GsapReveal, GsapCard3DTilt } from "../gsap/GsapAnimations";


interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

/** Wraps a field in a NoiseCard so the noise texture is the input background */
function NoiseField({
  children,
  focused,
  hasError,
}: {
  children: React.ReactNode;
  focused: boolean;
  hasError: boolean;
}) {
  return (
    <NoiseCard
      bgColor="bg-[#08101F]"
      noiseOpacity={0.09}
      grainSize={1}
      className={`
        rounded-[4px] border transition-all duration-200
        ${hasError
          ? "border-red-500/60"
          : focused
          ? "border-[#2f62ff]/70 shadow-[0_0_0_2px_rgba(47,98,255,0.18)]"
          : "border-[#164962]"
        }
      `}
    >
      {children}
    </NoiseCard>
  );
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8801700000000";

export default function ContactSection() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [focused, setFocused] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email.";
    }
    if (!form.message.trim()) newErrors.message = "Message cannot be empty.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getWhatsAppLink = (customName?: string, customEmail?: string, customMsg?: string) => {
    const nameStr = customName || form.name || "Visitor";
    const emailStr = customEmail || form.email || "Not specified";
    const msgStr = customMsg || form.message || "Hello Ashik!";
    const text = encodeURIComponent(
      `Hi Ashik,\n\nName: ${nameStr}\nEmail: ${emailStr}\n\nMessage:\n${msgStr}`
    );
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setSubmitting(true);
    setSubmitError("");
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: `Portfolio Message from ${form.name}`,
          message: form.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save message. Please try again later.");
      }

      setSent(true);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Failed to submit message.";
      setSubmitError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /* Shared transparent input style — noise comes from the NoiseCard wrapper */
  const baseInput = `
    w-full bg-transparent outline-none
    text-sm text-white/80 placeholder-white/25
    px-3 pt-[10px] pb-[10px]
  `;

  return (
    <div id="contact" className="py-24 flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-[808px]">

        {/* Heading */}
        <GsapReveal direction="up">
          <div className="text-center mb-10">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
               <AuroraView normaltext="Let's " highlighttext="connect" />
            </h2>
            <p className="mt-3 text-white/40 text-sm sm:text-base">
              Send me a Direct message or chat instantly on WhatsApp
            </p>
          </div>
        </GsapReveal>


        {sent ? (
          <div className="text-center py-12 px-6 rounded-3xl border border-white/10 bg-white/[0.02] flex flex-col items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">Message Sent Successfully!</h3>
              <p className="text-white/50 text-sm mt-1 max-w-md">
                Your message has been saved and forwarded to my email inbox. You can also send it directly to my WhatsApp for instant reply!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
              <a
                href={getWhatsAppLink(form.name, form.email, form.message)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-sm py-3.5 px-6 rounded-xl shadow-lg transition"
              >
                <SiWhatsapp className="text-lg" />
                Send on WhatsApp Now
              </a>
              <button
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", message: "" });
                  setErrors({});
                }}
                className="w-full text-sm text-white/60 hover:text-white py-3 transition"
              >
                Send another message
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[10px]">

            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">

              {/* Name */}
              <div className="flex flex-col gap-[10px]">
                <label htmlFor="c-name" className="text-white/80 text-sm font-normal">
                  Name
                </label>
                <NoiseField focused={focused === "name"} hasError={!!errors.name}>
                  <input
                    id="c-name"
                    name="name"
                    type="text"
                    placeholder="e.g. John Doe"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    autoComplete="name"
                    className={baseInput}
                  />
                </NoiseField>
                {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-[10px]">
                <label htmlFor="c-email" className="text-white/80 text-sm font-normal">
                  Email
                </label>
                <NoiseField focused={focused === "email"} hasError={!!errors.email}>
                  <input
                    id="c-email"
                    name="email"
                    type="email"
                    placeholder="e.g. john.doe@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    autoComplete="email"
                    className={baseInput}
                  />
                </NoiseField>
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
              </div>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-[10px]">
              <label htmlFor="c-message" className="text-white/80 text-sm font-normal">
                Message
              </label>
              <NoiseField focused={focused === "message"} hasError={!!errors.message}>
                <textarea
                  id="c-message"
                  name="message"
                  placeholder="Write your message here...."
                  value={form.message}
                  onChange={handleChange}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  style={{
                    paddingTop: "10px",
                    paddingRight: "8px",
                    paddingBottom: "140px",
                    paddingLeft: "12px",
                  }}
                  className="w-full bg-transparent outline-none resize-none text-sm text-white/80 placeholder-white/25"
                />
              </NoiseField>
              {errors.message && <p className="text-red-400 text-xs">{errors.message}</p>}
            </div>

            {submitError && (
              <p className="text-red-400 text-sm font-medium mt-1">{submitError}</p>
            )}

            {/* Buttons Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <button
                type="submit"
                id="contact-send"
                disabled={submitting}
                className="
                  w-full flex items-center justify-center gap-2
                  bg-[#2f62ff] hover:bg-[#3d73ff] active:bg-[#1e4fd9]
                  disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed
                  text-white font-semibold text-base
                  py-3.5 rounded-xl
                  transition-all duration-200
                  shadow-[0_8px_32px_rgba(47,98,255,0.35)]
                  hover:shadow-[0_8px_40px_rgba(47,98,255,0.5)]
                  hover:-translate-y-0.5 active:translate-y-0
                "
              >
                {submitting ? "Sending..." : "Send Message"}
                {!submitting && (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                )}
              </button>

              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  w-full flex items-center justify-center gap-2
                  bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40
                  text-[#25D366] font-semibold text-base
                  py-3.5 rounded-xl
                  transition-all duration-200
                  hover:-translate-y-0.5 active:translate-y-0
                "
              >
                <SiWhatsapp className="text-lg" />
                Chat on WhatsApp
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
