"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { motion } from "framer-motion";
import { UsageBanner } from "@/components/ui/UsageBanner";
import { useToast } from "@/components/ui/Toast";
import { canManageTeam, type Role } from "@/lib/permissions";
import { Page } from "@/components/motion/Page";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type Plan = "free" | "pro";

type TeamMember = {
  id: number;
  email: string;
  role: "admin" | "member";
};

type TeamState =
  | { status: "loading" }
  | { status: "signed_out" }
  | { status: "ready"; email: string | null; plan: Plan; members: TeamMember[] };

export default function TeamPage() {
  const [state, setState] = useState<TeamState>({ status: "loading" });
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { push } = useToast();

  async function fetchTeam() {
    try {
      const res = await fetch(`${API_BASE_URL}/team`);
      if (!res.ok) return;
      const members: TeamMember[] = await res.json();

      setState((prev) => {
        if (prev.status !== "ready") return prev;
        return { ...prev, members };
      });
    } catch (err) {
      console.error("Failed to load team", err);
      push("Failed to load team", "error");
    }
  }

  useEffect(() => {
    async function loadProfileAndTeam() {
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

      if (!data) {
        await supabase.from("profiles").insert({ id: user.id, email, subscription_plan: plan });
      }

      setState({ status: "ready", email, plan, members: [] });
      await fetchTeam();
    }

    loadProfileAndTeam();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (state.status !== "ready") return;
    if (!email.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/team/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, plan: state.plan }),
      });

      if (!res.ok) {
        if (res.status === 429) {
          const message = "Too many requests. Please try again in a minute.";
          setError(message);
          push(message, "error");
          return;
        }

        const text = await res.text();
        try {
          const parsed = JSON.parse(text) as { detail?: string };
          setError(parsed.detail ?? "Failed to add member");
          push(parsed.detail ?? "Failed to add member", "error");
        } catch {
          setError("Failed to add member");
          push("Failed to add member", "error");
        }
        return;
      }

      setEmail("");
      await fetchTeam();
      push("Team member added", "success");
    } finally {
      setSubmitting(false);
    }
  }

  async function updateRole(memberId: number, newRole: "admin" | "member") {
    if (state.status !== "ready") return;

    const isPro = state.plan === "pro";
    if (!isPro) {
      setError("Only Pro plan accounts can change roles.");
      push("Only Pro plan accounts can change roles.", "error");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/team/${memberId}/role?actor_role=admin`,
        {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
        },
      );

      if (!res.ok) {
        if (res.status === 429) {
          push("Too many requests. Please try again in a minute.", "error");
        }
        return;
      }
      await fetchTeam();
      push("Member role updated", "success");
    } catch (err) {
      console.error("Failed to update role", err);
      push("Failed to update role", "error");
    }
  }

  async function removeMember(memberId: number) {
    if (state.status !== "ready") return;

    const isPro = state.plan === "pro";
    if (!isPro) {
      setError("Only Pro plan accounts can remove members.");
      push("Only Pro plan accounts can remove members.", "error");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/team/${memberId}?actor_role=admin`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        if (res.status === 429) {
          push("Too many requests. Please try again in a minute.", "error");
        }
        return;
      }
      await fetchTeam();
      push("Member removed", "success");
    } catch (err) {
      console.error("Failed to remove member", err);
      push("Failed to remove member", "error");
    }
  }

  if (state.status === "loading") {
    return (
      <Page className="min-h-screen text-white px-4 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 animate-pulse">
          <div className="space-y-3">
            <div className="h-3 w-40 rounded-full bg-slate-800/80" />
            <div className="h-7 w-56 rounded-lg bg-slate-800/80" />
            <div className="h-3 w-full max-w-xl rounded-lg bg-slate-800/70" />
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-4">
            <div className="h-4 w-40 rounded-md bg-slate-800" />
            <div className="h-3 w-64 rounded-md bg-slate-900" />
            <div className="h-10 w-full rounded-md bg-slate-950/80" />
          </div>
        </div>
      </Page>
    );
  }

  if (state.status === "signed_out") {
    return (
      <Page className="flex min-h-screen items-center justify-center text-white">
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
      </Page>
    );
  }

  const isPro = state.plan === "pro";
  const limit = isPro ? 10 : 2;
  const remaining = state.status === "ready" ? limit - state.members.length : limit;
  const used = state.status === "ready" ? state.members.length : 0;
  const currentRole: Role = "admin";
  const canManage = canManageTeam(currentRole);

  return (
    <Page className="min-h-screen text-white px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <motion.header
          className="space-y-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            User & team management
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Manage a lightweight in-memory team for this workspace. This prototype enforces
            simple subscription limits: Free up to 2 members, Pro up to 10 members.
          </p>
        </motion.header>

        <motion.section
          className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-4 shadow-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
        >
          <div className="flex items-center justify-between gap-3 text-sm">
            <div>
              <div className="text-slate-300">Signed in as</div>
              <div className="font-medium text-white">{state.email ?? "Unknown"}</div>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                isPro
                  ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-800 text-slate-200 border border-slate-600"
              }`}
            >
              {isPro ? "Pro" : "Free"} plan · {limit} member limit
            </span>
          </div>

          <UsageBanner used={used} limit={limit} plan={state.plan} />

          {state.status === "ready" && remaining === 1 && (
            <div className="mt-2 text-xs">
              <p className="rounded-md border border-amber-500/60 bg-amber-500/10 px-3 py-2 text-amber-100">
                You are near the {state.plan} plan limit. You can add <strong>1</strong> more member
                before hitting the cap of {limit}.
              </p>
            </div>
          )}

          <form onSubmit={handleAdd} className="space-y-4 mt-4">
            <div className="grid gap-3 sm:grid-cols-[2fr,1fr] text-sm">
              <div className="space-y-1">
                <label className="block text-slate-200">Member email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="e.g. teammate@company.com"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-slate-200">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "admin" | "member")}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                >
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={submitting || !email.trim() || remaining <= 0 || !canManage}
              className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-md shadow-blue-500/40 transition-transform duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0 ${
                submitting || !email.trim() || remaining <= 0 || !canManage
                  ? "bg-slate-800 text-slate-400 cursor-not-allowed opacity-70"
                  : "bg-accent text-white hover:bg-blue-500"
              }`}
            >
              {submitting ? "Adding member..." : canManage ? "Add member" : "Only admins can add"}
            </button>
          </form>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Current team</h2>
          {state.members.length === 0 ? (
            <p className="text-sm text-slate-400">No team members yet. Add your first teammate above.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-800 bg-slate-900/90 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-2 font-semibold">Email</th>
                    <th className="px-4 py-2 font-semibold">Role</th>
                    <th className="px-4 py-2 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {state.members.map((member) => (
                    <tr key={member.id} className="border-b border-slate-800/70 last:border-0">
                      <td className="px-4 py-2 text-slate-100">{member.email}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                            member.role === "admin"
                              ? "bg-purple-500/15 text-purple-200 border border-purple-500/40"
                              : "bg-slate-800 text-slate-200 border border-slate-600"
                          }`}
                        >
                          {member.role === "admin" ? "Admin" : "Member"}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex justify-end gap-2 text-xs">
                          {isPro ? (
                            <>
                              {member.role !== "admin" && (
                                <button
                                  type="button"
                                  onClick={() => updateRole(member.id, "admin")}
                                  className="rounded-md border border-purple-500/60 bg-purple-600/20 px-3 py-1 font-semibold text-purple-100 hover:bg-purple-600/30 transition-transform duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0"
                                  disabled={!canManage}
                                >
                                  Make admin
                                </button>
                              )}
                              {member.role !== "member" && (
                                <button
                                  type="button"
                                  onClick={() => updateRole(member.id, "member")}
                                  className="rounded-md border border-slate-600 bg-slate-800 px-3 py-1 font-semibold text-slate-100 hover:bg-slate-700 transition-transform duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0"
                                  disabled={!canManage}
                                >
                                  Make member
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => removeMember(member.id)}
                                className="rounded-md border border-red-500/60 bg-red-600/20 px-3 py-1 font-semibold text-red-100 hover:bg-red-600/30 transition-transform duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0"
                                disabled={!canManage}
                              >
                                Remove
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-500">
                              Upgrade to Pro to manage roles
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        </motion.section>
      </div>
    </Page>
  );
}
