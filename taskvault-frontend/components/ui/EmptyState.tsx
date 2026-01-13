"use client";

import { motion } from "framer-motion";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center text-white"
    >
      <div className="mb-4 h-24 w-24 rounded-full bg-slate-900/80 border border-slate-800" />
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-2">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
