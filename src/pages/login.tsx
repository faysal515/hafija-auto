import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import NextImage from 'next/image';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [checking, setChecking] = useState(true);

  // If already logged in, skip straight to /invoice
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/invoice');
      else setChecking(false);
    });
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.replace('/invoice');
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-400 text-sm">Checking session…</div>
      </div>
    );
  }

  return (
    <>
      <Head><title>Login — Hafija Auto</title></Head>

      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">

          {/* Logo + name */}
          <div className="flex flex-col items-center mb-8">
            <NextImage src="/logo.png" alt="Hafija Auto" width={64} height={64} className="object-contain mb-3" />
            <h1 className="text-2xl font-bold text-yellow-400 tracking-wide">HAFIJA AUTO</h1>
            <p className="text-gray-400 text-sm mt-1">Invoice Portal</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 border border-gray-700 rounded-xl p-8 space-y-5"
          >
            <h2 className="text-white font-bold text-lg">Sign In</h2>

            {error && (
              <div className="bg-red-900/40 border border-red-700 text-red-300 text-sm rounded px-3 py-2">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="bg-gray-900 border border-gray-600 rounded px-3 py-2.5 text-sm text-white
                           focus:outline-none focus:border-yellow-400 transition-colors placeholder-gray-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="bg-gray-900 border border-gray-600 rounded px-3 py-2.5 text-sm text-white
                           focus:outline-none focus:border-yellow-400 transition-colors placeholder-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold
                         rounded text-sm transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

        </div>
      </div>
    </>
  );
}

LoginPage.noLayout = true;
