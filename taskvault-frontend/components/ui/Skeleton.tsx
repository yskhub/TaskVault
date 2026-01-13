"use client";

import { motion } from "framer-motion";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`animate-pulse rounded-md bg-slate-800/70 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    />
  );
}
