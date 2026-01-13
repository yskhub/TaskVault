"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
// Load chart components only on the client to avoid any SSR/hydration
// issues in production (e.g. on Vercel).
const Doughnut = dynamic(
  () => import("react-chartjs-2").then((m) => m.Doughnut),
  { ssr: false }
);
const Bar = dynamic(
  () => import("react-chartjs-2").then((m) => m.Bar),
  { ssr: false }
);

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

import { MetricCard } from "@/components/dashboard/MetricCard";
import { supabase } from "../../lib/supabaseClient";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import {
  GuidedTour,
  type TourStep,
} from "@/components/onboarding/GuidedTour";

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

type BackendStatus = "checking" | "ok" | "degraded" | "error";

type HealthInfo = {
  backendLatencyMs?: number;
  supabaseLatencyMs?: number;
  supabaseOk?: boolean;
};

type ActiveDrill = "workflows" | "steps" | "team" | "none";

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<BackendStatus>("checking");
  const [healthInfo, setHealthInfo] = useState<HealthInfo | null>(null);
  const [activeDrill, setActiveDrill] = useState<ActiveDrill>("none");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState<number | null>(null);

  const tourSteps: TourStep[] = [
    {
      title: "Your usage at a glance",
      body: "This dashboard gives you a read on workflows, steps, and team footprint. It updates as you use TaskVault.",
    },
    {
      title: "Drill into what matters",
      body: "Use the cards and charts below to focus on workflows, step status, or team composition as you explore.",
    },
  ];

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

  async function checkBackendHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) {
        setBackendStatus("error");
        setHealthInfo(null);
        return;
      }
      const json = await res.json();

      const supabaseOk = json?.supabase?.ok === true;
      const backendOk = json?.backend?.ok !== false; // default to true if missing

      if (backendOk && supabaseOk) {
        setBackendStatus("ok");
      } else if (backendOk && !supabaseOk) {
        setBackendStatus("degraded");
      } else {
        setBackendStatus("error");
      }

      setHealthInfo({
        backendLatencyMs: json?.backend?.latency_ms ?? undefined,
        supabaseLatencyMs: json?.supabase?.latency_ms ?? undefined,
        supabaseOk,
      });
    } catch {
      setBackendStatus("error");
      setHealthInfo(null);
    }
  }

  useEffect(() => {
    loadAnalytics();
    checkBackendHealth();
  }, []);

  useEffect(() => {
    async function initOnboarding() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("has_seen_tour")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Error loading onboarding flag", error);
          return;
        }

        if (!data?.has_seen_tour) {
          setShowOnboarding(true);
        }
      } catch (err) {
        console.error("Error initializing onboarding", err);
      }
    }

    void initOnboarding();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen text-white px-4 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 animate-pulse">
          <header className="space-y-3">
            <div className="h-3 w-40 rounded-full bg-slate-800/80" />
            <div className="h-8 w-64 rounded-lg bg-slate-800/80" />
            <div className="h-4 w-full max-w-xl rounded-lg bg-slate-800/70" />
          </header>

          <section className="flex justify-start sm:justify-end">
            <div className="mt-1 inline-flex w-full max-w-xs items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2">
              <span className="mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-700" />
              <div className="flex flex-col gap-1 w-full">
                <div className="h-3 w-32 rounded-full bg-slate-800" />
                <div className="h-3 w-40 rounded-full bg-slate-900" />
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow space-y-3">
              <div className="h-3 w-24 rounded-full bg-slate-800" />
              <div className="h-7 w-16 rounded-md bg-slate-800" />
              <div className="h-3 w-40 rounded-full bg-slate-900" />
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow space-y-3">
              <div className="h-3 w-28 rounded-full bg-slate-800" />
              <div className="h-7 w-20 rounded-md bg-slate-800" />
              <div className="h-3 w-44 rounded-full bg-slate-900" />
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow space-y-3">
              <div className="h-3 w-16 rounded-full bg-slate-800" />
              <div className="h-7 w-16 rounded-md bg-slate-800" />
              <div className="h-3 w-32 rounded-full bg-slate-900" />
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2 items-start">
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow space-y-4">
              <div className="h-4 w-40 rounded-full bg-slate-800" />
              <div className="h-3 w-52 rounded-full bg-slate-900" />
              <div className="h-56 rounded-xl bg-slate-950/80" />
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow space-y-4">
              <div className="h-4 w-40 rounded-full bg-slate-800" />
              <div className="h-3 w-64 rounded-full bg-slate-900" />
              <div className="h-56 rounded-xl bg-slate-950/80" />
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center text-white">
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
    <main className="min-h-screen text-white px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        {showOnboarding && (
          <OnboardingModal
            onClose={() => {
              setShowOnboarding(false);
              setTourStepIndex(0);
            }}
          />
        )}

        {tourStepIndex !== null && tourStepIndex >= 0 && tourStepIndex < tourSteps.length && (
          <GuidedTour
            step={tourSteps[tourStepIndex]}
            onNext={async () => {
              const next = tourStepIndex + 1;
              if (next < tourSteps.length) {
                setTourStepIndex(next);
                return;
              }

              setTourStepIndex(null);

              try {
                const {
                  data: { user },
                } = await supabase.auth.getUser();

                if (!user) return;

                await supabase
                  .from("profiles")
                  .update({ has_seen_tour: true })
                  .eq("id", user.id);
              } catch (err) {
                console.error("Failed to mark onboarding tour as seen", err);
              }
            }}
          />
        )}
        <motion.header
          className="space-y-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Dashboard & analytics
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            See a quick overview of how TaskVault is being used: workflows in motion and your
            current team footprint.
          </p>
        </motion.header>

        <motion.section
          className="grid gap-4 md:grid-cols-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.06 }}
        >
          <MetricCard
            label="Total workflows"
            value={workflow.total}
            helper={
              workflow.total === 0
                ? "Create your first workflow to get started."
                : `${workflow.with_steps} with steps · ${workflow.without_steps} without steps`
            }
          />
          <MetricCard
            label="Total steps"
            value={workflow.total_steps}
            helper={`${workflow.pending_steps} pending · ${workflow.in_progress_steps} in progress`}
          />
          <MetricCard
            label="Team members"
            value={team.total_members}
            helper={`${team.admins} admins · ${team.members} members`}
          />
        </motion.section>

        <motion.section
          className="flex justify-start sm:justify-end"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
        >
          <div
            className={`mt-1 inline-flex w-full max-w-xs items-start gap-2 rounded-xl border bg-slate-950/70 px-3 py-1.5 text-xs sm:text-[13px] font-medium
              ${
                backendStatus === "ok"
                  ? "border-emerald-500/50"
                  : backendStatus === "degraded"
                  ? "border-amber-400/60"
                  : backendStatus === "error"
                  ? "border-rose-500/70"
                  : "border-slate-700/70"
              }`}
          >
            <span
              className={`mt-[3px] h-1.5 w-1.5 flex-shrink-0 rounded-full
                ${
                  backendStatus === "ok"
                    ? "bg-emerald-400"
                    : backendStatus === "degraded"
                    ? "bg-amber-300"
                    : backendStatus === "error"
                    ? "bg-rose-400"
                    : "bg-slate-400"
                }`}
            />
            <div className="flex flex-col leading-tight text-slate-100">
              <span className="font-semibold tracking-tight">
                {backendStatus === "ok"
                  ? "System status · Healthy"
                  : backendStatus === "degraded"
                  ? "System status · Degraded"
                  : backendStatus === "error"
                  ? "System status · Unreachable"
                  : "System status · Checking"}
              </span>
              <span className="text-[11px] sm:text-xs font-normal text-slate-300/90">
                {backendStatus === "checking"
                  ? "Verifying API and Supabase health"
                  : `API ${
                      healthInfo?.backendLatencyMs != null
                        ? `${healthInfo.backendLatencyMs} ms`
                        : "latency: n/a"
                    } · Supabase ${
                      healthInfo?.supabaseOk === true
                        ? "OK"
                        : healthInfo?.supabaseOk === false
                        ? "issue"
                        : "n/a"
                    }${
                      healthInfo?.supabaseLatencyMs != null
                        ? ` · ${healthInfo.supabaseLatencyMs} ms`
                        : ""
                    }`}
              </span>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="grid gap-4 md:grid-cols-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        >
          <button
            type="button"
            onClick={() =>
              setActiveDrill((prev) => (prev === "workflows" ? "none" : "workflows"))
            }
            className={`rounded-xl border p-4 text-left shadow transition ${
              activeDrill === "workflows"
                ? "border-accent bg-slate-900/90 shadow-accent/30"
                : "border-slate-800 bg-slate-900/70 hover:border-accent/60"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">Workflows</p>
            <p className="mt-2 text-3xl font-semibold">{workflow.total}</p>
            <p className="mt-1 text-xs text-slate-400">
              {workflow.with_steps} with steps · {workflow.without_steps} without steps
            </p>
            {activeDrill === "workflows" && (
              <ul className="mt-3 space-y-1 text-xs text-slate-200">
                <li>
                  • Average steps per workflow: {workflow.total === 0
                    ? 0
                    : (workflow.total_steps / workflow.total).toFixed(1)}
                </li>
                <li>• Workflows without steps are good candidates to refine next.</li>
              </ul>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveDrill((prev) => (prev === "steps" ? "none" : "steps"))}
            className={`rounded-xl border p-4 text-left shadow transition ${
              activeDrill === "steps"
                ? "border-accent bg-slate-900/90 shadow-accent/30"
                : "border-slate-800 bg-slate-900/70 hover:border-accent/60"
            }`}
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">Workflow steps</p>
            <p className="mt-2 text-3xl font-semibold">{workflow.total_steps}</p>
            <p className="mt-1 text-xs text-slate-400">
              {workflow.pending_steps} pending · {workflow.in_progress_steps} in progress · {" "}
              {workflow.completed_steps} completed
            </p>
            {activeDrill === "steps" && (
              <ul className="mt-3 space-y-1 text-xs text-slate-200">
                <li>• Completion rate: {completionRate}% of all steps.</li>
                <li>• Pending + in-progress indicate current operational load.</li>
              </ul>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveDrill((prev) => (prev === "team" ? "none" : "team"))}
            className={`rounded-xl border p-4 text-left shadow transition
              ${
                activeDrill === "team"
                  ? "border-accent bg-slate-900/90 shadow-accent/30"
                  : "border-slate-800 bg-slate-900/70 hover:border-accent/60"
              }`}
          >
            <p className="text-xs uppercase tracking-wide text-slate-400">Team</p>
            <p className="mt-2 text-3xl font-semibold">{team.total_members}</p>
            <p className="mt-1 text-xs text-slate-400">
              {team.admins} admins · {team.members} members
            </p>
            {activeDrill === "team" && (
              <ul className="mt-3 space-y-1 text-xs text-slate-200">
                <li>• Admins handle approvals and configuration.</li>
                <li>• Members focus on executing workflow steps.</li>
              </ul>
            )}
          </button>
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
              className="mt-3 inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:bg-slate-800"
            >
              Refresh analytics
            </button>
          </div>
        </motion.section>

        <motion.section
          className="grid gap-6 lg:grid-cols-2 items-start"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.16 }}
        >
          <div
            className={`rounded-xl border p-5 shadow flex flex-col gap-4 transition
              ${
                activeDrill === "steps"
                  ? "border-accent bg-slate-900/90 shadow-accent/30"
                  : "border-slate-800 bg-slate-900/70"
              }`}
          >
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

          <div
            className={`rounded-xl border p-5 shadow flex flex-col gap-4 transition
              ${
                activeDrill === "team"
                  ? "border-accent bg-slate-900/90 shadow-accent/30"
                  : "border-slate-800 bg-slate-900/70"
              }`}
          >
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
        </motion.section>
      </div>
    </main>
  );
}
