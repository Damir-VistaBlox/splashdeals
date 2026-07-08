"use client";

import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: EmptyStateAction;
  compact?: boolean;
}

/**
 * Shared empty / no-results placeholder used by TicketPanel and GroupPanel.
 */
export function EmptyState({ icon, title, description, action, compact }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        compact ? "px-4 py-12" : "h-[360px]"
      } animate-in zoom-in-95 text-center duration-500`}
    >
      <div
        className={`${compact ? "p-4" : "p-6"} bg-primary/5 border-primary/10 mb-4 rounded-2xl border`}
      >
        <Icon
          name={icon}
          className={`${compact ? "text-[32px]" : "text-[48px]"} text-primary/60`}
        />
      </div>
      <p
        className={`${compact ? "text-xs" : "text-xl"} text-foreground mb-1 font-black tracking-tighter uppercase italic`}
      >
        {title}
      </p>
      <p className="text-muted-foreground mx-auto mb-6 max-w-sm text-xs leading-relaxed font-medium tracking-widest uppercase">
        {description}
      </p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 rounded-xl px-6 text-xs font-black tracking-widest uppercase"
        >
          <Icon name="add" className="mr-2 text-[14px]" />
          {action.label}
        </Button>
      )}
    </div>
  );
}
