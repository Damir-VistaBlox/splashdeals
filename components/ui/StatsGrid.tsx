"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

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
  const ref = useRef<HTMLDataElement>(null);
  const [inView, setInView] = useState(false);
  const [displayValue, setDisplayValue] = useState("0");
  const [hasAnimated, setHasAnimated] = useState(false);

  // Parse numeric value
  const targetValue = parseFloat(value) || 0;
  const hasDecimals = value.includes(".");

  // Use IntersectionObserver for in-view detection
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-100px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || hasAnimated) return;
    setTimeout(() => setHasAnimated(true));

    // Defer animation start
    const timeout = setTimeout(() => {
      const duration = 2000; // ms
      const startTime = performance.now();

      function animateCount(currentTime: number) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // easeOut cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = eased * targetValue;

        setDisplayValue(hasDecimals ? current.toFixed(1) : Math.round(current).toString());

        if (progress < 1) {
          requestAnimationFrame(animateCount);
        }
      }

      requestAnimationFrame(animateCount);
    }, 500);

    return () => clearTimeout(timeout);
  }, [inView, targetValue, hasDecimals, hasAnimated]);

  return (
    <data ref={ref} value={value}>
      <span>{displayValue}</span>
      {suffix && <span>{suffix}</span>}
    </data>
  );
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <Card className="group hover:border-primary/50 flex h-full flex-col items-center justify-center overflow-hidden p-8 text-center transition-colors duration-500">
            <div className="from-foreground to-muted-foreground group-hover:from-primary group-hover:to-primary/70 mb-2 flex items-baseline bg-gradient-to-br bg-clip-text text-4xl font-black text-transparent transition-all md:text-5xl">
              <Counter value={stat.value} suffix={stat.suffix} />
            </div>
            <div className="text-primary/80 mb-1 text-sm font-bold tracking-widest uppercase">
              {stat.label}
            </div>
            {stat.sublabel && (
              <div className="text-muted-foreground max-w-[200px] text-xs leading-relaxed">
                {stat.sublabel}
              </div>
            )}

            {/* 🧪 Decorative accent */}
            <div className="via-primary/20 absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            {/* 💎 Glass shine effect */}
            <div className="via-foreground/5 group-hover:animate-shimmer absolute -inset-x-full top-0 z-0 h-full w-1/2 skew-x-[-25deg] bg-gradient-to-r from-transparent to-transparent transition-all" />
          </Card>
        </div>
      ))}
      <style jsx>{`
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
