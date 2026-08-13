"use client";

import { useCallback, useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import slugify from "slugify";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { manageCitiesAction } from "@/app/(server)/actions/cities";

interface CityRow {
  id: string;
  name: string;
  slug: string;
}

export function CitiesManager({ cities }: { cities: CityRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // New city form
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSlug, setEditSlug] = useState("");

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<CityRow | null>(null);
  const usedInitials = cities.filter((city) => city.slug.trim().length > 0).length;

  const handleCreate = useCallback(() => {
    if (!newName.trim() || !newSlug.trim()) return;
    startTransition(async () => {
      const result = await manageCitiesAction([{ name: newName.trim(), slug: newSlug.trim() }]);
      if (result.success) {
        toast.success("Grad kreiran");
        setNewName("");
        setNewSlug("");
        router.refresh();
      } else {
        toast.error(result.error || "Greška pri kreiranju grada");
      }
    });
  }, [newName, newSlug, router, startTransition]);

  const autoSlugNew = useCallback(
    (name: string) => {
      setNewName(name);
      if (!newSlug || newSlug === slugify(newName, { lower: true, strict: true })) {
        setNewSlug(slugify(name, { lower: true, strict: true }));
      }
    },
    [newSlug, newName],
  );

  const handleUpdate = useCallback(
    (id: string) => {
      if (!editName.trim() || !editSlug.trim()) return;
      startTransition(async () => {
        const result = await manageCitiesAction([
          { id, name: editName.trim(), slug: editSlug.trim() },
        ]);
        if (result.success) {
          toast.success("Grad ažuriran");
          setEditingId(null);
          router.refresh();
        } else {
          toast.error(result.error || "Greška pri ažuriranju grada");
        }
      });
    },
    [editName, editSlug, router, startTransition],
  );

  const handleDelete = useCallback(
    (city: CityRow) => {
      startTransition(async () => {
        const result = await manageCitiesAction([
          { id: city.id, name: city.name, slug: city.slug, isDeleted: true },
        ]);
        if (result.success) {
          toast.success(`Grad "${city.name}" obrisan`);
          setDeleteTarget(null);
          router.refresh();
        } else {
          toast.error(result.error || "Greška pri brisanju grada");
        }
      });
    },
    [router, startTransition],
  );

  const startEditing = useCallback((city: CityRow) => {
    setEditingId(city.id);
    setEditName(city.name);
    setEditSlug(city.slug);
  }, []);

  return (
    <div className="space-y-6">
      <section className="border-border/60 bg-card/95 relative overflow-hidden rounded-[30px] border p-5 shadow-sm md:p-6">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.14),transparent_60%)] lg:block" />
        <div className="relative z-10 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-3">
            <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-black tracking-[0.22em] uppercase">
              <span className="size-2 rounded-full bg-sky-500" />
              Lokacije i pretraga
            </div>
            <div>
              <h1 className="text-foreground text-3xl font-black tracking-tight uppercase">
                Gradovi
              </h1>
              <p className="text-muted-foreground mt-1 max-w-2xl text-sm leading-6">
                Upravljajte gradovima koji se koriste za objekte, filtere i pretragu kako bi
                lokacijski podaci ostali čisti i dosledni kroz ceo katalog.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="border-border/60 bg-background/75 rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                Ukupno gradova
              </div>
              <div className="text-foreground mt-1 text-2xl font-black">{cities.length}</div>
            </div>
            <div className="border-border/60 bg-background/75 rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                Aktivni slugovi
              </div>
              <div className="text-foreground mt-1 text-2xl font-black">{usedInitials}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dodaj grad */}
      <div className="border-border/60 bg-card/95 rounded-[30px] border p-5 shadow-sm md:p-6">
        <div className="mb-4">
          <h3 className="text-foreground text-lg font-black uppercase">Dodaj grad</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Kreirajte novi grad koji će biti dostupan pri unosu i filtriranju objekata.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div className="space-y-1.5">
            <label className="text-muted-foreground text-[10px] font-black tracking-[0.18em] uppercase">
              Ime grada
            </label>
            <Input
              value={newName}
              onChange={(e) => autoSlugNew(e.target.value)}
              placeholder="Naziv grada"
              className="h-11 rounded-2xl"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-muted-foreground text-[10px] font-black tracking-[0.18em] uppercase">
              Slug
            </label>
            <Input
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="slug-grada"
              className="h-11 rounded-2xl"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
          <Button
            onClick={handleCreate}
            disabled={isPending || !newName.trim() || !newSlug.trim()}
            className="h-11 rounded-2xl px-5 text-[11px] font-black tracking-[0.18em] uppercase"
          >
            <Icon name="add" className="mr-1 size-4" />
            Dodaj
          </Button>
        </div>
      </div>

      {/* Lista gradova */}
      <div className="border-border/60 bg-card/95 overflow-hidden rounded-[30px] border shadow-sm">
        <Table>
          <TableHeader className="bg-muted/10">
            <TableRow>
              <TableHead className="px-5 py-4 text-[10px] font-black tracking-[0.18em] uppercase">
                Ime
              </TableHead>
              <TableHead className="py-4 text-[10px] font-black tracking-[0.18em] uppercase">
                Slug
              </TableHead>
              <TableHead className="w-[160px] py-4 text-[10px] font-black tracking-[0.18em] uppercase">
                Akcije
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-muted-foreground h-24 text-center text-sm">
                  Nema gradova.
                </TableCell>
              </TableRow>
            ) : (
              cities.map((city) => (
                <TableRow key={city.id} className="hover:bg-muted/10 transition-colors">
                  <TableCell className="px-5 py-4">
                    {editingId === city.id ? (
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="h-9 w-48 rounded-xl"
                      />
                    ) : (
                      <span className="text-sm font-bold">{city.name}</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    {editingId === city.id ? (
                      <Input
                        value={editSlug}
                        onChange={(e) => setEditSlug(e.target.value)}
                        className="h-9 w-48 rounded-xl"
                        onKeyDown={(e) => e.key === "Enter" && handleUpdate(city.id)}
                      />
                    ) : (
                      <code className="text-primary bg-muted/30 rounded border px-2 py-1 text-xs">
                        {city.slug}
                      </code>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1">
                      {editingId === city.id ? (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            className="h-8 rounded-full px-3 text-xs"
                            onClick={() => handleUpdate(city.id)}
                            disabled={isPending}
                          >
                            Sačuvaj
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 rounded-full px-3"
                            onClick={() => setEditingId(null)}
                          >
                            Odustani
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 rounded-full p-0"
                            aria-label={`Izmeni grad ${city.name}`}
                            onClick={() => startEditing(city)}
                          >
                            <Icon name="edit" className="size-3.5" />
                          </Button>
                          <AlertDialog
                            open={deleteTarget?.id === city.id}
                            onOpenChange={(open) => {
                              if (!open) setDeleteTarget(null);
                            }}
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive h-8 w-8 rounded-full p-0"
                                aria-label={`Obriši grad ${city.name}`}
                                onClick={() => setDeleteTarget(city)}
                              >
                                <Icon name="delete" className="size-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Obriši grad</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Da li ste sigurni da želite da obrišete grad &quot;{city.name}
                                  &quot;? Ova radnja je nepovratna.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Odustani</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => handleDelete(city)}
                                  disabled={isPending}
                                >
                                  {isPending ? "Brisanje..." : "Obriši"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
