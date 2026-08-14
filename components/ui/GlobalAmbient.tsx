import React from "react";

export const GlobalAmbient = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
      <div className="bg-background absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-[32vh] bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.12),transparent_62%)] md:h-[42vh] md:bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.16),transparent_58%)]" />
      <div className="bg-primary/10 md:animate-kinetic-1 absolute top-[-12%] left-[-16%] h-[22rem] w-[22rem] rounded-full blur-[90px] md:top-[-16%] md:left-[-10%] md:h-[42rem] md:w-[42rem] md:blur-[150px]" />
      <div className="md:animate-kinetic-2 absolute right-[-12%] bottom-[-4%] hidden h-[18rem] w-[18rem] rounded-full bg-amber-300/16 blur-[88px] sm:block md:right-[-10%] md:bottom-[-6%] md:h-[34rem] md:w-[34rem] md:blur-[130px]" />
      <div className="md:animate-drift absolute top-[16%] right-[14%] hidden h-32 w-32 rounded-full bg-sky-100/28 blur-[64px] md:block md:h-48 md:w-48 md:bg-sky-100/40 md:blur-[80px]" />
      <div className="absolute inset-0 hidden bg-[url('/noise.svg')] opacity-25 mix-blend-soft-light brightness-110 contrast-125 md:block" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent_22%,transparent_78%,rgba(255,255,255,0.2))]" />
    </div>
  );
};
