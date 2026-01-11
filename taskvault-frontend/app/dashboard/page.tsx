"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type WorkflowStats = {
  total: number;
  with_steps: number;
  without_steps: number;
  total_steps: number;
  pending_steps: number;
  in_progress_steps: number;
  completed_steps: number;
};

type TeamStats = {
  total_members: number;
  admins: number;
  members: number;
};

type AnalyticsOverview = {
  workflows: WorkflowStats;
  team: TeamStats;
};

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAnalytics() {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/overview`);
      if (!res.ok) {
        throw new Error("Failed to load analytics");
      }
      const json = (await res.json()) as AnalyticsOverview;
      setData(json);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Unable to load analytics data. Try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-primary text-white">
        <p className="text-sm text-slate-200">Loading dashboard...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-primary text-white">
        <div className="rounded-xl bg-slate-900/70 p-8 shadow-xl border border-slate-800 text-center max-w-md mx-auto">
          <h1 className="mb-2 text-2xl font-bold">Dashboard unavailable</h1>
          <p className="mb-3 text-sm text-slate-300">{error ?? "No analytics data available yet."}</p>
          <p className="text-xs text-slate-500">Create a few workflows and team members, then refresh.</p>
        </div>
      </main>
    );
  }

  const workflow = data.workflows;
  const team = data.team;

  const completionRate =
    workflow.total_steps === 0
      ? 0
      : Math.round((workflow.completed_steps / workflow.total_steps) * 100);

  const stepsChartData = {
    labels: ["Pending", "In progress", "Completed"],
    datasets: [
      {
        label: "Steps",
        data: [
          workflow.pending_steps,
          workflow.in_progress_steps,
          workflow.completed_steps,
        ],
        backgroundColor: [
          "rgba(148, 163, 184, 0.9)",
          "rgba(56, 189, 248, 0.9)",
          "rgba(52, 211, 153, 0.9)",
        ],
        borderColor: [
          "rgba(148, 163, 184, 1)",
          "rgba(56, 189, 248, 1)",
          "rgba(52, 211, 153, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const teamChartData = {
    labels: ["Admins", "Members"],
    datasets: [
      {
        label: "Team members",
        data: [team.admins, team.members],
        backgroundColor: [
          "rgba(168, 85, 247, 0.9)",
          "rgba(59, 130, 246, 0.9)",
        ],
        borderRadius: 6,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-primary text-white px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Phase 5 · Dashboard & analytics
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            See a quick overview of how TaskVault is being used: workflows in motion and your
            current team footprint.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow">
            <p className="text-xs uppercase tracking-wide text-slate-400">Workflows</p>
            <p className="mt-2 text-3xl font-semibold">{workflow.total}</p>
            <p className="mt-1 text-xs text-slate-400">
              {workflow.with_steps} with steps · {workflow.without_steps} without steps
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow">
            <p className="text-xs uppercase tracking-wide text-slate-400">Workflow steps</p>
            <p className="mt-2 text-3xl font-semibold">{workflow.total_steps}</p>
            <p className="mt-1 text-xs text-slate-400">
              {workflow.pending_steps} pending · {workflow.in_progress_steps} in progress · {" "}
              {workflow.completed_steps} completed
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow">
            <p className="text-xs uppercase tracking-wide text-slate-400">Team</p>
            <p className="mt-2 text-3xl font-semibold">{team.total_members}</p>
            <p className="mt-1 text-xs text-slate-400">
              {team.admins} admins · {team.members} members
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Completion rate</p>
              <p className="mt-2 text-3xl font-semibold">{completionRate}%</p>
              <p className="mt-1 text-xs text-slate-400">
                Percentage of workflow steps that are marked as completed.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                loadAnalytics();
              }}
              className="mt-3 inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:bg-slate-800"
            >
              Refresh analytics
            </button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 items-start">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">Workflow step status</h2>
                <p className="text-xs text-slate-400">Distribution of all steps across states.</p>
              </div>
            </div>
            <div className="h-64">
              <Doughnut
                data={stepsChartData}
                options={{
                  plugins: {
                    legend: {
                      position: "bottom" as const,
                      labels: { color: "#e5e7eb", boxWidth: 12, boxHeight: 12 },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">Team composition</h2>
                <p className="text-xs text-slate-400">Compare admins and members at a glance.</p>
              </div>
            </div>
            <div className="h-64">
              <Bar
                data={teamChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      ticks: { color: "#9ca3af" },
                      grid: { display: false },
                    },
                    y: {
                      ticks: { color: "#9ca3af", precision: 0 },
                      grid: { color: "rgba(55,65,81,0.6)" },
                    },
                  },
                }}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
