"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  isTabActive: boolean;
  isReducedMotion: boolean;
  isHovered: boolean;
  setIsHovered: (v: boolean) => void;
}

export function Logo({ isTabActive, isReducedMotion, isHovered, setIsHovered }: LogoProps) {
  return (
    <Link
      href={``}
      className="group flex items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "flex items-center tracking-[-0.08em] select-none",
        (isTabActive && !isReducedMotion) ? "animate-float group-hover:[animation-play-state:paused]" : ""
      )}>
        <div className="relative overflow-hidden group/logo">
          <span className="text-2xl md:text-3xl font-black italic uppercase text-splash relative z-10">
            Splash
          </span>
          {/* Glint Overlay */}
          <div className="absolute inset-0 z-20 pointer-events-none translate-x-[-100%] group-hover/logo:animate-logo-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]" />
        </div>

        <div className="relative">
          {/* Water Splash Particles */}
          <AnimatePresence mode="popLayout">
            {(isHovered && !isReducedMotion) && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={`drop-${i}`}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.2, 0.4],
                      x: ((i * 37) % 80) - 40,
                      y: ((i * 41) % 70) - 45,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut",
                      delay: i * 0.01,
                    }}
                    className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full blur-[1px]"
                  />
                ))}
                {/* Ripple Effect */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: [0, 0.4, 0], scale: 2.5 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-cyan-400/30 rounded-xl blur-lg"
                />
              </div>
            )}
          </AnimatePresence>
        </div>

        <span className="text-2xl md:text-3xl font-black italic uppercase text-white group-hover:text-cyan-50 transition-colors -ml-1">
          deals
        </span>
        <div className="relative ml-1 mt-3">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-cyan-400 blur-[2px] animate-ping opacity-50" />
          <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse delay-75 scale-150 opacity-20 pointer-events-none group-hover:scale-[3] transition-transform duration-500" />
        </div>
      </div>
    </Link>
  );
}
