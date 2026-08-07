'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { FiDollarSign, FiGrid, FiLogOut, FiUploadCloud, FiBox, FiShield, FiUsers, FiImage, FiMessageSquare, FiHelpCircle, FiFileText, FiShare2 } from 'react-icons/fi';

const navItems = [
  { href: '/admin/dashboard', label: 'Overview', icon: FiGrid },
  { href: '/admin/dashboard/projects', label: 'Projects', icon: FiBox },
  { href: '/admin/dashboard/team', label: 'Team', icon: FiUsers },
  { href: '/admin/dashboard/gallery', label: 'Gallery', icon: FiImage },
  { href: '/admin/dashboard/community', label: 'Testimonials', icon: FiMessageSquare },
  { href: '/admin/dashboard/faq', label: 'FAQs', icon: FiHelpCircle },
  { href: '/admin/dashboard/resume', label: 'Resume PDF', icon: FiFileText },
  { href: '/admin/dashboard/social-links', label: 'Social Links', icon: FiShare2 },
  { href: '/admin/dashboard/salary-pricing', label: 'Salary Pricing', icon: FiDollarSign },
];





const AUTH_KEY = 'admin-auth';
const TOKEN_KEY = 'admin-token';

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [hasLocalToken, setHasLocalToken] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    const valid = Boolean(token && token !== 'null' && token !== 'undefined');
    setHasLocalToken(valid);
    setMounted(true);
  }, []);

  const isAuthenticated = hasLocalToken;

  useEffect(() => {
    if (!mounted) {
      return;
    }

    if (!isAuthenticated) {
      window.location.href = '/adminlogin';
    }
  }, [mounted, isAuthenticated]);

  const handleLogout = () => {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(AUTH_KEY);
    void signOut({ redirect: false }).then(() => {
      window.location.href = '/adminlogin';
    });
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050814] text-white">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/70 backdrop-blur">
          The Admin dashboard is Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(236,72,153,0.12),transparent_24%),linear-gradient(180deg,#050814_0%,#050814_48%,#070b17_100%)] text-white">
      <div className="mx-auto grid min-h-screen max-w-400 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2f62ff] shadow-[0_0_28px_rgba(47,98,255,0.35)]">
              <FiShield className="text-xl" />
            </div>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-white/55">Admin</div>
              <div className="text-lg font-bold text-white">Md Ashik Mia</div>
            </div>
          </div>

          <nav className="mt-6 grid gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition',
                    active
                      ? 'border-[#2f62ff]/50 bg-[#2f62ff]/15 text-white shadow-[0_12px_32px_rgba(47,98,255,0.18)]'
                        : 'border-white/8 bg-white/4 text-white/65 hover:border-white/16 hover:bg-white/[0.07] hover:text-white',
                  ].join(' ')}
                >
                  <Icon className="text-base" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 rounded-3xl border border-white/10 bg-linear-to-br from-[#0d1632] to-[#090e1d] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
            <div className="text-xs uppercase tracking-[0.24em] text-white/35">Quick Action</div>
            <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2f62ff] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3b70ff]">
              <FiUploadCloud />
              Upload Project
            </button>
          </div>
        </aside>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-white/35">Admin Dashboard</div>
              <h1 className="mt-2 text-3xl font-black tracking-tighter sm:text-4xl">Control center</h1>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
            >
              <FiLogOut />
              Logout
            </button>
          </div>

          <div className="mt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}