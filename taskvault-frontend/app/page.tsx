"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const sections = [
  {
    href: "/auth",
    title: "Authentication",
    badge: "Auth",
    description: "Email sign-up and sign-in powered by Supabase Auth.",
  },
  {
    href: "/account",
    title: "Account & Plans",
    badge: "Plans",
    description: "See your profile and toggle between Free and Pro plans.",
  },
  {
    href: "/workflows",
    title: "Workflows",
    badge: "Workflows",
    description: "Design lightweight workflows with ordered steps for your tasks.",
  },
  {
    href: "/team",
    title: "Team Management",
    badge: "Team",
    description: "Invite teammates, assign roles, and respect Free/Pro limits.",
  },
  {
    href: "/dashboard",
    title: "Analytics Dashboard",
    badge: "Analytics",
    description: "Visualize workflows, step statuses, and team composition.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-primary text-white px-4 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        <motion.header
          className="space-y-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/60 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-300">
            TaskVault · Full stack demo
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
        </motion.header>

        <motion.section
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
        >
          {sections.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.15 + index * 0.03, ease: "easeOut" }}
            >
              <Link
                href={item.href}
                className="group rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:border-accent/70 hover:shadow-md hover:shadow-accent/20 min-h-[8.5rem]"
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
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          className="mt-4 grid gap-5 md:grid-cols-3 text-sm text-slate-300"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.18 }}
        >
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 min-h-[7rem]">
            <p className="font-semibold text-slate-100 mb-2">Built for free tiers</p>
            <p>
              Uses Next.js, FastAPI, and Supabase in a way that fits comfortably
              within typical free-tier limits.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 min-h-[7rem]">
            <p className="font-semibold text-slate-100 mb-2">Implementation history</p>
            <p>
              Every major step is documented and tagged in git so you can step through
              the project evolution.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 min-h-[7rem]">
            <p className="font-semibold text-slate-100 mb-2">Ready to extend</p>
            <p>
              Add real billing, stronger RBAC, or deeper analytics on top of the
              existing foundation.
            </p>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

