"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const fn =
        mode === "signin"
          ? supabase.auth.signInWithPassword
          : supabase.auth.signUp;

      const { error } = await fn({ email, password });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          mode === "signin" ? "Signed in successfully" : "Check your inbox to confirm."
        );
      }
    } catch (err) {
      console.error("Supabase auth error", err);
      const fallback = "Something went wrong. Please try again.";
      const msg = err instanceof Error ? err.message : String(err ?? "");
      setMessage(msg || fallback);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10 sm:px-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.2fr,1fr] md:scale-[1.5] md:origin-center">
          {/* Left: brand + hero copy */}
          <motion.section
            className="space-y-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Secure workspace access · Phase 2
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                Workflow intelligence for teams
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
                <span className="block bg-gradient-to-r from-white via-slate-100 to-accent bg-clip-text text-transparent">
                  Sign in to TaskVault
                </span>
              </h1>
              <p className="max-w-xl text-base sm:text-lg text-slate-300">
                A focused, institute-grade workspace for teams to manage workflows, tasks,
                and approvals. Use your email account to access the TaskVault console.
              </p>
            </div>

            <div className="grid gap-4 text-sm sm:text-base text-slate-300 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                <p className="font-semibold text-slate-100">Free tier</p>
                <p className="mt-1 text-slate-400">Core workflows and team access.</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                <p className="font-semibold text-slate-100">Secure by design</p>
                <p className="mt-1 text-slate-400">Supabase Auth & RLS from day one.</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-3">
                <p className="font-semibold text-slate-100">Phase-based build</p>
                <p className="mt-1 text-slate-400">Evolves cleanly as your product grows.</p>
              </div>
            </div>
          </motion.section>

          {/* Right: auth card */}
          <motion.section
            className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/90 p-0 shadow-[0_30px_80px_rgba(15,23,42,0.95)] backdrop-blur"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.12 }}
          >
            {/* Accent strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-accent via-blue-400 to-fuchsia-500" />

            <div className="flex items-center justify-between px-6 pt-6 sm:px-8 sm:pt-7 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  TaskVault Access
                </h2>
                <p className="mt-1 text-sm sm:text-base text-slate-300">
                  {mode === "signin" ? "Sign in" : "Create your free account"} using email
                  and password.
                </p>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                Phase 2 · Auth
              </span>
            </div>

            <div className="mb-6 flex gap-3 px-6 sm:px-8 text-sm sm:text-base">
              <button
                className={`flex-1 rounded-md border px-3 py-2 text-center transition ${
                  mode === "signin"
                    ? "border-accent bg-accent text-white shadow-md shadow-blue-500/40"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
                }`}
                onClick={() => setMode("signin")}
                type="button"
              >
                Sign in
              </button>
              <button
                className={`flex-1 rounded-md border px-3 py-2 text-center transition ${
                  mode === "signup"
                    ? "border-accent bg-accent text-white shadow-md shadow-blue-500/40"
                    : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
                }`}
                onClick={() => setMode("signup")}
                type="button"
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-7 sm:px-8 sm:pb-9">
              <div className="space-y-1 text-sm sm:text-base">
                <label className="block text-slate-200">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-base text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>

                  <div className="space-y-1 text-sm sm:text-base">
                <label className="block text-slate-200">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2.5 text-base text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-3 w-full rounded-md bg-accent px-4 py-2.5 text-base font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:-translate-y-0.5 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60"
              >
                {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Sign up"}
              </button>
            </form>

            {message && (
              <p
                className="border-t border-slate-800/80 bg-slate-950/70 px-6 py-3 text-sm sm:text-base text-slate-200 sm:px-8"
                role="status"
              >
                {message}
              </p>
            )}
          </motion.section>
        </div>
      </div>
    </main>
  );
}
