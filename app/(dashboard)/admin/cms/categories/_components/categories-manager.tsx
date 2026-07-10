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
import { Badge } from "@/components/ui/badge";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/app/(server)/actions/cms";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  displayOrder: number;
  _count?: { posts: number };
}

export function CategoriesManager({ categories }: { categories: Array<Record<string, unknown>> }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#3b82f6");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  const handleCreate = useCallback(() => {
    if (!newName.trim()) return;
    const slug = slugify(newName, { lower: true, strict: true });
    startTransition(async () => {
      const result = await createCategoryAction({
        name: newName.trim(),
        slug,
        description: "",
        color: newColor,
        displayOrder: 0,
      });
      if (result.success) {
        toast.success("Kategorija kreirana");
        setNewName("");
        router.refresh();
      } else {
        toast.error(result.error || "Greška");
      }
    });
  }, [newName, newColor, router, startTransition]);

  const handleUpdate = useCallback(
    (id: string) => {
      if (!editName.trim()) return;
      const slug = slugify(editName, { lower: true, strict: true });
      startTransition(async () => {
        const result = await updateCategoryAction(id, {
          name: editName.trim(),
          slug,
          description: "",
          color: editColor,
          displayOrder: 0,
        });
        if (result.success) {
          toast.success("Kategorija ažurirana");
          setEditingId(null);
          router.refresh();
        } else {
          toast.error(result.error || "Greška");
        }
      });
    },
    [editName, editColor, router, startTransition],
  );

  const handleDelete = useCallback(
    (id: string, name: string) => {
      if (!confirm(`Da li ste sigurni da želite da obrišete kategoriju "${name}"?`)) return;
      startTransition(async () => {
        const result = await deleteCategoryAction(id);
        if (result.success) {
          toast.success("Kategorija obrisana");
          router.refresh();
        } else {
          toast.error(result.error || "Greška");
        }
      });
    },
    [router, startTransition],
  );

  const startEditing = useCallback((cat: CategoryRow) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditColor(cat.color || "#3b82f6");
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kategorije</h1>
        <p className="text-muted-foreground mt-1 text-sm">Organizuj blog objave po kategorijama.</p>
      </div>

      {/* Nova kategorija */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-3 text-sm font-semibold">Nova kategorija</h3>
        <div className="flex items-end gap-3">
          <div className="flex-1 space-y-1.5">
            <label className="text-muted-foreground text-xs">Naziv</label>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Naziv kategorije"
              className="h-9"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-muted-foreground text-xs">Boja</label>
            <Input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              aria-label="Boja kategorije"
              className="h-9 w-12 cursor-pointer rounded-md border bg-transparent p-1"
            />
          </div>
          <Button onClick={handleCreate} disabled={isPending || !newName.trim()} className="h-9">
            <Icon name="add" className="mr-1 size-4" />
            Dodaj
          </Button>
        </div>
      </div>

      {/* Lista kategorija */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Naziv</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Objave</TableHead>
              <TableHead className="w-[120px]">Akcije</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(categories as unknown as CategoryRow[]).length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-muted-foreground h-24 text-center text-sm">
                  Nema kategorija. Kreiraj prvu kategoriju.
                </TableCell>
              </TableRow>
            ) : (
              (categories as unknown as CategoryRow[]).map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    {editingId === cat.id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8 w-48"
                          onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id)}
                        />
                        <Input
                          type="color"
                          value={editColor}
                          onChange={(e) => setEditColor(e.target.value)}
                          aria-label="Izmeni boju kategorije"
                          className="h-8 w-10 cursor-pointer rounded border bg-transparent p-0.5"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block size-3 shrink-0 rounded-full"
                          style={{ backgroundColor: cat.color || "#3b82f6" }}
                        />
                        <span className="text-sm font-medium">{cat.name}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <code className="text-muted-foreground text-xs">{cat.slug}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {cat._count?.posts || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {editingId === cat.id ? (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => handleUpdate(cat.id)}
                            disabled={isPending}
                          >
                            Sačuvaj
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7"
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
                            className="h-7 w-7 p-0"
                            aria-label={`Izmeni kategoriju ${cat.name}`}
                            onClick={() => startEditing(cat)}
                          >
                            <Icon name="edit" className="size-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive h-7 w-7 p-0"
                            aria-label={`Obriši kategoriju ${cat.name}`}
                            onClick={() => handleDelete(cat.id, cat.name)}
                          >
                            <Icon name="delete" className="size-3.5" />
                          </Button>
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
