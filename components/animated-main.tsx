"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function AnimatedMain({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      {children}
    </motion.main>
  );
}
