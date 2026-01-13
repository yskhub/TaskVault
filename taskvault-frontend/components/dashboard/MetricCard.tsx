"use client";

import { motion } from "framer-motion";

export function MetricCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper?: string;
}) {
  return (
    <motion.div
      className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <h2 className="text-2xl font-bold text-white">{value}</h2>
      {helper && <p className="mt-1 text-[11px] text-slate-500">{helper}</p>}
    </motion.div>
  );
}
