"use client";
import { Icon } from "@/components/ui/Icon";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      // Sit above mobile BottomNav (~64px + safe area) so ATC success is visible (#667).
      position="bottom-center"
      offset="calc(5.25rem + env(safe-area-inset-bottom, 0px))"
      mobileOffset="calc(5.25rem + env(safe-area-inset-bottom, 0px))"
      icons={{
        success: <Icon name="check_circle" className="size-4" />,
        info: <Icon name="info" className="size-4" />,
        warning: <Icon name="warning" className="size-4" />,
        error: <Icon name="cancel" className="size-4" />,
        loading: <Icon name="progress_activity" className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
