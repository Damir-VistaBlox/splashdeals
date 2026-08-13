"use client";
import { Icon } from "@/components/ui/Icon";

import { useState } from "react";
import { UserRole } from "@prisma/client";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateUserRoleAction, deleteUserAction } from "@/app/(server)/actions/users";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  image: string | null;
  createdAt: Date;
  emailVerified: boolean;
}

interface UsersTableProps {
  initialUsers: User[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export function UsersTable({ initialUsers, totalCount, currentPage, pageSize }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const router = useRouter();

  const handleRoleUpdate = async (userId: string, role: UserRole) => {
    const result = await updateUserRoleAction(userId, role);
    if (result.success) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
      toast.success("Korisnička uloga je uspešno ažurirana");
    } else {
      toast.error(result.error || "Ažuriranje uloge nije uspelo");
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    const result = await deleteUserAction(userToDelete);
    if (result.success) {
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete));
      toast.success("Pristup je uspešno uklonjen");
    } else {
      toast.error(result.error || "Brisanje korisnika nije uspelo");
    }
    setIsDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-4">
      <div className="border-border/50 bg-muted/50 overflow-hidden rounded-xl border backdrop-blur-sm">
        <Table>
          <TableHeader className="bg-muted/10">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-muted-foreground px-6 py-4 text-[10px] font-black tracking-widest uppercase">
                Identitet
              </TableHead>
              <TableHead className="text-muted-foreground py-4 text-[10px] font-black tracking-widest uppercase">
                Uloga
              </TableHead>
              <TableHead className="text-muted-foreground py-4 text-[10px] font-black tracking-widest uppercase">
                Status
              </TableHead>
              <TableHead className="text-muted-foreground py-4 text-[10px] font-black tracking-widest uppercase">
                Kreiran
              </TableHead>
              <TableHead className="text-muted-foreground px-6 py-4 text-right text-[10px] font-black tracking-widest uppercase">
                Akcije
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="hover:bg-muted/10 border-border/50 transition-colors"
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="border-border text-foreground relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border bg-gradient-to-br from-slate-800 to-slate-900 text-xs font-bold">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "Korisnik"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        user.name?.[0] || user.email[0].toUpperCase()
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-foreground text-sm font-bold tracking-tight">
                        {user.name || "Bez unetog imena"}
                      </span>
                      <span className="text-muted-foreground font-mono text-[10px] lowercase">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      user.role === "SUPER_ADMIN"
                        ? "bg-primary/10 text-primary border-primary/20 text-[9px] font-black tracking-widest uppercase"
                        : "border-amber-500/20 bg-amber-500/10 text-[9px] font-black tracking-widest text-amber-400 uppercase"
                    }
                  >
                    {user.role.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.emailVerified ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold tracking-tight text-emerald-400 uppercase">
                      <Icon name="check_circle" className="text-[12px]" />
                      Potvrđen
                    </div>
                  ) : (
                    <div className="text-muted-foreground flex items-center gap-1.5 text-[10px] font-bold tracking-tight uppercase">
                      <Icon name="schedule" className="text-[12px]" />
                      Na čekanju
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground font-mono text-[10px]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell className="px-6 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="hover:bg-muted/30 h-8 w-8 p-0">
                        <Icon name="more_horiz" className="text-muted-foreground text-[16px]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-background border-border text-foreground w-56"
                    >
                      <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-black tracking-widest uppercase opacity-50">
                        Upravljanje pristupom
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-muted/30" />
                      <DropdownMenuItem
                        onClick={() => handleRoleUpdate(user.id, UserRole.SUPER_ADMIN)}
                        className="focus:bg-muted/30 focus:text-primary cursor-pointer gap-2 text-xs"
                      >
                        <Icon name="shield" className="text-[14px]" />
                        Dodeli super admin ulogu
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRoleUpdate(user.id, UserRole.FACILITY_STAFF)}
                        className="focus:bg-muted/30 cursor-pointer gap-2 text-xs focus:text-amber-400"
                      >
                        <Icon name="manage_accounts" className="text-[14px]" />
                        Dodeli operatersku ulogu
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-muted/30" />
                      <DropdownMenuItem
                        onClick={() => {
                          setUserToDelete(user.id);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="cursor-pointer gap-2 text-xs text-red-400 focus:bg-red-500/10 focus:text-red-400"
                      >
                        <Icon name="delete" className="text-[14px]" />
                        Ukloni sav pristup
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <Icon name="manage_accounts" className="text-muted-foreground/80 text-[32px]" />
                    <span className="text-xs font-black tracking-widest uppercase">
                      Nema administrativnih naloga
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
          {currentPage} / {totalPages || 1} • {totalCount} administratora
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-background/40 border-border/50 h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <Icon name="keyboard_arrow_left" className="text-[16px]" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-background/40 border-border/50 h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <Icon name="keyboard_arrow_right" className="text-[16px]" />
          </Button>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-background border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight text-red-500 uppercase">
              Ukloni sav pristup
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-mono text-xs leading-relaxed">
              Da li ste sigurni da želite da uklonite sav pristup ovom korisniku? Ova radnja je
              nepovratna.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setUserToDelete(null);
              }}
              className="text-xs font-black uppercase"
            >
              Otkaži
            </Button>
            <Button
              onClick={confirmDelete}
              className="text-foreground bg-red-600 text-xs font-black uppercase hover:bg-red-700"
            >
              Ukloni pristup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
