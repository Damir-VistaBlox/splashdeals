import { Icon } from "@/components/ui/Icon";
import Image from "next/image";
interface PartnerBrandingProps {
  logoUrl: string | null;
  name: string;
}

/**
 * 🛡️ PartnerBranding Module
 * High-fidelity glassmorphic branding seal to showcase verified status.
 */
export function PartnerBranding({ logoUrl, name }: PartnerBrandingProps) {
  if (!logoUrl) return null;

  return (
    <div className="glass-frost border-border bg-muted/24 hover:border-primary/20 hover:bg-muted/42 group rounded-[2.25rem] border p-6 transition-[border-color,background-color,transform] duration-500">
      <div className="text-primary mb-4 flex items-center gap-1.5 text-[9px] font-black tracking-[0.22em] uppercase">
        <Icon name="verified" className="fill-primary/20 text-[14px]" /> Zvanični partner
      </div>
      <div className="flex items-center gap-5">
        <div className="border-border bg-background/50 relative flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-3xl border p-2.5 shadow-2xl backdrop-blur-md transition-transform duration-500 group-hover:scale-105">
          <Image src={logoUrl} alt={`${name} Logo`} fill className="object-contain p-3" />
        </div>
        <div>
          <h4 className="text-foreground max-w-[180px] text-lg leading-tight font-black tracking-tight uppercase">
            {name}
          </h4>
          <p className="text-muted-foreground mt-2 max-w-[210px] text-sm leading-relaxed font-medium">
            Proveren partner na Splashdeals platformi sa aktivnim digitalnim ponudama.
          </p>
        </div>
      </div>
      <div className="bg-border/40 mt-5 h-px w-full" />
      <div className="text-muted-foreground mt-4 flex items-center justify-between text-[10px] font-black tracking-[0.14em] uppercase">
        <span>Platformska dostupnost</span>
        <span className="text-primary">Aktivno</span>
      </div>
    </div>
  );
}
