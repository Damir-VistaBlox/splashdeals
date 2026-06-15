"use client";
import { Icon } from "@/components/ui/Icon";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ShareButtonProps {
  title: string;
  url: string;
  className?: string;
}

/**
 * 🔗 ShareButton Island (Client)
 * Integrates Web Share & Clipboard APIs with rich physical vibration callbacks
 * and real-time visual state mutations for absolute user confidence.
 */
export function ShareButton({ title, url, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // 📳 Haptic Vibration API: Feedback confirmation
    if (typeof navigator !== 'undefined' && "vibrate" in navigator) {
      navigator.vibrate(15);
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Pogledajte ${title} na Splashdeals!`,
          url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error("Error sharing:", err);
        }
      }
    } else {
      // 📋 Clipboard API Fallback: Smooth state transition
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (typeof navigator !== 'undefined' && "vibrate" in navigator) {
          navigator.vibrate([15, 40, 15]); // Double-tap confirmation
        }
      } catch (err) {
        console.error("Error copying to clipboard:", err);
      }
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleShare}
      className={cn(
        "relative p-2.5 rounded-full backdrop-blur-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group overflow-hidden flex items-center justify-center min-w-[36px] min-h-[36px]",
        copied ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "",
        className
      )}
      title={copied ? "Kopirano!" : "Podeli"}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Icon name="check" className="w-[14px] h-[14px] text-emerald-400" />
          </motion.div>
        ) : (
          <motion.div
            key="share"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Icon name="share" className="w-[14px] h-[14px] text-slate-300 group-hover:text-cyan-400 transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
