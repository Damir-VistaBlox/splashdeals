import React from "react";

export const GlobalAmbient = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden">
      <div className="bg-background absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-[42vh] bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.16),transparent_58%)]" />
      <div className="animate-kinetic-1 bg-primary/12 absolute top-[-16%] left-[-10%] h-[42rem] w-[42rem] rounded-full blur-[150px]" />
      <div className="animate-kinetic-2 absolute right-[-10%] bottom-[-6%] h-[34rem] w-[34rem] rounded-full bg-amber-300/18 blur-[130px]" />
      <div className="animate-drift absolute top-[18%] right-[18%] h-48 w-48 rounded-full bg-sky-100/40 blur-[80px]" />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-25 mix-blend-soft-light brightness-110 contrast-125" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent_22%,transparent_78%,rgba(255,255,255,0.2))]" />
    </div>
  );
};
