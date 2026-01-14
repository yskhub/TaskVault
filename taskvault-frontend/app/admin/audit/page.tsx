"use client";

import { useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type AuditLog = {
  id: string;
  actor_id: string | null;
  actor_role: string | null;
  action: string;
  target: string | null;
  created_at: string;
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"all" | "24h" | "7d">("all");
  const [actorFilter, setActorFilter] = useState<"all" | "admin" | "system">("all");

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await fetch(`${API_BASE_URL}/audit-logs?actor_role=admin&limit=50`);
        if (!res.ok) {
          if (res.status === 403) {
            setError("Only admins can view audit logs.");
          } else {
            setError("Failed to load audit logs.");
          }
          return;
        }
        const data: AuditLog[] = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Failed to load audit logs", err);
        setError("Failed to load audit logs.");
      } finally {
        setLoading(false);
      }
    }

    void loadLogs();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen text-white px-4 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl animate-pulse space-y-4">
          <div className="space-y-2">
            <div className="h-3 w-40 rounded-full bg-slate-800/80" />
            <div className="h-7 w-56 rounded-lg bg-slate-800/80" />
          </div>
          <div className="h-10 w-full rounded-lg bg-slate-900/80" />
          <div className="h-40 w-full rounded-xl bg-slate-900/80" />
        </div>
      </main>
    );
  }

  const now = Date.now();
  const filteredLogs = logs.filter((log) => {
    let matchesTime = true;
    const created = new Date(log.created_at).getTime();
    if (timeRange === "24h") {
      matchesTime = now - created <= 24 * 60 * 60 * 1000;
    } else if (timeRange === "7d") {
      matchesTime = now - created <= 7 * 24 * 60 * 60 * 1000;
    }

    let matchesActor = true;
    if (actorFilter === "admin") {
      matchesActor = log.actor_role === "admin";
    } else if (actorFilter === "system") {
      matchesActor = log.actor_id === null;
    }

    return matchesTime && matchesActor;
  });

  return (
    <main className="min-h-screen text-white px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Admin
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Audit logs
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            A lightweight feed of important actions like team changes and workflow events. This is
            a prototype viewer backed by Supabase.
          </p>
        </header>

        {logs.length > 0 && (
          <section className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400">Time range:</span>
              {[
                { id: "all" as const, label: "All" },
                { id: "24h" as const, label: "Last 24h" },
                { id: "7d" as const, label: "Last 7d" },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTimeRange(option.id)}
                  className={`rounded-full border px-3 py-1 transition-colors ${
                    timeRange === option.id
                      ? "border-blue-500 bg-blue-500/20 text-blue-100"
                      : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-400">Actor:</span>
              {[
                { id: "all" as const, label: "All" },
                { id: "admin" as const, label: "Admins" },
                { id: "system" as const, label: "System" },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setActorFilter(option.id)}
                  className={`rounded-full border px-3 py-1 transition-colors ${
                    actorFilter === option.id
                      ? "border-blue-500 bg-blue-500/20 text-blue-100"
                      : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {!error && logs.length > 0 && (
          <section className="grid gap-4 md:grid-cols-4 text-xs sm:text-sm">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1">
                Total events
              </p>
              <p className="text-2xl font-semibold text-slate-50">{logs.length}</p>
              <p className="mt-1 text-[11px] text-slate-400">
                Most recent {logs.length === 50 ? '50' : logs.length} actions from the system.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1">
                Unique actors
              </p>
              <p className="text-2xl font-semibold text-slate-50">
                {new Set(logs.map((l) => l.actor_id ?? 'system')).size}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">Users or system processes that triggered events.</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1">
                Admin actions
              </p>
              <p className="text-2xl font-semibold text-slate-50">
                {logs.filter((l) => l.actor_role === 'admin').length}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">Events performed by admin-level accounts.</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 mb-1">
                Last 24 hours
              </p>
              <p className="text-2xl font-semibold text-slate-50">
                {logs.filter((l) => {
                  const created = new Date(l.created_at).getTime();
                  const now = Date.now();
                  return now - created <= 24 * 60 * 60 * 1000;
                }).length}
              </p>
              <p className="mt-1 text-[11px] text-slate-400">Recent activity window for quick checks.</p>
            </div>
          </section>
        )}

        {error && (
          <div className="rounded-md border border-red-500/60 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </div>
        )}

        {logs.length === 0 ? (
          <p className="text-sm text-slate-400">
            No audit events have been recorded yet. Perform an action like adding a team member or
            creating a workflow, then refresh.
          </p>
        ) : filteredLogs.length === 0 ? (
          <p className="text-sm text-slate-400">
            No audit events match the current filters. Try changing the time range or actor.
          </p>
        ) : (
          <>
            <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 text-xs sm:text-sm text-slate-300">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Recent highlights
              </p>
              <ul className="space-y-1.5">
                {filteredLogs.slice(0, 5).map((log) => (
                  <li key={log.id} className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-200">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </span>
                    <span className="font-medium text-slate-100">{log.action}</span>
                    {log.target && (
                      <span className="text-slate-400">on {log.target}</span>
                    )}
                    <span className="text-slate-500">
                      by {log.actor_id ?? 'system'}{log.actor_role ? ` (${log.actor_role})` : ''}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/80">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-800 bg-slate-900/90 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-2 font-semibold">When</th>
                    <th className="px-4 py-2 font-semibold">Action</th>
                    <th className="px-4 py-2 font-semibold">Target</th>
                    <th className="px-4 py-2 font-semibold">Actor</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="border-b border-slate-800/70 last:border-0">
                      <td className="px-4 py-2 text-xs text-slate-300">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-slate-100 text-xs sm:text-sm">
                        {log.action}
                      </td>
                      <td className="px-4 py-2 text-xs text-slate-300">
                        {log.target ?? '—'}
                      </td>
                      <td className="px-4 py-2 text-xs text-slate-300">
                        {log.actor_id ?? 'system'} {log.actor_role ? `(${log.actor_role})` : ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
