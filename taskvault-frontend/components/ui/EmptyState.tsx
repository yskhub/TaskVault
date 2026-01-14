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
      <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/80 shadow-inner shadow-black/60">
        <svg
          viewBox="0 0 80 80"
          aria-hidden="true"
          className="h-16 w-16 text-slate-500"
        >
          <rect
            x="8"
            y="18"
            width="64"
            height="44"
            rx="8"
            className="fill-slate-900 stroke-slate-700"
            strokeWidth="1.5"
          />
          <rect
            x="16"
            y="26"
            width="24"
            height="6"
            rx="3"
            className="fill-slate-700"
          />
          <rect
            x="16"
            y="38"
            width="16"
            height="4"
            rx="2"
            className="fill-slate-800"
          />
          <rect
            x="16"
            y="46"
            width="20"
            height="4"
            rx="2"
            className="fill-slate-800"
          />
          <rect
            x="44"
            y="34"
            width="18"
            height="14"
            rx="4"
            className="fill-slate-900 stroke-slate-700"
            strokeWidth="1.5"
          />
          <circle cx="53" cy="41" r="3" className="fill-sky-400" />
          <path
            d="M12 60h56"
            className="stroke-slate-800"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h3 className="font-semibold text-lg mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-2">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
