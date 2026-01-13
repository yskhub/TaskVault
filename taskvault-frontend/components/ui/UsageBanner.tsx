"use client";

import { motion } from "framer-motion";

export function UsageBanner({
  used,
  limit,
  plan,
}: {
  used: number;
  limit: number;
  plan: string;
}) {
  if (used < limit) return null;

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mb-4 rounded-lg border border-amber-300/70 bg-amber-500/10 p-4 text-xs text-amber-100"
    >
      <strong className="font-semibold">
        {plan} plan limit reached.
      </strong>{" "}
      You&apos;ve used {used}/{limit}. Upgrade to unlock more.
    </motion.div>
  );
}
