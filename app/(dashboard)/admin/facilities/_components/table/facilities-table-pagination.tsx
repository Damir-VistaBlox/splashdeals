"use client";

import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";

interface FacilitiesTablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

/** Compact page window for desktop: first … neighbors … last */
function pageItems(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const items: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) items.push("ellipsis");
  for (let p = start; p <= end; p++) items.push(p);
  if (end < total - 1) items.push("ellipsis");
  items.push(total);
  return items;
}

export function FacilitiesTablePagination({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
}: FacilitiesTablePaginationProps) {
  const pages = pageItems(currentPage, totalPages || 1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
        {currentPage} / {totalPages || 1} • {totalCount} ukupno
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="bg-background/40 border-border/50 h-8 w-8 p-0"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Prethodna strana"
        >
          <Icon name="keyboard_arrow_left" className="text-[16px]" />
        </Button>
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span
              key={`e-${i}`}
              className="text-muted-foreground px-1 text-[10px] font-bold"
              aria-hidden
            >
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === currentPage ? "default" : "outline"}
              size="sm"
              className="bg-background/40 border-border/50 h-8 min-w-8 px-2 text-[10px] font-bold"
              onClick={() => onPageChange(p)}
              aria-label={`Strana ${p}`}
              aria-current={p === currentPage ? "page" : undefined}
            >
              {p}
            </Button>
          ),
        )}
        <Button
          variant="outline"
          size="sm"
          className="bg-background/40 border-border/50 h-8 w-8 p-0"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Sledeća strana"
        >
          <Icon name="keyboard_arrow_right" className="text-[16px]" />
        </Button>
      </div>
    </div>
  );
}
