import { Icon } from "@/components/ui/Icon";

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
      <Icon name="error" className="mt-0.5 shrink-0 text-[16px] text-red-400" />
      <p className="text-[11px] leading-relaxed font-bold text-red-400">{message}</p>
    </div>
  );
}
