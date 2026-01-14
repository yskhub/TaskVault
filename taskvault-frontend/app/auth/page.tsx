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
  const [resetting, setResetting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const nextEmailError = !email.trim()
      ? "Email is required."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? "Enter a valid email address."
      : null;
    const nextPasswordError = !password.trim()
      ? "Password is required."
      : password.length < 6
      ? "Use at least 6 characters."
      : null;

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) {
      setShake(true);
      setLoading(false);
      return;
    }

    try {
      const { error } =
        mode === "signin"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (error) {
        setMessage(error.message);
        setShake(true);
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
      setShake(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!email) {
      setMessage("Enter your email above to receive a reset link.");
      return;
    }

    setResetting(true);
    setMessage(null);

    try {
      const redirectTo =
        typeof window !== "undefined" ? `${window.location.origin}/auth` : undefined;

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage(
          "If an account exists for this email, a password reset link has been sent."
        );
      }
    } catch (err) {
      console.error("Supabase reset password error", err);
      const fallback = "Unable to start password reset. Please try again.";
      const msg = err instanceof Error ? err.message : String(err ?? "");
      setMessage(msg || fallback);
    } finally {
      setResetting(false);
    }
  }

  function handleEmailBlur() {
    if (!emailError && !email.trim()) return;
    if (!email.trim()) {
      setEmailError("Email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Enter a valid email address.");
    } else {
      setEmailError(null);
    }
  }

  function handlePasswordBlur() {
    if (!passwordError && !password.trim()) return;
    if (!password.trim()) {
      setPasswordError("Password is required.");
    } else if (password.length < 6) {
      setPasswordError("Use at least 6 characters.");
    } else {
      setPasswordError(null);
    }
  }

  return (
		<main className="min-h-screen text-white px-4 py-10 sm:px-8">
      <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.2fr,1fr]">
          {/* Left: brand + hero copy */}
          <motion.section
            className="space-y-6"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/70 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Secure workspace access
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
                <p className="font-semibold text-slate-100">Incremental build</p>
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
              <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
                Email & password auth
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

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-5 px-6 pb-7 sm:px-8 sm:pb-9"
              animate={shake ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              onAnimationComplete={() => setShake(false)}
            >
              <div className="space-y-1 text-sm sm:text-base">
                <label className="block text-slate-200">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
						onBlur={handleEmailBlur}
						className={`w-full rounded-md border bg-slate-950 px-3 py-2.5 text-base text-white outline-none focus:ring-1 focus:ring-accent ${
							emailError
								? "border-red-500 focus:border-red-500 focus:ring-red-500"
								: "border-slate-700 focus:border-accent"
						}`}
                />
                {emailError && (
						<p className="pt-1 text-xs text-red-400">{emailError}</p>
					)}
              </div>

						  <div className="space-y-1 text-sm sm:text-base">
                <label className="block text-slate-200">Password</label>
                <div className="relative">
                  <input
						  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordBlur}
						  className={`w-full rounded-md border bg-slate-950 px-3 py-2.5 pr-10 text-base text-white outline-none focus:ring-1 ${
							passwordError
								? "border-red-500 focus:border-red-500 focus:ring-red-500"
								: "border-slate-700 focus:border-accent focus:ring-accent"
						  }`}
						/>
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-xs text-slate-400 hover:text-slate-200"
                    disabled={loading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {passwordError && (
						<p className="pt-1 text-xs text-red-400">{passwordError}</p>
					)}
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400">
                <span>
                  {mode === "signin"
                    ? "Use your TaskVault password."
                    : "You'll use this password to sign in."}
                </span>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={loading || resetting}
                    className="font-semibold text-accent hover:text-blue-400 disabled:opacity-60"
                  >
                    {resetting ? "Sending reset..." : "Forgot password?"}
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
						className="mt-3 w-full rounded-md bg-accent px-4 py-2.5 text-base font-semibold text-white shadow-lg shadow-blue-500/40 transition hover:-translate-y-0.5 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="h-3 w-3 rounded-full border border-transparent border-t-white border-l-white animate-spin" />
                )}
						{loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Sign up"}
              </button>
            </motion.form>

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
