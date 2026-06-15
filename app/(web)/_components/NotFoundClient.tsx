"use client";
import { Icon } from "@/components/ui/Icon";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getClientDictionary } from "@/lib/client-dictionaries";
import { LiquidButton } from "@/components/ui/LiquidButton";
import { JsonLd } from "@/components/SEO/JsonLd";

export function NotFoundClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [dict, setDict] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    getClientDictionary().then(setDict);
  }, []);

  if (!dict) {
    return (
      <section className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-slate-800 animate-pulse" />
      </section>
    );
  }

  const webpageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${dict.not_found.title} ${dict.not_found.highlight}`,
    "description": dict.not_found.desc,
    "url": `https://www.splashdeals.rs/404`
  };

  return (
    <>
      <JsonLd id="not-found-schema" data={webpageSchema} />
      
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 py-32 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.03, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-[15rem] sm:text-[30rem] font-black text-white leading-none tracking-tighter"
          >
            404
          </motion.span>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-24 w-24 rounded-3xl bg-cyan-500/10 flex items-center justify-center mb-10 ring-1 ring-white/10 shadow-2xl shadow-cyan-500/5 backdrop-blur-sm"
          >
            <Icon name="location_off" className="text-[40px] text-cyan-400" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-black italic uppercase tracking-tighter mb-8 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent"
          >
            {dict.not_found.title} <span className="text-cyan-400">{dict.not_found.highlight}</span>?
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-slate-400 font-medium leading-relaxed mb-4 max-w-lg"
          >
            {dict.not_found.desc}
          </motion.p>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-sm text-slate-500 mb-14"
          >
            {dict.not_found.sublabel}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 items-center"
          >
            <LiquidButton className="px-10 py-5 min-w-[220px]">
              <Link href="/" className="flex items-center justify-center gap-2 w-full h-full">
                <Icon name="arrow_back" className="text-[16px]" />
                {dict.not_found.back_home}
              </Link>
            </LiquidButton>
            
            <Link 
              href={`/`}
              className="text-xs font-black uppercase tracking-[.25em] text-slate-500 hover:text-white transition-colors py-4 px-8 flex items-center gap-2 group"
            >
              <Icon name="waves" className="text-[16px] group-hover:animate-pulse text-cyan-500" />
              {dict.not_found.browse_parks}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
