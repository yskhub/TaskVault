"use client";

import { motion } from "framer-motion";

export function OnboardingModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-slate-950 text-white rounded-xl p-6 max-w-md w-full border border-slate-800 shadow-xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <h2 className="text-xl font-bold mb-2">Welcome to TaskVault</h2>
        <p className="text-sm text-slate-300 mb-4">
          Create workflows, manage your team, and track progress from one place. This
          lightweight hub is designed to feel like a real subscription product.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-accent text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-500 transition-colors"
        >
          Get Started
        </button>
      </motion.div>
    </motion.div>
  );
}
