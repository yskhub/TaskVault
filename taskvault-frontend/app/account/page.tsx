"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { motion } from "framer-motion";

type Plan = "free" | "pro";

type State =
  | { status: "loading" }
  | { status: "signed_out" }
  | {
      status: "ready";
      email: string | null;
      plan: Plan;
      lastSignInAt: string | null;
      sessionSummary: string | null;
    };

export default function AccountPage() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [updating, setUpdating] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setState({ status: "signed_out" });
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("subscription_plan, email")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
      }

      const plan = (data?.subscription_plan as Plan) ?? "free";
      const email = ((data?.email as string | null) ?? user.email) ?? null;

      // Ensure a profile row exists with at least the default plan
      if (!data) {
        await supabase.from("profiles").insert({ id: user.id, email, subscription_plan: plan });
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const lastSignInAt =
        (user.last_sign_in_at as string | null) ??
        (session?.user?.last_sign_in_at as string | null) ??
        null;

      let sessionSummary: string | null = null;
      if (session) {
        const expiresAt = session.expires_at
          ? new Date(session.expires_at * 1000).toISOString()
          : null;
        sessionSummary = `Provider: ${session.token_type ?? "access"}, Expires at: ${
          expiresAt ?? "unknown"
        }`;
      }

      setState({ status: "ready", email, plan, lastSignInAt, sessionSummary });
    }

    loadProfile();
  }, []);

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
      setState({ status: "signed_out" });
      router.push("/auth");
    } finally {
      setSigningOut(false);
    }
  }

  async function mockUpgradeToPro() {
    if (state.status !== "ready") return;
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ subscription_plan: "pro" })
        .eq("email", state.email ?? "");

      if (!error) {
        setState({ ...state, plan: "pro" });
      }
    } finally {
      setUpdating(false);
    }
  }

  async function mockDowngradeToFree() {
    if (state.status !== "ready") return;
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ subscription_plan: "free" })
        .eq("email", state.email ?? "");

      if (!error) {
        setState({ ...state, plan: "free" });
      }
    } finally {
      setUpdating(false);
    }
  }

  if (state.status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center text-white">
        <p className="text-sm text-slate-200">Loading account...</p>
      </main>
    );
  }

  if (state.status === "signed_out") {
    return (
      <main className="flex min-h-screen items-center justify-center text-white">
        <div className="rounded-xl bg-slate-900/70 p-8 shadow-xl border border-slate-800 text-center">
          <h1 className="mb-2 text-2xl font-bold">You are not signed in</h1>
          <p className="mb-4 text-sm text-slate-300">
            Go to the auth page to sign in or create an account.
          </p>
          <a
            href="/auth"
            className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Go to Auth
          </a>
        </div>
      </main>
    );
  }

  const isPro = state.plan === "pro";

  return (
    <main className="flex min-h-screen items-center justify-center text-white px-4 py-10 sm:px-8">
      <motion.div
        className="w-full max-w-3xl rounded-xl bg-slate-900/70 p-8 shadow-xl border border-slate-800 space-y-6"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Account & Plan</h1>
            <p className="text-sm text-slate-300">Manage your TaskVault access level.</p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                isPro
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-800 text-slate-200 border border-slate-600"
              }`}
            >
              {isPro ? "Pro" : "Free"} plan
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-slate-700 disabled:opacity-60"
            >
              {signingOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </header>

        <section className="space-y-1 text-sm">
          <div className="text-slate-300">Signed in as</div>
          <div className="text-sm font-medium text-white">{state.email ?? "Unknown"}</div>
        </section>

        <section className="space-y-1 text-xs text-slate-300">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Last sign-in</span>
            <span className="font-mono text-[11px] text-slate-200">
              {state.lastSignInAt ?? "Unknown"}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-400">Active session</span>
            <span className="text-[11px] text-slate-200 text-right">
              {state.sessionSummary ?? "No active session details"}
            </span>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-200">Plan-based access</h2>
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <div className="rounded-lg border border-slate-700 bg-slate-900/80 p-4">
              <h3 className="mb-1 font-semibold">Free</h3>
              <ul className="space-y-1 text-slate-300">
                <li>• Core workflow management</li>
                <li>• Up to 3 active workflows</li>
                <li>• Basic team collaboration</li>
              </ul>
            </div>
            <div
              className={`rounded-lg border p-4 ${
                isPro
                  ? "border-accent bg-accent/10"
                  : "border-slate-700 bg-slate-900/80 opacity-70"
              }`}
            >
              <h3 className="mb-1 font-semibold flex items-center gap-2">
                Pro
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
                  Mock
                </span>
              </h3>
              <ul className="space-y-1 text-slate-300">
                <li>• Unlimited workflows</li>
                <li>• Advanced analytics (preview)</li>
                <li>• Priority notifications (preview)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-2 text-sm">
          <h2 className="text-sm font-semibold text-slate-200">Pro-only preview</h2>
          <div className="rounded-lg border border-slate-700 bg-slate-900/80 p-4">
            {isPro ? (
              <p className="text-slate-200">
                Pro features are <span className="font-semibold">unlocked</span> for this account.
                In a full production setup, this gate would protect real workflow, analytics, and team features.
              </p>
            ) : (
              <p className="text-slate-300">
                This area is <span className="font-semibold">gated</span> to Pro accounts. In production,
                access to advanced workflow and analytics screens would be restricted here.
              </p>
            )}
          </div>
        </section>

        <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
          <span>Mock subscription only</span>
          {isPro ? (
            <button
              type="button"
              onClick={mockDowngradeToFree}
              disabled={updating}
              className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-slate-700 disabled:opacity-60 border border-slate-600"
            >
              {updating ? "Updating..." : "Mock downgrade to Free"}
            </button>
          ) : (
            <button
              type="button"
              onClick={mockUpgradeToPro}
              disabled={updating}
              className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
            >
              {updating ? "Updating..." : "Mock upgrade to Pro"}
            </button>
          )}
        </div>
      </motion.div>
    </main>
  );
}
