"use client";

import Link from "next/link";

const sections = [
  {
    href: "/auth",
    title: "Authentication",
    badge: "Phase 2",
    description: "Email sign-up and sign-in powered by Supabase Auth.",
  },
  {
    href: "/account",
    title: "Account & Plans",
    badge: "Phase 2 & 6",
    description: "See your profile and toggle between Free and Pro plans.",
  },
  {
    href: "/workflows",
    title: "Workflows",
    badge: "Phase 3",
    description: "Design lightweight workflows with ordered steps for your tasks.",
  },
  {
    href: "/team",
    title: "Team Management",
    badge: "Phase 4 & 6",
    description: "Invite teammates, assign roles, and respect Free/Pro limits.",
  },
  {
    href: "/dashboard",
    title: "Analytics Dashboard",
    badge: "Phase 5 & 6",
    description: "Visualize workflows, step statuses, and team composition.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-primary text-white px-4 py-14 sm:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16">
        <header className="space-y-4">
          <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/60 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-300">
            TaskVault · Phases 1–8
          </span>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
                Your subscription-friendly workflow hub
              </h1>
              <p className="mt-5 max-w-3xl text-lg text-slate-200">
                TaskVault brings together authentication, plans, workflows, team
                management, and analytics into a single, minimal SaaS console.
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-0">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-500"
              >
                Go to dashboard
              </Link>
              <Link
                href="/auth"
                className="inline-flex items-center justify-center rounded-md border border-slate-700 bg-slate-900/80 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-slate-800"
              >
                Sign in / Sign up
              </Link>
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {sections.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm transition hover:border-accent/70 hover:shadow-md hover:shadow-accent/20 min-h-[8.5rem]"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-base font-semibold uppercase tracking-[0.18em] text-slate-200">
                  {item.title}
                </p>
                <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-0.5 text-[11px] font-semibold text-slate-300">
                  {item.badge}
                </span>
              </div>
              <p className="text-base text-slate-100 mb-4 leading-relaxed">{item.description}</p>
              <p className="mt-auto text-sm sm:text-base font-semibold text-accent group-hover:text-blue-400">
                Open {item.title.toLowerCase()} →
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-4 grid gap-5 md:grid-cols-3 text-sm text-slate-300">
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 min-h-[7rem]">
            <p className="font-semibold text-slate-100 mb-2">Built for free tiers</p>
            <p>
              Uses Next.js, FastAPI, and Supabase in a way that fits comfortably
              within typical free-tier limits.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 min-h-[7rem]">
            <p className="font-semibold text-slate-100 mb-2">Phase-by-phase history</p>
            <p>
              Each phase is documented and tagged in git so you can step through the
              project evolution.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 min-h-[7rem]">
            <p className="font-semibold text-slate-100 mb-2">Ready to extend</p>
            <p>
              Add real billing, stronger RBAC, or deeper analytics on top of the
              existing foundation.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

