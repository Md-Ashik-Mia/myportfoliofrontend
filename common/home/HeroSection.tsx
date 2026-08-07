'use client';

import { useState, type ReactNode } from 'react';
import { AiOutlineDownload } from 'react-icons/ai';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa6';
import { FiArrowRight, FiMenu, FiX } from 'react-icons/fi';
import { SiGoogle } from 'react-icons/si';
import { signIn, signOut, useSession } from 'next-auth/react';
import TypingHeadline from '@/common/home/TypingHeadline';
import ShimmerButton from '@/common/home/ShimmerButton';
import NoiseCard from '@/common/noise-card/NoiseCard';
import Image from 'next/image';

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Community', href: '#community' },
  { label: 'Team', href: '#team' },
  { label: 'FAQ', href: '#faq' },
];

const profile = {
  name: 'Md Ashik Mia',
  role: 'Full-Stack MERN Developer',
  education: 'B.Sc. in CSE (Green University)',
  location: 'Bangladesh',
  skills: [
    'React',
    'Next.js',
    'JavaScript',
    'TypeScript',
    'TailwindCSS',
    'Node.js',
    'Express.js',
    'MongoDB',
    'Firebase',
    'REST APIs',
    'Git',
  ],
};

const badgeRows = [
  ['B.Sc. in CSE', 'MERN Stack', 'Clean Architecture'],
  ['JavaScript & TypeScript Enthusiast'],
];

function SocialIcon({ icon }: { icon: ReactNode }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#15223f] text-white shadow-[0_12px_28px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1b2a4d] hover:text-[#dbe6ff] active:scale-95">
      {icon}
    </span>
  );
}

function NoiseBadge({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <NoiseCard
      className={`inline-flex items-center justify-center rounded-full border border-white/10 shadow-[0_10px_24px_rgba(0,0,0,0.16)] ${className}`}
      bgColor="bg-[#0A0C11]/35"
      noiseOpacity={0.08}
      grainSize={1}
    >
      {children}
    </NoiseCard>
  );
}

function NoiseActionButton({
  children,
  className,
  ariaLabel,
  onClick,
}: {
  children: ReactNode;
  className: string;
  ariaLabel?: string;
  onClick?: () => void;
}) {
  return (
    <NoiseCard
      className={`rounded-full border border-white/10 shadow-[0_12px_28px_rgba(0,0,0,0.2)] ${className}`}
      bgColor="bg-[#0A0C11]/30"
      noiseOpacity={0.1}
      grainSize={1}
    >
      <button
        type="button"
        aria-label={ariaLabel}
        onClick={onClick}
        className="flex items-center justify-center gap-1.5 px-4 py-2"
      >
        {children}
      </button>
    </NoiseCard>
  );
}

export default function HeroSection() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col lg:min-h-[calc(100vh-1.5rem)]">
      {/* Header Container */}
      <NoiseCard
        className="relative z-50 rounded-[22px] border border-white/6 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.18)] sm:px-6"
        bgColor="bg-[#0A0C11]/15"
        noiseOpacity={0.09}
        grainSize={1}
      >
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image src="/logo/ashiklogo.png" width={46} height={46} alt="logo" className="w-10 h-10 sm:w-12 sm:h-12" />
            <div className="text-[1.4rem] font-bold leading-none tracking-[-0.03em] text-white sm:text-[1.8rem]">
              It&apos;s ashik
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href}>
                <NoiseBadge className="px-4 py-2 text-[11px] font-medium text-white/70 transition hover:-translate-y-0.5 hover:text-white">
                  {item.label}
                </NoiseBadge>
              </a>
            ))}

            {session?.user ? (
              <div className="flex items-center gap-2">
                <NoiseBadge className="px-3 py-1 text-xs text-white/80 flex items-center gap-2">
                  {session.user.image && (
                    <img src={session.user.image} alt="User" className="w-5 h-5 rounded-full" />
                  )}
                  <span>{session.user.name?.split(' ')[0]}</span>
                </NoiseBadge>
                <NoiseActionButton
                  ariaLabel="Sign out"
                  className="text-[11px] font-medium text-white/72 transition hover:-translate-y-0.5 hover:text-white"
                  onClick={() => void signOut()}
                >
                  Logout
                </NoiseActionButton>
              </div>
            ) : (
              <NoiseActionButton
                ariaLabel="Sign in with Google"
                className="text-[11px] font-medium text-white/72 transition hover:-translate-y-0.5 hover:text-white"
                onClick={() => void signIn('google', { callbackUrl: '/' })}
              >
                <SiGoogle className="text-[11px]" />
                Google Login
              </NoiseActionButton>
            )}

            <NoiseActionButton
              className="text-sm font-semibold text-white transition hover:-translate-y-0.5"
              onClick={() => {
                window.location.hash = 'contact';
              }}
            >
              Hire Me
            </NoiseActionButton>
          </nav>

          {/* Mobile Hamburger Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white backdrop-blur-md md:hidden active:scale-95 transition"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 md:hidden animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white/80 backdrop-blur-md transition hover:bg-white/10 hover:text-white active:scale-95"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/5">
              {session?.user ? (
                <div className="flex w-full items-center justify-between gap-2">
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white">
                    {session.user.image && (
                      <img src={session.user.image} alt="User" className="w-5 h-5 rounded-full" />
                    )}
                    <span>{session.user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      void signOut();
                    }}
                    className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    void signIn('google', { callbackUrl: '/' });
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md"
                >
                  <SiGoogle />
                  Sign in with Google
                </button>
              )}
            </div>

            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg active:scale-95 transition"
            >
              Hire Me
            </a>
          </div>
        )}
      </NoiseCard>

      {/* Main Hero Content Grid */}
      <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[minmax(0,0.97fr)_minmax(410px,0.9fr)] lg:gap-12 xl:gap-16">
        <div className="max-w-135 pt-1">
          <TypingHeadline />

          <div className="my-6 sm:my-7 flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-wrap gap-2.5 sm:gap-4">
              {badgeRows[0].map((badge, index) => (
                <NoiseBadge
                  key={badge}
                  className={[
                    'px-3.5 py-2 text-sm sm:text-base font-normal leading-[150%] tracking-normal backdrop-blur-sm transition duration-300 hover:-translate-y-0.5',
                    index === 0
                      ? 'border-cyan-400/35 bg-cyan-400/10 text-cyan-300'
                      : index === 1
                        ? 'border-violet-400/30 bg-violet-400/10 text-violet-300'
                        : 'border-pink-400/30 bg-pink-400/10 text-pink-300',
                  ].join(' ')}
                >
                  {badge}
                </NoiseBadge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2.5 sm:gap-4">
              {badgeRows[1].map((badge) => (
                <NoiseBadge
                  key={badge}
                  className="border-blue-400/30 bg-blue-400/10 px-3.5 py-2 text-sm sm:text-base font-normal leading-[150%] tracking-normal text-blue-300 transition duration-300 hover:-translate-y-0.5"
                >
                  {badge}
                </NoiseBadge>
              ))}
            </div>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <SocialIcon icon={<FaFacebookF size={16} />} />
              <SocialIcon icon={<FaInstagram size={16} />} />
              <SocialIcon icon={<FaTwitter size={16} />} />
              <SocialIcon icon={<FaLinkedinIn size={16} />} />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <ShimmerButton
              href="#resume"
              text="Resume"
              icon={<AiOutlineDownload className="text-xl" />}
            />
            <a
              href="#projects"
              className="inline-flex h-14 items-center gap-3 rounded-xl bg-[#2f62ff] px-6 text-base sm:text-lg font-semibold text-white shadow-[0_15px_40px_rgba(47,98,255,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#3d73ff] active:scale-95"
            >
              View Project
              <FiArrowRight className="text-xl" />
            </a>
          </div>
        </div>

        {/* Code Editor Box */}
        <div className="relative mx-auto w-full max-w-140">
          <div className="absolute -inset-10 rounded-full bg-[#1833ff]/15 blur-3xl animate-float-slow" />
          <NoiseCard
            className="relative rounded-2xl border border-[#314bcf]/60 shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden"
            bgColor="bg-[#060912]"
            noiseOpacity={0.09}
            grainSize={1}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5 sm:px-5 sm:py-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-[#ff5757]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffb84d]" />
                  <span className="h-3 w-3 rounded-full bg-[#2fd27d]" />
                </div>
                <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                  <div className="relative h-6 w-6 overflow-hidden rounded-full border border-cyan-400/50">
                    <Image src="/ashik-profile.jpg" alt="Md Ashik Mia" fill className="object-cover object-top" />
                  </div>
                  <span className="text-xs font-semibold text-white/90">Md Ashik Mia</span>
                </div>
              </div>
              <span className="font-mono text-xs text-white/35">coder.js</span>
            </div>

            <div className="relative px-4 py-5 sm:px-5 sm:py-6">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(117,61,255,0.35),transparent_25%),radial-gradient(circle_at_25%_18%,rgba(35,98,255,0.35),transparent_30%)]" />
              <div className="relative grid gap-4 lg:grid-cols-[40px_1fr]">
                <div className="hidden select-none font-mono text-xs text-white/28 lg:block">
                  {Array.from({ length: 12 }, (_, index) => (
                    <div key={index} className="h-6 text-right leading-6">
                      {index + 1}
                    </div>
                  ))}
                </div>

                <pre className="m-0 overflow-x-auto font-mono text-[11px] leading-6 text-white/90 sm:text-xs lg:text-sm scrollbar-thin">
                  <code>
                    <div>
                      <span className="text-pink-400">const</span>{' '}
                      <span className="text-violet-400">coder</span>{' '}
                      <span className="text-pink-400">=</span>{' '}
                      <span className="text-white/55">{`{`}</span>
                    </div>
                    <div className="pl-4 sm:pl-6">
                      <span className="text-white/90">name:</span>{' '}
                      <span className="text-white/55">{`'`}</span>
                      <span className="text-emerald-400">{profile.name}</span>
                      <span className="text-white/55">{`'`},</span>
                    </div>
                    <div className="pl-4 sm:pl-6">
                      <span className="text-white/90">role:</span>{' '}
                      <span className="text-white/55">{`'`}</span>
                      <span className="text-emerald-400">{profile.role}</span>
                      <span className="text-white/55">{`'`},</span>
                    </div>
                    <div className="pl-4 sm:pl-6">
                      <span className="text-white/90">education:</span>{' '}
                      <span className="text-white/55">{`'`}</span>
                      <span className="text-emerald-400">{profile.education}</span>
                      <span className="text-white/55">{`'`},</span>
                    </div>
                    <div className="pl-4 sm:pl-6">
                      <span className="text-white/90">location:</span>{' '}
                      <span className="text-white/55">{`'`}</span>
                      <span className="text-emerald-400">{profile.location}</span>
                      <span className="text-white/55">{`'`},</span>
                    </div>
                    <div className="pl-4 sm:pl-6">
                      <span className="text-white/90">skills:</span>{' '}
                      <span className="text-white/55">[</span>
                      <div className="mt-1 flex flex-wrap gap-x-1 gap-y-1 pl-4 sm:pl-6">
                        {profile.skills.map((skill, index) => (
                          <span key={skill}>
                            <span className="text-white/55">{`'`}</span>
                            <span className="text-cyan-400">{skill}</span>
                            <span className="text-white/55">{`'`}</span>
                            {index < profile.skills.length - 1 ? (
                              <span className="text-white/55">, </span>
                            ) : null}
                          </span>
                        ))}
                      </div>
                      <span className="text-white/55">],</span>
                    </div>
                    <div>
                      <span className="text-white/55">{`};`}</span>
                    </div>
                  </code>
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 sm:px-5 sm:py-3 font-mono text-xs text-white/28">
              <span>UTF-8</span>
              <span>JavaScript</span>
              <span>Ln 12, Col 2</span>
            </div>
          </NoiseCard>
        </div>
      </div>
    </div>
  );
}
