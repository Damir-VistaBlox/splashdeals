"use client";

import * as React from "react"
import { motion, useMotionTemplate, useMotionValue, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

export interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  className?: string;
  children?: React.ReactNode;
  innerClassName?: string;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, innerClassName, ...props }, ref) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        className={cn(
          "group relative overflow-hidden rounded-2xl",
          "bg-white/[0.03] backdrop-blur-2xl",
          "border border-white/10",
          "shadow-[0_20px_50px_rgba(0,0,0,0.5)]",
          "transition-all duration-300",
          "focus-within:ring-2 focus-within:ring-cyan-500/50 outline-none",
          className
        )}
        {...props}
      >
        {/* Radial Glow (Aqua Base) */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(650px circle at ${mouseX}px ${mouseY}px, rgba(6, 182, 212, 0.1), transparent 80%)
            `,
          }}
        />

        {/* 🏙️ Structural Reflections */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity duration-700" />
        
        {/* Subtle top-light reflection */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        
        {/* Bottom Inner Shadow */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

        <div className={cn("relative z-10 h-full w-full", innerClassName)}>
          {children}
        </div>
      </motion.div>
    )
  }
)
GlassCard.displayName = "GlassCard"

