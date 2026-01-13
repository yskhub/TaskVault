"use client";

import { motion } from "framer-motion";

export function TeamMemberCard({
  email,
  role,
  onRemove,
  canManage,
}: {
  email: string;
  role: string;
  onRemove?: () => void;
  canManage?: boolean;
}) {
  return (
    <motion.div
      className="flex justify-between items-center rounded-lg border border-slate-800 p-4 bg-slate-900/70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div>
        <p className="font-medium text-sm text-white">{email}</p>
        <span className="text-[11px] text-slate-400 uppercase tracking-wide">{role}</span>
      </div>
      <button
        type="button"
        onClick={onRemove}
        disabled={!canManage}
        className={`text-xs font-semibold ${
          canManage
            ? "text-red-400 hover:text-red-300 hover:underline"
            : "text-slate-500 cursor-not-allowed"
        }`}
      >
        Remove
      </button>
    </motion.div>
  );
}
