"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Workflow, Users, BarChart3, KeyRound, CreditCard } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Page } from "@/components/motion/Page";
import { ListItem } from "@/components/motion/ListItem";
import DemoCarousel from "@/components/demo/DemoCarousel";

const sections = [
  {
    href: "/auth",
    title: "Authentication",
    badge: "Auth",
    description: "Email sign-up and sign-in powered by Supabase Auth.",
    icon: KeyRound,
    spotlightColor: "rgba(56, 189, 248, 0.25)",
  },
  {
    href: "/account",
    title: "Account & Plans",
    badge: "Plans",
    description: "See your profile and toggle between Free and Pro plans.",
    icon: CreditCard,
    spotlightColor: "rgba(129, 140, 248, 0.25)",
  },
  {
    href: "/workflows",
    title: "Workflows",
    badge: "Workflows",
    description: "Design lightweight workflows with ordered steps for your tasks.",
    icon: Workflow,
    spotlightColor: "rgba(52, 211, 153, 0.25)",
  },
  {
    href: "/team",
    title: "Team Management",
    badge: "Team",
    description: "Invite teammates, assign roles, and respect Free/Pro limits.",
    icon: Users,
    spotlightColor: "rgba(96, 165, 250, 0.25)",
  },
  {
    href: "/dashboard",
    title: "Analytics Dashboard",
    badge: "Analytics",
    description: "Visualize workflows, step statuses, and team composition.",
    icon: BarChart3,
    spotlightColor: "rgba(251, 191, 36, 0.25)",
  },
];

export default function Home() {
  return (
    <Page className="min-h-screen text-white px-4 py-10 sm:px-8 lg:px-10 xl:px-16">
      <div className="flex w-full flex-col gap-16">
        <motion.header
          className="relative space-y-4 overflow-visible"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="pointer-events-none absolute inset-x-0 -top-40 h-72 bg-gradient-to-b from-sky-500/15 via-slate-950/0 to-transparent blur-3xl" />
          <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-100">
            TaskVault
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight lg:max-w-4xl">
                Build workflows. Enforce limits. Track execution.
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-200">
                A secure internal tool for serious teams.
              </p>
              <p className="mt-3 max-w-3xl text-sm sm:text-base text-slate-300">
                Role-based access. Usage limits. Audit trails. No payments. No fluff.
              </p>
            </div>
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.12 }}
        >
          <DemoCarousel />
        </motion.section>

        <motion.section
          className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
        >
          {sections.map((item, index) => {
            const Icon = item.icon;
            return (
              <ListItem key={item.href} index={index}>
                <Link href={item.href} className="group block">
                  <SpotlightCard
                    className="p-4 flex flex-col gap-2 bg-slate-900/80 border border-slate-700/80 shadow-lg shadow-blue-900/40 transition-transform duration-200 ease-out group-hover:-translate-y-1 group-hover:scale-[1.03] group-hover:shadow-blue-500/60"
                    spotlightColor={item.spotlightColor}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-blue-500/20 border border-blue-400/70 shadow-sm shadow-blue-500/50">
                          <Icon className="h-4 w-4 text-blue-300" />
                        </div>
                        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-200">
                          {item.title}
                        </p>
                      </div>
                      <span className="rounded-full border border-blue-500/70 bg-blue-500/10 px-3 py-0.5 text-xs font-semibold text-blue-200">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-sm text-slate-50 mb-2 leading-relaxed">
                      {item.description}
                    </p>
                    <p className="mt-auto text-sm sm:text-base font-semibold text-accent group-hover:text-blue-300">
                      Open {item.title.toLowerCase()}
                    </p>
                  </SpotlightCard>
                </Link>
              </ListItem>
            );
          })}
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
    </Page>
  );
}

