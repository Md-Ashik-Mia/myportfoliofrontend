'use client';

import { type ReactNode } from 'react';
import { AiOutlineDownload } from 'react-icons/ai';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa6';
import { FiArrowRight } from 'react-icons/fi';
import { SiGoogle } from 'react-icons/si';
import { signIn } from 'next-auth/react';
import TypingHeadline from '@/common/home/TypingHeadline';
import ShimmerButton from '@/common/home/ShimmerButton';
import NoiseCard from '@/common/noise-card/NoiseCard';
import Image from 'next/image';

const navItems = ['Experiences', 'Project', 'Skills'];

const profile = {
  name: 'Md Ashik Mia',
  role: 'MERN Developer',
  seniority: 'Senior',
  location: 'Bangladesh',
  skills: [
    'React',
    'Next.js',
    'JavaScript',
    'TypeScript',
    'TailwindCSS',
    'CSS',
    'Figma',
    'GitHub',
    'HTML',
    'Astro',
    'Node.js',
    'Express',
    'MongoDB',
    'Firebase',
    'Git',
  ],
};

const badgeRows = [
  ['Learning MARN Stack', 'Clean Code', 'Innovation'],
  ['JavaScript Lover'],
];

function SocialIcon({ icon }: { icon: ReactNode }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-[#15223f] text-white shadow-[0_12px_28px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1b2a4d] hover:text-[#dbe6ff]">
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
  return (
   <div className="flex flex-col  lg:min-h-[calc(100vh-1.5rem)]  ">
          <NoiseCard
            className="rounded-[22px] border border-white/6 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.18)] sm:px-6"
            bgColor="bg-[#0A0C11]/15"
            noiseOpacity={0.09}
            grainSize={1}
          >
            <header className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Image src="/logo/ashiklogo.png" width={50} height={50} alt='logo'></Image>
                {/* <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2f62ff] shadow-[0_0_25px_rgba(47,98,255,0.35)]">
                  <span className="block h-5 w-5 -rotate-45 rounded-full border-l-[8px] border-l-white border-y-[8px] border-y-transparent border-r-[8px] border-r-transparent" />
                </div> */}
                <div className="text-[1.6rem] font-bold leading-none tracking-[-0.03em] text-white sm:text-[1.8rem]">
                  It&apos;s ashik
                </div>
              </div>

              <nav className="hidden items-center gap-2 md:flex">
                {navItems.map((item) => (
                  <NoiseBadge
                    key={item}
                    className="px-4.25 py-2.75 text-[11px] font-medium text-white/70 transition hover:-translate-y-0.5 hover:text-white"
                  >
                    {item}
                  </NoiseBadge>
                ))}
                <NoiseActionButton
                  ariaLabel="Sign in with Google"
                  className="text-[11px] font-medium text-white/72 transition hover:-translate-y-0.5 hover:text-white"
                  onClick={() => void signIn('google', { callbackUrl: '/admin/dashboard' })}
                >
                  <SiGoogle className="text-[11px]" />
                  Google Login
                </NoiseActionButton>
                <NoiseActionButton className="text-sm font-semibold text-white transition hover:-translate-y-0.5" onClick={() => {
                  window.location.hash = 'contact';
                }}>
                  Hire Me
                </NoiseActionButton>
              </nav>
            </header>
          </NoiseCard>

          <div className="grid  flex-1 items-center gap-8 lg:grid-cols-[minmax(0,0.97fr)_minmax(410px,0.9fr)] lg:gap-12 xl:gap-16 ">
            <div className="max-w-135  pt-1">
           

              <TypingHeadline />

              {/* <p className="mt-5 max-w-[40ch] text-base leading-7 text-white/45 sm:text-lg">
                I design and build modern, responsive frontends with a strong focus on performance,
                clarity, and polished interactions.
              </p> */}
              <div className="my-7 flex flex-col gap-4">
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {badgeRows[0].map((badge, index) => (
                    <NoiseBadge
                      key={badge}
                      className={[
                        'px-4.25 py-2.75 text-base font-normal leading-[150%] tracking-normal backdrop-blur-sm transition duration-300 hover:-translate-y-0.5',
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
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {badgeRows[1].map((badge) => (
                    <NoiseBadge
                      key={badge}
                      className="border-blue-400/30 bg-blue-400/10 px-4.25 py-2.75 text-base font-normal leading-[150%] tracking-normal text-blue-300 transition duration-300 hover:-translate-y-0.5"
                    >
                      {badge}
                    </NoiseBadge>
                  ))}
                </div>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
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
                  className="inline-flex h-14 items-center gap-3 rounded-xl bg-[#2f62ff] px-6 text-lg font-semibold text-white shadow-[0_15px_40px_rgba(47,98,255,0.35)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#3d73ff]"
                >
                  View Project
                  <FiArrowRight className="text-xl" />
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-140">
              <div className="absolute -inset-10 rounded-full bg-[#1833ff]/15 blur-3xl animate-float-slow " />
              <NoiseCard
                className="relative rounded-2xl border border-[#314bcf]/60 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
                bgColor="bg-[#060912]"
                noiseOpacity={0.09}
                grainSize={1}
              >
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-[#ff5757]" />
                    <span className="h-3 w-3 rounded-full bg-[#ffb84d]" />
                    <span className="h-3 w-3 rounded-full bg-[#2fd27d]" />
                  </div>
                  <span className="font-mono text-xs text-white/35">coder.js</span>
                </div>

                <div className="relative px-5 py-6">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(117,61,255,0.35),transparent_25%),radial-gradient(circle_at_25%_18%,rgba(35,98,255,0.35),transparent_30%)]" />
                  <div className="relative grid gap-6 lg:grid-cols-[40px_1fr]">
                    <div className="hidden select-none font-mono text-xs text-white/28 lg:block">
                      {Array.from({ length: 12 }, (_, index) => (
                        <div key={index} className="h-6 text-right leading-6">
                          {index + 1}
                        </div>
                      ))}
                    </div>

                    <pre className="m-0 overflow-x-auto font-mono text-[11px] leading-6 text-white/90 sm:text-xs lg:text-sm">
                      <code>
                        <div>
                          <span className="text-pink-400">const</span>{' '}
                          <span className="text-violet-400">coder</span>{' '}
                          <span className="text-pink-400">=</span>{' '}
                          <span className="text-white/55">{`{`}</span>
                        </div>
                        <div className="pl-6">
                          <span className="text-white/90">name:</span>{' '}
                          <span className="text-white/55">{`'`}</span>
                          <span className="text-emerald-400">{profile.name}</span>
                          <span className="text-white/55">{`'`},</span>
                        </div>
                        <div className="pl-6">
                          <span className="text-white/90">role:</span>{' '}
                          <span className="text-white/55">{`'`}</span>
                          <span className="text-emerald-400">{profile.role}</span>
                          <span className="text-white/55">{`'`},</span>
                        </div>
                        <div className="pl-6">
                          <span className="text-white/90">seniority:</span>{' '}
                          <span className="text-white/55">{`'`}</span>
                          <span className="text-emerald-400">{profile.seniority}</span>
                          <span className="text-white/55">{`'`},</span>
                        </div>
                        <div className="pl-6">
                          <span className="text-white/90">location:</span>{' '}
                          <span className="text-white/55">{`'`}</span>
                          <span className="text-emerald-400">{profile.location}</span>
                          <span className="text-white/55">{`'`},</span>
                        </div>
                        <div className="pl-6">
                          <span className="text-white/90">skills:</span>{' '}
                          <span className="text-white/55">[</span>
                          <div className="mt-1 flex flex-wrap gap-x-1 gap-y-1 pl-6">
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

                <div className="flex items-center justify-between border-t border-white/10 px-5 py-3 font-mono text-xs text-white/28">
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
