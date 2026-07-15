"use client";

import { Icon } from "@/components/ui/Icon";
import * as React from "react";
import {
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Row,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { bulkUpdateFacilityStatusAction } from "@/app/(server)/actions/facilities";
import { FacilityStatus } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FacilitiesTableToolbar } from "./facilities-table-toolbar";
import { FacilitiesBulkBar } from "./facilities-bulk-bar";
import { FacilitiesTablePagination } from "./facilities-table-pagination";
import { createFacilityColumns } from "../columns";
import type { FacilityListSortKey } from "@/lib/admin/facilities-list-params";
import type { Facility } from "@prisma/client";

interface DataTableProps {
  data: Facility[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  initialQ?: string;
  initialStatus?: string;
  initialSort?: FacilityListSortKey;
  initialOrder?: "asc" | "desc";
}

const VISIBILITY_KEY = "facilities-column-visibility";

function readVisibility(): VisibilityState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(VISIBILITY_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as VisibilityState;
  } catch {
    return {};
  }
}

export function DataTable({
  data,
  totalCount,
  currentPage,
  pageSize,
  initialQ,
  initialStatus = "all",
  initialSort = "createdAt",
  initialOrder = "desc",
}: DataTableProps) {
  const router = useRouter();
  const initialSearch = initialQ ?? "";

  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [focusRowIndex, setFocusRowIndex] = React.useState(0);
  const [isPending, startTransition] = React.useTransition();
  // Hydration-safe density: always start compact on SSR, apply localStorage after mount (H2)
  const [density, setDensity] = React.useState<"comfortable" | "compact">("compact");
  const [globalFilter, setGlobalFilter] = React.useState(initialSearch);
  const [statusFilter, setStatusFilter] = React.useState(initialStatus || "all");
  const previousSearchRef = React.useRef(initialSearch);
  const previousStatusRef = React.useRef(initialStatus || "all");

  React.useEffect(() => {
    const saved = window.localStorage.getItem("table-density");
    if (saved === "comfortable" || saved === "compact") setDensity(saved);
    setColumnVisibility(readVisibility());
  }, []);

  React.useEffect(() => {
    setGlobalFilter(initialSearch);
    previousSearchRef.current = initialSearch;
  }, [initialSearch]);

  React.useEffect(() => {
    setStatusFilter(initialStatus || "all");
    previousStatusRef.current = initialStatus || "all";
  }, [initialStatus]);

  React.useEffect(() => {
    setRowSelection({});
    setFocusRowIndex(0);
  }, [currentPage, pageSize, initialSearch, initialStatus, initialSort, initialOrder, data]);

  React.useEffect(() => {
    if (globalFilter === previousSearchRef.current) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (globalFilter) params.set("q", globalFilter);
      else params.delete("q");
      params.set("page", "1");
      previousSearchRef.current = globalFilter;
      router.push(`?${params.toString()}`, { scroll: false });
    }, 400);
    return () => clearTimeout(timer);
  }, [globalFilter, router]);

  const handleSort = React.useCallback(
    (columnId: FacilityListSortKey) => {
      const params = new URLSearchParams(window.location.search);
      const nextOrder: "asc" | "desc" =
        initialSort === columnId && initialOrder === "asc" ? "desc" : "asc";
      params.set("sort", columnId);
      params.set("order", nextOrder);
      params.set("page", "1");
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [initialSort, initialOrder, router],
  );

  const columns = React.useMemo(
    () => createFacilityColumns(initialSort, initialOrder, handleSort),
    [initialSort, initialOrder, handleSort],
  );

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    if (value === previousStatusRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (value && value !== "all") params.set("status", value);
    else params.delete("status");
    params.set("page", "1");
    previousStatusRef.current = value;
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Preserve page size (and optional sort) when clearing filters (M9)
  const handleResetFilters = () => {
    setGlobalFilter("");
    setStatusFilter("all");
    previousSearchRef.current = "";
    previousStatusRef.current = "all";
    const params = new URLSearchParams();
    if (pageSize !== 15) params.set("limit", String(pageSize));
    const qs = params.toString();
    router.push(qs ? `?${qs}` : "?", { scroll: false });
  };

  const toggleDensity = () => {
    const next = density === "comfortable" ? "compact" : "comfortable";
    setDensity(next);
    localStorage.setItem("table-density", next);
  };

  const onColumnVisibilityChange = (
    updater: VisibilityState | ((old: VisibilityState) => VisibilityState),
  ) => {
    setColumnVisibility((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      try {
        localStorage.setItem(VISIBILITY_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  // TanStack Table returns unstable function identities — React Compiler skip (documented M7)
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
    onColumnVisibilityChange,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    state: { columnVisibility, rowSelection },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const selectedIds = selectedRows.map((row: Row<Facility>) => row.original.id);

  const handleBulkStatusUpdate = (status: FacilityStatus) => {
    if (!selectedIds.length) {
      toast.error("Nije izabran nijedan objekat");
      return;
    }
    startTransition(async () => {
      const result = await bulkUpdateFacilityStatusAction(selectedIds, status);
      if (result.success) {
        setRowSelection({});
        toast.success("Status uspešno ažuriran");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  const handleRowClick = (row: Row<Facility>) => {
    router.push(`/admin/facilities/${row.original.id}`);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize) || 1);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handlePageSizeChange = (size: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("limit", String(size));
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const rows = table.getRowModel().rows;

  const handleTableKeyDown = (e: React.KeyboardEvent) => {
    if (!rows.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusRowIndex((i) => Math.min(i + 1, rows.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusRowIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const row = rows[focusRowIndex];
      if (row) handleRowClick(row);
    } else if (e.key === " ") {
      e.preventDefault();
      const row = rows[focusRowIndex];
      if (row) row.toggleSelected(!row.getIsSelected());
    }
  };

  const hasActiveFilters = Boolean(globalFilter) || Boolean(statusFilter && statusFilter !== "all");

  return (
    <div className="space-y-4">
      <FacilitiesTableToolbar
        search={globalFilter ?? ""}
        onSearchChange={setGlobalFilter}
        status={statusFilter}
        onStatusChange={handleStatusChange}
        totalCount={totalCount}
        density={density}
        onToggleDensity={toggleDensity}
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
        table={table}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      <FacilitiesBulkBar
        selectedCount={selectedIds.length}
        isPending={isPending}
        onConfirm={handleBulkStatusUpdate}
        onClear={() => setRowSelection({})}
      />

      <div
        className="border-border/50 bg-muted/40 max-h-[min(70vh,720px)] overflow-auto rounded-2xl border shadow-2xl backdrop-blur-md"
        tabIndex={0}
        role="grid"
        aria-label="Registar objekata"
        aria-rowcount={totalCount}
        onKeyDown={handleTableKeyDown}
      >
        <Table>
          <TableHeader className="bg-muted/80 sticky top-0 z-20 backdrop-blur-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} role="row">
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta as
                    { ariaSort?: "ascending" | "descending" | "none" } | undefined;
                  return (
                    <TableHead
                      key={header.id}
                      role="columnheader"
                      aria-sort={meta?.ariaSort ?? "none"}
                      className={cn(
                        "bg-muted/80 px-3",
                        density === "compact" ? "h-8 py-1 text-[10px]" : "h-10 py-2 text-[11px]",
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row, idx) => (
                <TableRow
                  key={row.id}
                  role="row"
                  aria-rowindex={(currentPage - 1) * pageSize + idx + 1}
                  aria-selected={row.getIsSelected()}
                  tabIndex={idx === focusRowIndex ? 0 : -1}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "hover:bg-muted/40 focus-visible:ring-primary/40 cursor-pointer focus-visible:ring-1 focus-visible:outline-none",
                    idx === focusRowIndex && "bg-primary/5 ring-primary/30 ring-1",
                  )}
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest("button, a, input, [role='checkbox'], [role='menuitem']"))
                      return;
                    setFocusRowIndex(idx);
                    handleRowClick(row);
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      role="gridcell"
                      className={cn(
                        "px-3",
                        density === "compact" ? "py-1.5 text-xs" : "py-3 text-sm",
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="text-muted-foreground flex flex-col items-center gap-2 py-8">
                    <Icon name="search_off" className="text-[28px] opacity-40" />
                    <p className="text-xs font-bold tracking-wide uppercase">
                      Nema pronađenih objekata
                    </p>
                    <p className="text-[10px]">Podesite pretragu ili filter statusa.</p>
                    {hasActiveFilters ? (
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        onClick={handleResetFilters}
                        className="text-primary h-auto p-0 text-[10px] font-bold tracking-wide uppercase"
                      >
                        Resetuj filtere
                      </Button>
                    ) : (
                      <Button asChild variant="outline" size="sm" className="mt-1 h-8 text-[10px]">
                        <Link href="/admin/facilities/new">Novi objekat</Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <FacilitiesTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export type FacilitiesDataTableRow = Facility;
