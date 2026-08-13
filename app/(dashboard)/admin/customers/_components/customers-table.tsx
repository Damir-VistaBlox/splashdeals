"use client";

import { Icon } from "@/components/ui/Icon";
import { startTransition, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCustomersAction } from "@/app/(server)/actions/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Customer {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
  transactionCount: number;
  activeTicketsCount: number;
}

interface CustomersTableProps {
  page?: string;
  limit?: string;
  search?: string;
}

export function CustomersTable({ page, limit, search: initialSearch }: CustomersTableProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(initialSearch || "");
  const router = useRouter();

  const currentPage = Number(page) || 1;
  const pageSize = Number(limit) || 15;
  const totalPages = Math.ceil(totalCount / pageSize);
  const customersWithTickets = customers.filter(
    (customer) => customer.activeTicketsCount > 0,
  ).length;
  const customersWithTransactions = customers.filter(
    (customer) => customer.transactionCount > 0,
  ).length;

  const fetchCustomers = useCallback(
    async (p: number, s: string) => {
      startTransition(() => {
        setLoading(true);
      });

      try {
        const result = await getCustomersAction({
          page: p,
          limit: pageSize,
          search: s || undefined,
        });
        if (result.success) {
          const successResult = result as {
            success: true;
            data: Customer[];
            totalCount: number;
          };
          startTransition(() => {
            setCustomers(successResult.data);
            setTotalCount(successResult.totalCount);
          });
        } else {
          toast.error("Učitavanje kupaca nije uspelo");
        }
      } catch {
        toast.error("Učitavanje kupaca nije uspelo");
      } finally {
        startTransition(() => {
          setLoading(false);
        });
      }
    },
    [pageSize],
  );

  useEffect(() => {
    fetchCustomers(currentPage, initialSearch || "");
  }, [currentPage, initialSearch, fetchCustomers]);

  const handleSearch = () => {
    const params = new URLSearchParams(window.location.search);
    if (searchInput.trim()) {
      params.set("search", searchInput.trim());
    } else {
      params.delete("search");
    }
    params.delete("page");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="bg-card/95 border-border/60 flex flex-col items-stretch justify-between gap-3 rounded-[28px] border p-3 shadow-sm lg:flex-row lg:items-center">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1">
            <Icon
              name="search"
              className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 text-[16px]"
            />
            <Input
              placeholder="Pretraži po imenu ili email-u..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-background/40 border-border/50 h-9 pl-9 text-xs"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSearch}
            className="bg-background/40 border-border/50 h-9 shrink-0 text-xs font-black tracking-widest uppercase"
          >
            <Icon name="filter_list" className="mr-1.5 text-[14px]" />
            Filtriraj
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border-border/60 bg-card/95 overflow-hidden rounded-[28px] border shadow-sm backdrop-blur-sm">
        <div className="border-border/50 bg-background/70 grid gap-3 border-b px-5 py-4 md:grid-cols-3">
          <div>
            <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
              Operativni pregled
            </div>
            <div className="text-foreground mt-1 text-sm font-black uppercase">Baza kupaca</div>
            <div className="text-muted-foreground mt-1 text-xs">
              Brz pregled naloga, aktivnosti kupovine i aktivnih karata po trenutnoj stranici.
            </div>
          </div>
          <div className="border-border/50 bg-muted/20 rounded-2xl border px-4 py-3">
            <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
              Sa aktivnim kartama
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-foreground text-xl font-black">{customersWithTickets}</span>
              <span className="text-[10px] font-black tracking-[0.18em] text-emerald-500 uppercase">
                Aktivno
              </span>
            </div>
          </div>
          <div className="border-border/50 bg-muted/20 rounded-2xl border px-4 py-3">
            <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
              Sa transakcijama
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-foreground text-xl font-black">
                {customersWithTransactions}
              </span>
              <span className="text-primary text-[10px] font-black tracking-[0.18em] uppercase">
                U prometu
              </span>
            </div>
          </div>
        </div>
        <Table>
          <TableHeader className="bg-muted/10">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground px-6 py-4 text-[10px] font-black tracking-widest uppercase">
                Kupac
              </TableHead>
              <TableHead className="text-muted-foreground py-4 text-[10px] font-black tracking-widest uppercase">
                Email
              </TableHead>
              <TableHead className="text-muted-foreground py-4 text-[10px] font-black tracking-widest uppercase">
                Datum registracije
              </TableHead>
              <TableHead className="text-muted-foreground py-4 text-[10px] font-black tracking-widest uppercase">
                Transakcije
              </TableHead>
              <TableHead className="text-muted-foreground py-4 text-[10px] font-black tracking-widest uppercase">
                Aktivne karte
              </TableHead>
              <TableHead className="text-muted-foreground px-6 py-4 text-right text-[10px] font-black tracking-widest uppercase">
                Akcije
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex items-center justify-center gap-2 opacity-50">
                    <Icon name="hourglass_empty" className="text-muted-foreground/80 text-[20px]" />
                    <span className="text-xs font-black tracking-widest uppercase">
                      Učitavanje...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <Icon name="people_outline" className="text-muted-foreground/80 text-[32px]" />
                    <span className="text-xs font-black tracking-widest uppercase">
                      Nema kupaca
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow
                  key={customer.id}
                  className="hover:bg-muted/10 border-border/50 transition-colors"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="border-border text-foreground relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border bg-gradient-to-br from-slate-800 to-slate-900 text-xs font-bold">
                        {customer.image ? (
                          <Image
                            src={customer.image}
                            alt={customer.name || "Kupac"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          customer.name?.[0] || customer.email[0].toUpperCase()
                        )}
                      </div>
                      <span className="text-foreground text-sm font-bold tracking-tight">
                        {customer.name || "Bez imena"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground font-mono text-[10px] lowercase">
                      {customer.email}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground font-mono text-[10px]">
                      {new Date(customer.createdAt).toLocaleDateString("sr-RS")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-foreground text-xs font-bold">
                      {customer.transactionCount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-xs font-bold ${
                        customer.activeTicketsCount > 0
                          ? "text-emerald-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      {customer.activeTicketsCount}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="hover:bg-muted/30 h-8 rounded-full px-3 text-[10px] font-black tracking-widest uppercase"
                    >
                      <Link href={`/admin/customers/${customer.id}`}>
                        <Icon name="visibility" className="mr-1 text-[14px]" />
                        Detalji
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
          Strana {currentPage} od {totalPages || 1} • {totalCount} kupaca ukupno
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/40 border-border/50 h-9 w-9 rounded-full p-0"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Prethodna strana kupaca"
          >
            <Icon name="keyboard_arrow_left" className="text-[16px]" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-background/40 border-border/50 h-9 w-9 rounded-full p-0"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Sledeća strana kupaca"
          >
            <Icon name="keyboard_arrow_right" className="text-[16px]" />
          </Button>
        </div>
      </div>
    </div>
  );
}
