import { cn } from "@/lib/utils";

interface IconProps {
  /** Material Symbols icon name (snake_case, e.g. "search", "shopping_bag") */
  name: string;
  /** Additional classes — use text-[Npx] for size, text-color-* for color */
  className?: string;
  /** Fill level: 0 = outlined, 1 = filled */
  fill?: 0 | 1;
  /** Font weight axis: 100–700 */
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  /** Grade axis for fine weight adjustment */
  grade?: -50 | 0 | 200;
  /** Optical size in px — matches icon display size */
  opsz?: 20 | 24 | 40 | 48;
  /** Aria label for non-decorative icons */
  label?: string;
}

/**
 * 🎨 Material Symbol Icon
 *
 * Google Material Symbols via CDN variable font.
 * Size: control with `text-[Npx]` className (e.g. text-[16px], text-[24px])
 * Color: control with `text-color-*` className (e.g. text-cyan-400)
 * Fill: use `fill={1}` for filled variant
 *
 * @example
 * <Icon name="search" className="text-[20px] text-cyan-400" />
 * <Icon name="favorite" fill={1} className="text-[24px] text-red-400" />
 */
export function Icon({
  name,
  className,
  fill = 0,
  weight = 400,
  grade = 0,
  opsz = 24,
  label,
}: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      style={{
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opsz}`,
      }}
      aria-hidden={label ? undefined : "true"}
      aria-label={label}
      role={label ? "img" : undefined}
    >
      {name}
    </span>
  );
}
