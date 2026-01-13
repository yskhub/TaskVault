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
        ) : (
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
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-800/70 last:border-0">
                    <td className="px-4 py-2 text-xs text-slate-300">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-slate-100 text-xs sm:text-sm">
                      {log.action}
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-300">
                      {log.target ?? "—"}
                    </td>
                    <td className="px-4 py-2 text-xs text-slate-300">
                      {log.actor_id ?? "system"} {log.actor_role ? `(${log.actor_role})` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
