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
            className="fixed bottom-16 right-4 z-50 sm:bottom-20 sm:right-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <motion.div
              className="bg-slate-950 text-white w-60 rounded-xl shadow-lg p-3 border border-slate-800"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="mb-2 text-xs font-medium text-slate-400">
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
                    className="w-full text-left px-2.5 py-1.5 rounded-md text-xs sm:text-sm hover:bg-slate-900"
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

