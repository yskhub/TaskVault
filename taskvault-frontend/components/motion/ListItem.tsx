"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type ListItemProps = {
  children: ReactNode;
  className?: string;
  index?: number;
};

export function ListItem({ children, className, index = 0 }: ListItemProps) {
  const delay = 0.03 * index;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
