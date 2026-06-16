"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@/components/ui/Icon";

interface OfflineIndicatorProps {
  isOnline: boolean;
  dict: any;
}

export function OfflineIndicator({ isOnline, dict }: OfflineIndicatorProps) {
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, x: 10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.5, x: 10 }}
          className="flex items-center gap-1.5 px-2 py-1 bg-destructive/10 border border-destructive/20 rounded-lg text-[9px] font-black text-destructive uppercase tracking-wider shadow-lg"
        >
          <Icon name="cloud_off" className="text-[12px] animate-pulse" />
          {dict.nav.offline || "Nema Mreže"}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
