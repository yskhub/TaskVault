"use client";

import { motion } from "framer-motion";

export type TourStep = {
  title: string;
  body: string;
};

export function GuidedTour({ step, onNext }: { step: TourStep; onNext: () => void }) {
  return (
    <motion.div
      className="fixed bottom-6 right-6 bg-slate-950 text-white shadow-lg rounded-xl p-4 max-w-sm z-50 border border-slate-800"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h4 className="font-semibold mb-1 text-sm">{step.title}</h4>
      <p className="text-xs text-slate-400 mb-3">{step.body}</p>
      <button
        onClick={onNext}
        className="text-xs bg-accent text-white px-3 py-1 rounded-md hover:bg-blue-500"
      >
        Got it
      </button>
    </motion.div>
  );
}
