"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useInView, animate } from "framer-motion";
import { GlassCard } from "./GlassCard";

interface StatItem {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  sublabel?: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

function Counter({ value, suffix }: { value: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Parse numeric value (handles integers and simple decimals)
  const targetValue = parseFloat(value) || 0;
  
  // Motion values
  const count = useMotionValue(0);
  const spring = useSpring(count, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Transform to display string (handles rounding)
  const displayValue = useTransform(spring, (latest) => {
    // If original value had decimals, keep 1 decimal, else round to integer
    const hasDecimals = value.includes(".");
    return hasDecimals ? latest.toFixed(1) : Math.round(latest).toString();
  });

  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    const timer = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(timer);
  }, []);


  useEffect(() => {
    if (isInView && mounted) {
      // Defer animation to break up the main thread task
      const timeout = setTimeout(() => {
        animate(count, targetValue, { duration: 2, ease: "easeOut" });
      }, 500); // Increased delay
      return () => clearTimeout(timeout);
    }
  }, [isInView, count, targetValue, mounted]);


  return (
    <data ref={ref} value={value}>
      <motion.span>{displayValue}</motion.span>
      {suffix && <span>{suffix}</span>}
    </data>
  );
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <GlassCard className="p-8 h-full flex flex-col justify-center items-center text-center group hover:border-cyan-500/50 transition-colors duration-500 overflow-hidden">
            <div className="text-4xl md:text-5xl font-black mb-2 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:to-blue-500 transition-all flex items-baseline">
              <Counter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-sm font-bold text-cyan-400/80 uppercase tracking-widest mb-1">
              {stat.label}
            </div>
            {stat.sublabel && (
              <div className="text-xs text-slate-400 leading-relaxed max-w-[200px]">
                {stat.sublabel}
              </div>
            )}
            
            {/* 🧪 Decorative accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* 💎 Glass shine effect */}
            <div className="absolute -inset-x-full top-0 h-full w-1/2 z-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-25deg] group-hover:animate-shimmer transition-all" />
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}
