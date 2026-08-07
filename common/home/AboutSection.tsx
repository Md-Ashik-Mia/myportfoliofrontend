'use client';

import Image from 'next/image';
import { FiCode, FiAward, FiBookOpen, FiZap, FiCheckCircle, FiArrowUpRight, FiMail } from 'react-icons/fi';
import NoiseCard from '@/common/noise-card/NoiseCard';
import { GsapReveal, GsapStagger, GsapTextSplit, GsapCard3DTilt } from '@/common/gsap/GsapAnimations';

export default function AboutSection() {
  const highlights = [
    {
      icon: <FiBookOpen className="text-cyan-400 text-xl" />,
      title: 'B.Sc. in Computer Science',
      subtitle: 'Green University of Bangladesh',
      desc: 'Solid foundation in computer science principles, algorithms, and software engineering.',
      tagColor: 'border-cyan-500/20 bg-cyan-500/10 text-cyan-300',
    },
    {
      icon: <FiCode className="text-violet-400 text-xl" />,
      title: 'Full-Stack MERN Specialist',
      subtitle: 'React • Next.js • Node • Express • MongoDB',
      desc: 'Expertise in building high-performance web applications, scalable backend APIs, and modern UIs.',
      tagColor: 'border-violet-500/20 bg-violet-500/10 text-violet-300',
    },
    {
      icon: <FiAward className="text-pink-400 text-xl" />,
      title: 'Clean Architecture & Scalability',
      subtitle: 'User-Centered & Maintainable',
      desc: 'Focus on clean code, secure authentication, database design, and modern dev workflows.',
      tagColor: 'border-pink-500/20 bg-pink-500/10 text-pink-300',
    },
    {
      icon: <FiZap className="text-emerald-400 text-xl" />,
      title: 'Continuous Evolution',
      subtitle: 'Always Learning & Innovating',
      desc: 'Passionate about exploring emerging frameworks, side projects, and open-source contributions.',
      tagColor: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    },
  ];

  const quickStats = [
    { label: 'Degree', value: 'B.Sc. in CSE' },
    { label: 'University', value: 'Green University' },
    { label: 'Core Stack', value: 'MERN & Next.js' },
    { label: 'Status', value: 'Open for Hire' },
  ];

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-10 -z-10 h-96 w-96 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute bottom-10 right-10 -z-10 h-96 w-96 rounded-full bg-violet-500/10 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <GsapReveal direction="down">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-cyan-300 backdrop-blur-md">
              <FiCheckCircle className="text-cyan-400" />
              About Me
            </div>
          </GsapReveal>

          <div className="mt-4">
            <GsapTextSplit
              text="Architecting Digital Experiences with Passion"
              className="text-3xl font-extrabold tracking-tight text-white justify-center sm:text-4xl lg:text-5xl"
            />
          </div>

          <GsapReveal direction="up" delay={0.2}>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/50 leading-relaxed sm:text-lg">
              A snapshot of my background, software engineering philosophy, and core technical expertise.
            </p>
          </GsapReveal>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Column: Portrait Image & Quick Stats Card with 3D Tilt */}
          <div className="lg:col-span-5">
            <GsapReveal direction="left" delay={0.1}>
              <GsapCard3DTilt maxTilt={6}>
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Outer Glow */}
                  <div className="absolute -inset-1 rounded-[36px] bg-gradient-to-r from-cyan-500/30 via-violet-500/30 to-pink-500/30 blur-2xl opacity-70" />

                  <NoiseCard
                    className="relative overflow-hidden rounded-[32px] border border-white/10 p-4 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                    bgColor="bg-[#0b1021]/80"
                    noiseOpacity={0.08}
                    grainSize={1}
                  >
                    {/* Image Container with rounded borders */}
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] border border-white/10">
                      <Image
                        src="/ashik-profile.jpg"
                        alt="Md. Ashik Mia - Full-Stack MERN Developer"
                        fill
                        className="object-cover object-top transition duration-700 hover:scale-105"
                        priority
                      />
                      {/* Image Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1021] via-transparent to-transparent opacity-80" />

                      {/* Status Badge */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-emerald-500/30 bg-[#06120d]/80 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md shadow-lg">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        Available for Projects
                      </div>

                      {/* Bottom Image Overlay Text */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white drop-shadow-md">Md. Ashik Mia</h3>
                        <p className="text-xs font-medium text-cyan-300 drop-shadow">Full-Stack MERN & Next.js Developer</p>
                      </div>
                    </div>

                    {/* Quick Info Grid */}
                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      {quickStats.map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-2xl border border-white/5 bg-white/5 p-3 text-center backdrop-blur-md transition duration-300 hover:border-white/15 hover:bg-white/10"
                        >
                          <div className="text-[11px] font-medium uppercase tracking-wider text-white/40">{stat.label}</div>
                          <div className="mt-0.5 text-xs font-bold text-white">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </NoiseCard>
                </div>
              </GsapCard3DTilt>
            </GsapReveal>
          </div>

          {/* Right Column: Narrative & Highlight Cards */}
          <div className="lg:col-span-7 space-y-6">
            {/* Bio Introduction */}
            <GsapReveal direction="right" delay={0.2}>
              <NoiseCard
                className="rounded-[28px] border border-white/10 p-6 sm:p-8 shadow-xl backdrop-blur-xl"
                bgColor="bg-[#0b1021]/60"
                noiseOpacity={0.07}
                grainSize={1}
              >
                <h3 className="text-2xl font-bold tracking-tight text-white leading-snug">
                  Passionate about building software that shapes everyday digital life.
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
                  I hold a Bachelor&apos;s degree in Computer Science & Engineering from <strong className="text-white font-semibold">Green University of Bangladesh</strong>. My passion lies in building meaningful, user-centered applications using <span className="text-cyan-300 font-medium">React, Next.js, Node.js, Express, MongoDB, and TypeScript</span>.
                </p>
                <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">
                  I combine technical rigor with clean architecture and maintainable codebases, ensuring every project balances performance, security, and exceptional user experience.
                </p>
              </NoiseCard>
            </GsapReveal>

            {/* Shortlisted Highlights Grid with GSAP Stagger */}
            <GsapStagger staggerAmount={0.1} className="grid gap-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <GsapCard3DTilt key={item.title} maxTilt={4}>
                  <NoiseCard
                    className="h-full rounded-2xl border border-white/8 p-5 transition duration-300 hover:border-white/20 hover:shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
                    bgColor="bg-[#0e152d]/50"
                    noiseOpacity={0.06}
                    grainSize={1}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${item.tagColor}`}>
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">{item.title}</h4>
                        <p className="text-[11px] font-medium text-white/40">{item.subtitle}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-white/55">
                      {item.desc}
                    </p>
                  </NoiseCard>
                </GsapCard3DTilt>
              ))}
            </GsapStagger>

            {/* CTAs & Action Row */}
            <GsapReveal direction="up" delay={0.4}>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#contact"
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(6,182,212,0.3)] transition duration-300 hover:-translate-y-0.5 hover:from-cyan-400 hover:to-blue-500"
                >
                  <FiMail className="text-lg" />
                  Let&apos;s Connect
                  <FiArrowUpRight className="text-lg" />
                </a>

                <a
                  href="#projects"
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white/90 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
                >
                  Explore My Work
                </a>
              </div>
            </GsapReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
