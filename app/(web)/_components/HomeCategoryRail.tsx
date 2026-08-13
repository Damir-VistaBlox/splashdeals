import Link from "next/link";
import { CATEGORIES, type CategorySlug } from "@/lib/routing/categories";

const HOME_CATEGORIES: CategorySlug[] = ["akva-parkovi", "banje", "bazeni", "wellness-i-spa"];

export function HomeCategoryRail({ ariaLabel }: { ariaLabel?: string }) {
  return (
    <nav aria-label={ariaLabel || "Kategorije"} className="w-full max-w-4xl">
      <ul className="no-scrollbar flex items-center justify-start gap-2 overflow-x-auto px-1 sm:flex-wrap sm:justify-center sm:overflow-visible">
        {HOME_CATEGORIES.map((slug) => (
          <li key={slug} className="shrink-0">
            <Link
              href={`/${slug}`}
              className="bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground inline-flex h-11 min-h-11 items-center justify-center rounded-full px-4 text-[11px] font-black tracking-[0.1em] uppercase shadow-[0_10px_24px_rgba(231,179,75,0.16)] transition-all duration-150 hover:-translate-y-0.5 sm:px-5 sm:text-[10px]"
            >
              {CATEGORIES[slug].name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
