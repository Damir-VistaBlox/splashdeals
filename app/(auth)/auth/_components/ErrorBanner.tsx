import { Icon } from "@/components/ui/Icon";

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
      <Icon name="error" className="text-[16px] text-red-400 mt-0.5 shrink-0" />
      <p className="text-[11px] text-red-400 font-bold leading-relaxed">{message}</p>
    </div>
  );
}
