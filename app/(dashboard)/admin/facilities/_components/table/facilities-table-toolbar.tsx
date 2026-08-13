"use client";

import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import type { Table } from "@tanstack/react-table";

interface FacilitiesTableToolbarProps<TData> {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  totalCount: number;
  density: "comfortable" | "compact";
  onToggleDensity: () => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  table: Table<TData>;
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
}

const COLUMN_LABELS: Record<string, string> = {
  name: "Naziv",
  category: "Kategorija",
  city: "Lokacija",
  status: "Status",
  createdAt: "Kreirano",
};

export function FacilitiesTableToolbar<TData>({
  search,
  onSearchChange,
  status,
  onStatusChange,
  totalCount,
  density,
  onToggleDensity,
  pageSize,
  onPageSizeChange,
  table,
  hasActiveFilters,
  onResetFilters,
}: FacilitiesTableToolbarProps<TData>) {
  return (
    <div className="bg-card/95 border-border/60 flex flex-col items-stretch justify-between gap-4 rounded-[28px] border p-3 shadow-sm backdrop-blur-md">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
            Radni pogled registra
          </div>
          <div className="text-foreground mt-1 text-sm font-black uppercase">
            Pretraga, statusi i prikaz kolona
          </div>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 px-1 text-[10px] font-bold tracking-[0.16em] uppercase">
          <Icon name="tune" className="text-primary text-[14px]" />
          Operativni prikaz registra
        </div>
      </div>

      <div className="flex flex-1 flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Icon
            name="search"
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-[14px]"
          />
          <Input
            placeholder="Pretraži naziv, grad ili slug..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Pretraži objekte"
            className="bg-background/40 border-border/50 focus-visible:ring-primary/30 placeholder:text-muted-foreground h-10 rounded-2xl pl-9 text-xs font-semibold focus-visible:ring-1"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={status || "all"} onValueChange={onStatusChange}>
            <SelectTrigger
              className="bg-background/40 border-border/50 hover:bg-background/60 h-10 w-[160px] rounded-2xl text-[10px] font-black tracking-wider uppercase transition-colors"
              aria-label="Filter statusa"
            >
              <SelectValue placeholder="Status objekta" />
            </SelectTrigger>
            <SelectContent className="bg-muted border-border">
              <SelectItem value="all">Svi statusi</SelectItem>
              <SelectItem value="ACTIVE">Aktivni</SelectItem>
              <SelectItem value="DRAFT">Nacrti</SelectItem>
              <SelectItem value="CLOSED">Zatvoreni</SelectItem>
              <SelectItem value="EMERGENCY_SHUTDOWN">Vanredno</SelectItem>
            </SelectContent>
          </Select>

          <Badge
            variant="outline"
            className="bg-primary/10 border-primary/20 text-primary h-10 rounded-full px-3 text-[9px] font-black"
            title="Broj rezultata"
          >
            {totalCount} objekata
          </Badge>

          <Select value={String(pageSize)} onValueChange={(v) => onPageSizeChange(Number(v))}>
            <SelectTrigger
              className="bg-background/40 border-border/50 h-10 w-[100px] rounded-2xl text-[10px] font-black tracking-wider uppercase"
              aria-label="Broj po stranici"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-muted border-border">
              <SelectItem value="15">15 / str</SelectItem>
              <SelectItem value="25">25 / str</SelectItem>
              <SelectItem value="50">50 / str</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-full px-3 text-[10px] font-bold uppercase"
              >
                Kolone
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Prikaz kolona</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {COLUMN_LABELS[column.id] || column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && onResetFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-10 rounded-full px-3 text-[10px] font-bold uppercase"
              onClick={onResetFilters}
            >
              Očisti filtere
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 h-10 w-10 shrink-0 rounded-full"
            onClick={onToggleDensity}
            title={density === "comfortable" ? "Kompaktan prikaz" : "Udoban prikaz"}
            aria-label={density === "comfortable" ? "Kompaktan prikaz" : "Udoban prikaz"}
          >
            {density === "comfortable" ? (
              <Icon name="table_rows" className="text-[16px]" />
            ) : (
              <Icon name="menu" className="text-[16px]" />
            )}
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-10 rounded-full px-3 text-[10px] font-bold uppercase"
          >
            <Link href="/admin/facilities/cities">Gradovi</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
