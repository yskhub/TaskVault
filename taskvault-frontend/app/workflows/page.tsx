"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

type Step = {
  title: string;
  assigned_to: string;
  status?: "pending" | "in_progress" | "completed";
};

type Workflow = {
  id: number;
  title: string;
  steps: Step[];
};

export default function WorkflowsPage() {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState<Step[]>([{ title: "", assigned_to: "" }]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchWorkflows() {
    try {
      const res = await fetch(`${API_BASE_URL}/workflows`);
      if (!res.ok) return;
      const data: Workflow[] = await res.json();
      setWorkflows(data);
    } catch (err) {
      console.error("Failed to load workflows", err);
    }
  }

  useEffect(() => {
    fetchWorkflows();
  }, []);

  function updateStep(index: number, field: keyof Step, value: string) {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, [field]: value } : step))
    );
  }

  function addStepRow() {
    setSteps((prev) => [...prev, { title: "", assigned_to: "" }]);
  }

  function updateWorkflowStepStatus(
    workflowId: number,
    stepIndex: number,
    status: Step["status"]
  ) {
    setWorkflows((prev) =>
      prev.map((wf) =>
        wf.id === workflowId
          ? {
              ...wf,
              steps: wf.steps.map((step, idx) =>
                idx === stepIndex ? { ...step, status } : step
              ),
            }
          : wf
      )
    );
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    const filteredSteps = steps.filter((s) => s.title.trim() && s.assigned_to.trim());

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/workflows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, steps: filteredSteps }),
      });

      if (!res.ok) {
        console.error("Failed to create workflow", await res.text());
        return;
      }

      setTitle("");
      setSteps([{ title: "", assigned_to: "" }]);
      await fetchWorkflows();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-primary text-white px-4 py-10 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <motion.header
          className="space-y-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Workflow management
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Workflows</h1>
          <p className="text-sm text-slate-300 max-w-2xl">
            Create lightweight workflows, assign steps to team members, and track basic
            status. This is an in-memory prototype.
          </p>
        </motion.header>

        <motion.section
          className="rounded-xl border border-slate-800 bg-slate-900/70 p-6 space-y-4 shadow-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
        >
          <h2 className="text-lg font-semibold">Create workflow</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1 text-sm">
              <label className="block text-slate-200">Workflow title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="e.g. New hire onboarding"
              />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-200">Steps</span>
                <button
                  type="button"
                  onClick={addStepRow}
                  className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs font-semibold text-slate-100 hover:bg-slate-800 transition-transform duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0"
                >
                  + Add step
                </button>
              </div>

              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="grid gap-2 rounded-md border border-slate-800 bg-slate-950/60 p-3 sm:grid-cols-2"
                  >
                    <div className="space-y-1">
                      <label className="block text-[11px] uppercase tracking-wide text-slate-400">
                        Step title
                      </label>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => updateStep(index, "title", e.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                        placeholder="e.g. Manager approval"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] uppercase tracking-wide text-slate-400">
                        Assigned to
                      </label>
                      <input
                        type="text"
                        value={step.assigned_to}
                        onChange={(e) => updateStep(index, "assigned_to", e.target.value)}
                        className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-white outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                        placeholder="e.g. finance@team.org"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/40 hover:bg-blue-500 disabled:opacity-60 transition-transform duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:hover:translate-y-0"
            >
              {loading ? "Creating..." : "Create workflow"}
            </button>
          </form>
        </motion.section>

        <motion.section
          className="space-y-3"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold">Existing workflows</h2>
          {workflows.length === 0 ? (
            <p className="text-sm text-slate-400">No workflows yet. Create your first one above.</p>
          ) : (
            <div className="space-y-3">
              {workflows.map((wf) => (
                <div
                  key={wf.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-white">{wf.title}</h3>
                    <span className="text-[11px] text-slate-400">
                      {wf.steps.length} step{wf.steps.length === 1 ? "" : "s"}
                    </span>
                  </div>

                  {wf.steps.length > 0 && (
                    <div className="text-[11px] text-slate-400">
                      {(() => {
                        const completed = wf.steps.filter(
                          (s) => (s.status ?? "pending") === "completed"
                        ).length;
                        const total = wf.steps.length;
                        const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
                        return (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span>Progress</span>
                              <span className="text-slate-300 font-medium">{pct}%</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                              <div
                                className="h-full rounded-full bg-emerald-400 transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                  {wf.steps.length > 0 && (
                    <ol className="mt-1 space-y-1 text-xs text-slate-300">
                      {wf.steps.map((step, index) => (
                        <li key={index} className="flex items-center justify-between gap-2">
                          <span>
                            <span className="font-medium text-slate-100">{step.title}</span>
                            {" "}
                            <span className="text-slate-400">· {step.assigned_to}</span>
                          </span>
                          <div className="flex items-center gap-1.5">
                            {["pending", "in_progress", "completed"].map((s) => {
                              const value = s as Step["status"];
                              const active = (step.status ?? "pending") === value;
                              const label =
                                value === "pending"
                                  ? "Pending"
                                  : value === "in_progress"
                                  ? "In progress"
                                  : "Done";
                              return (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => updateWorkflowStepStatus(wf.id, index, value)}
                                  className={`inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-[10px] font-medium transition ${
                                    active
                                      ? value === "completed"
                                        ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                                        : value === "in_progress"
                                        ? "border-sky-400 bg-sky-500/20 text-sky-100"
                                        : "border-slate-400 bg-slate-500/20 text-slate-100"
                                      : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500/80"
                                  }`}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.section>
      </div>
    </main>
  );
}
