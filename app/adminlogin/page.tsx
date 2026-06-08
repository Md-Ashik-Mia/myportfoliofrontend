'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiLock, FiMail, FiShield } from 'react-icons/fi';

const AUTH_KEY = 'admin-auth';
const TOKEN_KEY = 'admin-token';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      const payload = (await response.json()) as { message?: string; token?: string };

      if (!response.ok || !payload.token) {
        setError(payload.message || 'Unable to sign in.');
        return;
      }

      window.localStorage.setItem(AUTH_KEY, 'true');
      window.localStorage.setItem(TOKEN_KEY, payload.token);
      router.push('/admin/dashboard');
    } catch {
      setError('Unable to reach the admin server right now.');
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(47,98,255,0.18),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.14),transparent_24%),linear-gradient(180deg,#050814_0%,#070b16_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-white/45">
            <FiShield />
            Admin Access
          </div>

          <h1 className="mt-6 max-w-xl text-4xl font-black tracking-[-0.06em] sm:text-5xl">
            Login to the private dashboard.
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-white/55 sm:text-base">
            Open this route manually to access the private dashboard.
          </p>
        </section>

        <section className="rounded-4xl border border-white/10 bg-[#060913]/80 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-white/35">Admin Access</div>
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.04em]">Sign in</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f62ff] shadow-[0_0_28px_rgba(47,98,255,0.35)]">
              <FiLock className="text-xl" />
            </div>
          </div>

          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm text-white/75">
              <span>Email or Username</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 focus-within:border-[#2f62ff]/60">
                <FiMail className="text-white/35" />
                <input
                  id="admin-identifier"
                  name="identifier"
                  type="text"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder="itsashik"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="admin-auth-input w-full bg-transparent text-sm outline-none placeholder:text-white/30"
                />
              </div>
            </label>

            <label className="grid gap-2 text-sm text-white/75">
              <span>Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-4 py-3 focus-within:border-[#2f62ff]/60">
                <FiLock className="text-white/35" />
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  autoComplete="new-password"
                  className="admin-auth-input w-full bg-transparent text-sm outline-none placeholder:text-white/30"
                />
              </div>
            </label>

            {error ? (
              <div className="rounded-2xl border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2f62ff] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_16px_42px_rgba(47,98,255,0.35)] transition hover:bg-[#3b70ff]">
              Enter Dashboard
              <FiArrowRight />
            </button>
          </form>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/4 p-4 text-sm text-white/55">
            Google sign-in is available from the navbar; this page remains for direct admin access.
          </div>

          <div className="mt-6 text-sm text-white/40">
            Back to <Link href="/" className="text-white/75 underline decoration-white/20 underline-offset-4">portfolio</Link>
          </div>
        </section>
      </div>
    </main>
  );
}