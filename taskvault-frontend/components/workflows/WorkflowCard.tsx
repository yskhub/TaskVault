"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function WorkflowCard({
  title,
  status,
  stepCount,
  children,
}: {
  title: string;
  status: string;
  stepCount?: number;
  children?: ReactNode;
}) {
  return (
    <motion.div
      className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center gap-2 mb-3">
        <div className="space-y-1">
          <h3 className="font-semibold text-sm text-white">{title}</h3>
          {typeof stepCount === "number" && (
            <p className="text-[11px] text-slate-400">
              {stepCount} step{stepCount === 1 ? "" : "s"}
            </p>
          )}
        </div>
        <span
          className={`text-[11px] px-2 py-1 rounded-full font-medium ${
            status === "done"
              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
              : "bg-amber-500/10 text-amber-200 border border-amber-500/40"
          }`}
        >
          {status}
        </span>
      </div>
      {children}
    </motion.div>
  );
}
