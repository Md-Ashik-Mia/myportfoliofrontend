'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiArrowRight, FiLock, FiMail, FiShield, FiCheckCircle } from 'react-icons/fi';

const AUTH_KEY = 'admin-auth';
const TOKEN_KEY = 'admin-token';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function AdminLoginPage() {
  const [identifier, setIdentifier] = useState('itsashik');
  const [password, setPassword] = useState('ashik123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.token) {
        setError(data.message || 'Invalid admin credentials.');
        setLoading(false);
        return;
      }

      // Store authentication tokens cleanly
      window.localStorage.setItem(AUTH_KEY, 'true');
      window.localStorage.setItem(TOKEN_KEY, data.token);

      // Perform clean redirect to admin dashboard
      window.location.href = '/admin/dashboard';
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError('Cannot connect to admin backend server. Make sure backend is running on port 5000.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(47,98,255,0.18),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(236,72,153,0.14),transparent_24%),linear-gradient(180deg,#050814_0%,#070b16_100%)] px-4 py-8 text-white sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-5xl grid gap-8 lg:grid-cols-[1fr_1.1fr] items-center">
        {/* Left Side: Info Box */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1 text-xs uppercase tracking-[0.2em] text-[#7fb0ff]">
            <FiShield />
            Admin Security Portal
          </div>

          <h1 className="mt-6 text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Portfolio Administration
          </h1>

          <p className="mt-4 text-sm text-white/60 leading-relaxed">
            Manage your dynamic projects, team members, achievement gallery, and community testimonials in one place.
          </p>

          <div className="mt-8 space-y-3 text-xs text-white/50 border-t border-white/10 pt-6">
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-emerald-400 text-sm" />
              <span>Full MongoDB content management</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-emerald-400 text-sm" />
              <span>Testimonials & Google Auth moderation</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheckCircle className="text-emerald-400 text-sm" />
              <span>Protected REST API backend</span>
            </div>
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="rounded-3xl border border-white/10 bg-[#060913]/90 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/35">Private Access</div>
              <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Sign In</h2>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2f62ff] text-white shadow-[0_0_25px_rgba(47,98,255,0.4)]">
              <FiLock className="text-xl" />
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-id" className="block text-xs uppercase tracking-wider text-white/60 mb-2 font-medium">
                Username or Email
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 focus-within:border-[#2f62ff] focus-within:bg-white/[0.06] transition">
                <FiMail className="text-white/40 text-base" />
                <input
                  id="admin-id"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="itsashik"
                  required
                  autoComplete="off"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-pass" className="block text-xs uppercase tracking-wider text-white/60 mb-2 font-medium">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 focus-within:border-[#2f62ff] focus-within:bg-white/[0.06] transition">
                <FiLock className="text-white/40 text-base" />
                <input
                  id="admin-pass"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/25"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2f62ff] hover:bg-[#3b70ff] active:scale-[0.99] disabled:bg-white/10 disabled:text-white/40 disabled:cursor-not-allowed text-white font-bold text-sm py-4 shadow-[0_10px_30px_rgba(47,98,255,0.35)] transition duration-200 mt-2"
            >
              {loading ? 'Authenticating...' : 'Enter Dashboard'}
              {!loading && <FiArrowRight />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/40">
            <Link href="/" className="hover:text-white transition underline underline-offset-4">
              &larr; Return to Portfolio
            </Link>
            <span>Default: itsashik / ashik123</span>
          </div>
        </section>
      </div>
    </main>
  );
}