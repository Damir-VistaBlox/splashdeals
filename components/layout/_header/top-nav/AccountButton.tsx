"use client";

import React from "react";
import { Icon } from "@/components/ui/Icon";
import { LiquidButton } from "@/components/ui/LiquidButton";

import type { Dict } from "@/lib/types";

interface AccountButtonProps {
  dict: Dict;
}

export function AccountButton({ dict }: AccountButtonProps) {
  return (
    <LiquidButton
      variant="ghost"
      size="sm"
      className="h-11 px-4 font-medium"
      aria-label={dict.nav.account || "Moj Nalog"}
    >
      <Icon name="person" className="text-primary text-[16px]" />
      <span className="ml-2 hidden lg:inline">{dict.nav.account || "Moj Nalog"}</span>
    </LiquidButton>
  );
}
