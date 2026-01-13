"use client";

import { motion, AnimatePresence } from "framer-motion";

export type CommandAction = {
  label: string;
  onSelect: () => void;
};

export function CommandPalette({
  actions,
  open,
  onOpenChange,
}: {
  actions: CommandAction[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <>
      <button
        onClick={() => onOpenChange(true)}
        className="hidden"
        aria-hidden
      />

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
          >
            <motion.div
              className="bg-slate-950 text-white w-full max-w-md rounded-xl shadow-lg p-4 border border-slate-800"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-3 text-xs text-slate-500">
                Quick actions
              </div>
              <div className="space-y-1">
                {actions.map((a) => (
                  <button
                    key={a.label}
                    onClick={() => {
                      a.onSelect();
                      onOpenChange(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-slate-900"
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

