"use client";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onToggle: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function PasswordInput({
  id,
  value,
  onChange,
  showPassword,
  onToggle,
  placeholder,
  disabled,
}: PasswordInputProps) {
  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
        className="h-12 rounded-xl border-white/10 bg-white/5 pr-10 transition-all focus-visible:ring-cyan-500/50"
      />
      <Button
        type="button"
        onClick={onToggle}
        className="absolute top-1/2 right-1 -translate-y-1/2 text-slate-600 hover:text-slate-400"
        tabIndex={-1}
        size="icon"
        variant="ghost"
      >
        {showPassword ? (
          <Icon name="visibility_off" className="text-[16px]" />
        ) : (
          <Icon name="visibility" className="text-[16px]" />
        )}
      </Button>
    </div>
  );
}
