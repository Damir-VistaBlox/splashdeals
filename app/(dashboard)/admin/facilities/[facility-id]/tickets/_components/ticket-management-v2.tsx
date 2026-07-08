"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import type { SerializedCategory } from "../_lib/ticket-admin-actions";

interface Props {
  facilityId: string;
  initialCategories: SerializedCategory[];
}

const DAY_LABELS: Record<string, string> = {
  ALL: "Svi dani",
  WEEKDAY: "Radni dan",
  WEEKEND: "Vikend",
};

const TIME_LABELS: Record<string, string> = {
  FULL_DAY: "Ceo dan",
  AFTER_16H: "Posle 16h",
  THREE_HOUR: "3 sata",
};

export function TicketManagementV2({ facilityId, initialCategories }: Props) {
  const [categories, setCategories] = React.useState(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState<string | null>(
    initialCategories[0]?.id ?? null,
  );
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);
  const [mobileView, setMobileView] = React.useState<"cats" | "prods" | "prices">("cats");
  const [newCatTitle, setNewCatTitle] = React.useState("");
  const [newProdTitle, setNewProdTitle] = React.useState("");
  const [showNewCat, setShowNewCat] = React.useState(false);
  const [showNewProd, setShowNewProd] = React.useState(false);
  const [editingCatId, setEditingCatId] = React.useState<string | null>(null);
  const [editCatTitle, setEditCatTitle] = React.useState("");
  const [editingProductId, setEditingProductId] = React.useState<string | null>(null);
  const [editProductTitle, setEditProductTitle] = React.useState("");
  const [_draggedProductId, setDraggedProductId] = React.useState<string | null>(null);

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) ?? null;
  const selectedProduct =
    selectedCategory?.products.find((p) => p.id === selectedProductId) ?? null;

  const handleAddCategory = async () => {
    if (!newCatTitle.trim()) return;
    const { createCategory } = await import("../_lib/ticket-admin-actions");
    const cat = await createCategory(facilityId, newCatTitle);
    setCategories((prev) => [
      ...prev,
      {
        id: cat.id,
        title: cat.title,
        slug: cat.slug,
        displayOrder: cat.displayOrder,
        isActive: cat.isActive,
        products: [],
      },
    ]);
    setNewCatTitle("");
    setShowNewCat(false);
    setSelectedCategoryId(cat.id);
  };

  const handleAddProduct = async () => {
    if (!selectedCategoryId || !newProdTitle.trim()) return;
    const { createProduct } = await import("../_lib/ticket-admin-actions");
    const prod = await createProduct(selectedCategoryId, { title: newProdTitle });
    setCategories((prev) =>
      prev.map((c) =>
        c.id === selectedCategoryId
          ? {
              ...c,
              products: [
                ...c.products,
                {
                  id: prod.id,
                  categoryId: prod.categoryId,
                  title: prod.title,
                  label: prod.label,
                  requiresIdentity: prod.requiresIdentity,
                  requiresPhoto: prod.requiresPhoto,
                  minPeople: prod.minPeople,
                  maxPeople: prod.maxPeople,
                  isSeasonPass: prod.isSeasonPass,
                  validityType: prod.validityType,
                  displayOrder: prod.displayOrder,
                  isActive: prod.isActive,
                  imageUrl: prod.imageUrl ?? null,
                  prices: [],
                },
              ],
            }
          : c,
      ),
    );
    setNewProdTitle("");
    setShowNewProd(false);
    setSelectedProductId(prod.id);
  };

  const handleDeleteCategory = async (id: string) => {
    const { deleteCategory } = await import("../_lib/ticket-admin-actions");
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (selectedCategoryId === id) {
      setSelectedCategoryId(null);
      setSelectedProductId(null);
    }
  };

  const handleStartEditCategory = (cat: SerializedCategory) => {
    setEditingCatId(cat.id);
    setEditCatTitle(cat.title);
  };

  const handleSaveCategory = async () => {
    if (!editingCatId || !editCatTitle.trim()) return;
    const { updateCategory } = await import("../_lib/ticket-admin-actions");
    await updateCategory(editingCatId, { title: editCatTitle.trim() });
    setCategories((prev) =>
      prev.map((c) => (c.id === editingCatId ? { ...c, title: editCatTitle.trim() } : c)),
    );
    setEditingCatId(null);
    setEditCatTitle("");
  };

  const handleCancelEditCategory = () => {
    setEditingCatId(null);
    setEditCatTitle("");
  };

  const handleStartEditProduct = (prod: { id: string; title: string }) => {
    setEditingProductId(prod.id);
    setEditProductTitle(prod.title);
  };

  const handleSaveProduct = async () => {
    if (!editingProductId || !editProductTitle.trim()) return;
    const { updateProduct } = await import("../_lib/ticket-admin-actions");
    await updateProduct(editingProductId, { title: editProductTitle.trim() });
    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        products: c.products.map((p) =>
          p.id === editingProductId ? { ...p, title: editProductTitle.trim() } : p,
        ),
      })),
    );
    setEditingProductId(null);
    setEditProductTitle("");
  };

  const handleCancelEditProduct = () => {
    setEditingProductId(null);
    setEditProductTitle("");
  };

  const handleMoveProduct = async (productId: string, fromCatId: string, toCatId: string) => {
    if (fromCatId === toCatId) return;
    const { updateProduct } = await import("../_lib/ticket-admin-actions");
    await updateProduct(productId, { categoryId: toCatId });
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === fromCatId)
          return { ...c, products: c.products.filter((p) => p.id !== productId) };
        if (c.id === toCatId) {
          const product = prev
            .find((x) => x.id === fromCatId)
            ?.products.find((p) => p.id === productId);
          if (!product) return c;
          return { ...c, products: [...c.products, { ...product, categoryId: toCatId }] };
        }
        return c;
      }),
    );
  };

  const handleDeleteProduct = async (id: string) => {
    const { deleteProduct } = await import("../_lib/ticket-admin-actions");
    await deleteProduct(id);
    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        products: c.products.filter((p) => p.id !== id),
      })),
    );
    if (selectedProductId === id) setSelectedProductId(null);
  };

  const handleAddPrice = async (productId: string) => {
    const { createPrice } = await import("../_lib/ticket-admin-actions");
    await createPrice(productId, { price: 0 });
    // Refresh categories to get the new price
    const { getTicketHierarchy } = await import("../_lib/ticket-admin-actions");
    const fresh = await getTicketHierarchy(facilityId);
    setCategories(fresh);
  };

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* ─── Category Panel ─────────────────────────── */}
      <div
        className={cn(
          "lg:border-border/50 lg:flex lg:w-56 lg:shrink-0 lg:flex-col lg:border-r",
          mobileView === "cats" ? "flex flex-1 flex-col" : "hidden",
        )}
      >
        <div className="border-border/50 border-b p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
              Kategorije
            </span>
            <button
              onClick={() => setShowNewCat(!showNewCat)}
              className="bg-primary/10 text-primary hover:bg-primary/20 flex h-6 w-6 items-center justify-center rounded-lg transition-all"
            >
              <Icon name="add" className="text-[14px]" />
            </button>
          </div>
          {showNewCat && (
            <div className="flex gap-1">
              <input
                value={newCatTitle}
                onChange={(e) => setNewCatTitle(e.target.value)}
                placeholder="Naziv kategorije..."
                className="bg-muted/30 border-border text-foreground focus:border-primary/40 h-8 flex-1 rounded-lg border px-2 text-xs outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              />
              <Button size="sm" className="h-8 px-2 text-[10px]" onClick={handleAddCategory}>
                +
              </Button>
            </div>
          )}
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto p-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategoryId(cat.id);
                setMobileView("prods");
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = "hsl(var(--primary))";
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = "";
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = "";
                const prodId = e.dataTransfer.getData("text/product-id");
                if (prodId) {
                  const fromCat = categories.find((c) => c.products.some((p) => p.id === prodId));
                  if (fromCat) handleMoveProduct(prodId, fromCat.id, cat.id);
                }
                setDraggedProductId(null);
              }}
              className={cn(
                "group flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-bold transition-all",
                selectedCategoryId === cat.id
                  ? "bg-primary/10 text-primary border-primary/20 border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/20 border border-transparent",
              )}
            >
              {editingCatId === cat.id ? (
                <input
                  value={editCatTitle}
                  onChange={(e) => setEditCatTitle(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") handleSaveCategory();
                    if (e.key === "Escape") handleCancelEditCategory();
                  }}
                  onBlur={handleSaveCategory}
                  className="bg-background border-primary/40 text-foreground h-6 flex-1 rounded border px-1.5 text-xs font-bold outline-none"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="flex-1 text-left">📁 {cat.title}</span>
              )}
              <div className="flex items-center gap-0.5 opacity-0 transition-all group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartEditCategory(cat);
                  }}
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10 flex h-5 w-5 items-center justify-center rounded transition-all"
                >
                  <Icon name="edit" className="text-[10px]" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(cat.id);
                  }}
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex h-5 w-5 items-center justify-center rounded transition-all"
                >
                  <Icon name="close" className="text-[10px]" />
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Product Panel ──────────────────────────── */}
      <div
        className={cn(
          "lg:border-border/50 lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-r",
          mobileView === "prods" ? "flex flex-1 flex-col" : "hidden",
        )}
      >
        <div className="border-border/50 border-b p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
              {selectedCategory ? `${selectedCategory.title} → Tipovi` : "Tipovi"}
            </span>
            {selectedCategory && (
              <button
                onClick={() => setShowNewProd(!showNewProd)}
                className="bg-primary/10 text-primary hover:bg-primary/20 flex h-6 w-6 items-center justify-center rounded-lg transition-all"
              >
                <Icon name="add" className="text-[14px]" />
              </button>
            )}
          </div>
          {showNewProd && selectedCategory && (
            <div className="flex gap-1">
              <input
                value={newProdTitle}
                onChange={(e) => setNewProdTitle(e.target.value)}
                placeholder="Naziv tipa..."
                className="bg-muted/30 border-border text-foreground focus:border-primary/40 h-8 flex-1 rounded-lg border px-2 text-xs outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleAddProduct()}
              />
              <Button size="sm" className="h-8 px-2 text-[10px]" onClick={handleAddProduct}>
                +
              </Button>
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-2">
          {!selectedCategory && (
            <p className="text-muted-foreground p-3 text-center text-xs">Izaberite kategoriju</p>
          )}
          {selectedCategory?.products.map((prod) => (
            <div
              key={prod.id}
              draggable
              onDragStart={(e) => {
                setDraggedProductId(prod.id);
                e.dataTransfer.setData("text/product-id", prod.id);
                e.dataTransfer.effectAllowed = "move";
              }}
              onDragEnd={() => setDraggedProductId(null)}
              className={cn(
                "cursor-grab rounded-xl border p-3 transition-all active:cursor-grabbing",
                selectedProductId === prod.id
                  ? "bg-primary/5 border-primary/30"
                  : "bg-muted/5 border-border hover:border-primary/20",
              )}
              onClick={() => {
                setSelectedProductId(prod.id);
                setMobileView("prices");
              }}
            >
              <div className="mb-1 flex items-center justify-between">
                {editingProductId === prod.id ? (
                  <input
                    value={editProductTitle}
                    onChange={(e) => setEditProductTitle(e.target.value)}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === "Enter") handleSaveProduct();
                      if (e.key === "Escape") handleCancelEditProduct();
                    }}
                    onBlur={handleSaveProduct}
                    className="bg-background border-primary/40 text-foreground h-7 flex-1 rounded border px-1.5 text-sm font-bold outline-none"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="text-foreground text-sm font-bold">{prod.title}</span>
                )}
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartEditProduct(prod);
                    }}
                    className="text-muted-foreground hover:text-primary hover:bg-primary/10 flex h-5 w-5 items-center justify-center rounded transition-all"
                  >
                    <Icon name="edit" className="text-[10px]" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProduct(prod.id);
                    }}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex h-5 w-5 items-center justify-center rounded transition-all"
                  >
                    <Icon name="close" className="text-[10px]" />
                  </button>
                </div>
              </div>
              {prod.imageUrl && (
                <div className="-mx-1 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="border-border/50 h-24 w-full rounded-lg border object-cover"
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {prod.requiresPhoto && (
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[8px] font-bold text-amber-400">
                    📸
                  </span>
                )}
                {prod.requiresIdentity && (
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[8px] font-bold text-amber-400">
                    🆔
                  </span>
                )}
                <span className="text-muted-foreground text-[8px] font-bold">
                  min:{prod.minPeople}
                </span>
                {prod.maxPeople && (
                  <span className="text-muted-foreground text-[8px] font-bold">
                    max:{prod.maxPeople}
                  </span>
                )}
              </div>
              <div className="text-muted-foreground mt-1 text-[10px]">
                {prod.prices.length} cena/e
              </div>
            </div>
          ))}
          {selectedCategory && selectedCategory.products.length === 0 && !showNewProd && (
            <p className="text-muted-foreground p-3 text-center text-xs">
              Nema tipova. Dodajte prvi [+]
            </p>
          )}
        </div>
      </div>

      {/* ─── Price Panel ────────────────────────────── */}
      <div
        className={cn(
          "lg:flex lg:min-w-0 lg:flex-1 lg:flex-col",
          mobileView === "prices" ? "flex flex-1 flex-col" : "hidden",
        )}
      >
        <div className="border-border/50 flex items-center justify-between border-b p-3">
          <span className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
            {selectedProduct ? `${selectedProduct.title} → Cene` : "Cene"}
          </span>
          {selectedProduct && (
            <button
              onClick={() => handleAddPrice(selectedProduct.id)}
              className="bg-primary/10 text-primary hover:bg-primary/20 flex h-7 items-center gap-1 rounded-lg px-3 text-[10px] font-bold transition-all"
            >
              <Icon name="add" className="text-[12px]" /> Varijacija
            </button>
          )}
        </div>
        {selectedProduct && (
          <ProductImageSection
            productId={selectedProduct.id}
            imageUrl={selectedProduct.imageUrl}
            productTitle={selectedProduct.title}
            onImageChange={(url: string | null) => {
              setCategories((prev) =>
                prev.map((c) => ({
                  ...c,
                  products: c.products.map((p) =>
                    p.id === selectedProduct.id ? { ...p, imageUrl: url } : p,
                  ),
                })),
              );
            }}
          />
        )}
        <div className="flex-1 overflow-y-auto p-4">
          {!selectedProduct && (
            <p className="text-muted-foreground p-8 text-center text-sm">
              Izaberite kategoriju i tip da biste videli cene
            </p>
          )}
          {selectedProduct && selectedProduct.prices.length === 0 && (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center gap-3">
              <Icon name="confirmation_number" className="text-[32px] opacity-30" />
              <p className="text-sm">Nema cena za {selectedProduct.title}</p>
              <Button
                size="sm"
                variant="outline"
                className="flex items-center gap-1 text-xs"
                onClick={() => handleAddPrice(selectedProduct.id)}
              >
                <Icon name="add" className="text-[12px]" /> Dodaj prvu cenu
              </Button>
            </div>
          )}
          {selectedProduct && selectedProduct.prices.length > 0 && (
            <div className="grid gap-3">
              {selectedProduct.prices.map((price) => (
                <PriceCard
                  key={price.id}
                  price={price}
                  _product={selectedProduct}
                  facilityId={facilityId}
                  onDeleted={() => {
                    setCategories((prev) =>
                      prev.map((c) => ({
                        ...c,
                        products: c.products.map((p) =>
                          p.id === selectedProduct.id
                            ? { ...p, prices: p.prices.filter((pr) => pr.id !== price.id) }
                            : p,
                        ),
                      })),
                    );
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav dots */}
      <div className="bg-background/80 border-border/50 fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-1.5 rounded-full border px-3 py-2 shadow-lg backdrop-blur-md lg:hidden">
        {(["cats", "prods", "prices"] as const).map((v, _i) => (
          <button
            key={v}
            onClick={() => setMobileView(v)}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              mobileView === v ? "bg-primary w-6" : "bg-muted-foreground/30",
            )}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Product Image Section ──────────────────────────
function ProductImageSection({
  productId,
  imageUrl,
  productTitle,
  onImageChange,
}: {
  productId: string;
  imageUrl: string | null;
  productTitle: string;
  onImageChange: (url: string | null) => void;
}) {
  const [uploading, setUploading] = React.useState(false);
  const [renaming, setRenaming] = React.useState(false);
  const currentFileName = imageUrl
    ? (imageUrl
        .split("/")
        .pop()
        ?.replace(/\.webp$/, "") ?? "")
    : "";
  const [newName, setNewName] = React.useState(currentFileName);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { uploadProductImage } = await import("../_lib/ticket-image-actions");
      const result = await uploadProductImage(productId, formData);
      if (result.success && result.url) {
        onImageChange(result.url);
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    if (!imageUrl) return;
    const { deleteProductImage } = await import("../_lib/ticket-image-actions");
    const result = await deleteProductImage(productId, imageUrl);
    if (result.success) onImageChange(null);
  };

  const handleRename = async () => {
    if (!imageUrl || !newName.trim()) return;
    setRenaming(true);
    try {
      const { renameProductImage } = await import("../_lib/ticket-image-actions");
      const result = await renameProductImage(productId, imageUrl, newName.trim());
      if (result.success && result.url) {
        onImageChange(result.url);
        setNewName("");
      }
    } finally {
      setRenaming(false);
    }
  };

  return (
    <div className="border-border/50 space-y-2 border-b p-3">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
      />
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
          Slika
        </span>
        {!imageUrl && (
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="bg-primary/10 text-primary hover:bg-primary/20 flex h-7 items-center gap-1 rounded-lg px-3 text-[10px] font-bold transition-all disabled:opacity-50"
          >
            <Icon name="add_photo" className="text-[12px]" />
            {uploading ? "Otpremanje..." : "Dodaj sliku"}
          </button>
        )}
      </div>
      {imageUrl ? (
        <div>
          <div className="group border-border/50 relative mb-2 overflow-hidden rounded-lg border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={productTitle} className="h-32 w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="text-foreground flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition-all hover:bg-white"
              >
                <Icon name="refresh" className="text-[14px]" />
              </button>
              <button
                onClick={handleDelete}
                className="text-destructive flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition-all hover:bg-white"
              >
                <Icon name="delete" className="text-[14px]" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Novi naziv fajla..."
              className="bg-muted/30 border-border text-foreground focus:border-primary/40 h-8 flex-1 rounded-lg border px-2 text-xs outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
            />
            <Button
              size="sm"
              className="h-8 shrink-0 px-2 text-[10px]"
              onClick={handleRename}
              disabled={renaming || !newName.trim()}
            >
              {renaming ? "..." : "Preimenuj"}
            </Button>
          </div>
        </div>
      ) : uploading ? (
        <p className="text-muted-foreground text-xs">Otpremanje slike...</p>
      ) : null}
    </div>
  );
}

// ─── Price Card ─────────────────────────────────────

function PriceCard({
  price,
  _product,
  facilityId,
  onDeleted,
}: {
  price: SerializedCategory["products"][number]["prices"][number];
  _product: SerializedCategory["products"][number];
  facilityId: string;
  onDeleted: () => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState({
    label: price.label ?? "",
    price: price.price.toString(),
    originalPrice: price.originalPrice?.toString() ?? "",
    dayType: price.dayType ?? "ALL",
    timeSlot: price.timeSlot ?? "FULL_DAY",
  });

  const handleSave = async () => {
    const { updatePrice } = await import("../_lib/ticket-admin-actions");
    await updatePrice(price.id, {
      label: form.label || null,
      price: parseFloat(form.price) || 0,
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
      dayType: form.dayType,
      timeSlot: form.timeSlot,
    });
    // Reload
    const { getTicketHierarchy } = await import("../_lib/ticket-admin-actions");
    await getTicketHierarchy(facilityId);
    // Find and update
    setEditing(false);
  };

  const dayLabel = DAY_LABELS[form.dayType] ?? form.dayType;
  const timeLabel = TIME_LABELS[form.timeSlot] ?? form.timeSlot;

  return (
    <div className="border-border bg-muted/5 hover:border-primary/20 rounded-xl border p-4 transition-all">
      {editing ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
                Labela
              </label>
              <input
                value={form.label}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                className="bg-muted/20 border-border focus:border-primary/40 h-8 w-full rounded-lg border px-2 text-xs outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
                Cena (RSD)
              </label>
              <input
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                className="bg-muted/20 border-border focus:border-primary/40 h-8 w-full rounded-lg border px-2 text-xs outline-none"
                type="number"
              />
            </div>
            <div>
              <label className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
                Originalna cena
              </label>
              <input
                value={form.originalPrice}
                onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))}
                className="bg-muted/20 border-border focus:border-primary/40 h-8 w-full rounded-lg border px-2 text-xs outline-none"
                type="number"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
                Tip dana
              </label>
              <select
                value={form.dayType}
                onChange={(e) => setForm((f) => ({ ...f, dayType: e.target.value }))}
                className="bg-muted/20 border-border focus:border-primary/40 h-8 w-full rounded-lg border px-2 text-xs outline-none"
              >
                <option value="ALL">Svi dani</option>
                <option value="WEEKDAY">Radni dan</option>
                <option value="WEEKEND">Vikend</option>
              </select>
            </div>
            <div>
              <label className="text-muted-foreground text-[9px] font-bold tracking-wider uppercase">
                Termin
              </label>
              <select
                value={form.timeSlot}
                onChange={(e) => setForm((f) => ({ ...f, timeSlot: e.target.value }))}
                className="bg-muted/20 border-border focus:border-primary/40 h-8 w-full rounded-lg border px-2 text-xs outline-none"
              >
                <option value="FULL_DAY">Ceo dan</option>
                <option value="AFTER_16H">Posle 16h</option>
                <option value="THREE_HOUR">3 sata</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-[10px]"
              onClick={() => setEditing(false)}
            >
              Otkaži
            </Button>
            <Button size="sm" className="h-8 text-[10px]" onClick={handleSave}>
              Sačuvaj
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-foreground text-lg font-black">
                {price.price.toLocaleString("sr-RS")}
              </span>
              <span className="text-primary text-xs font-bold">RSD</span>
              {price.originalPrice && price.originalPrice > price.price && (
                <>
                  <span className="text-muted-foreground ml-1 text-xs line-through">
                    {price.originalPrice.toLocaleString("sr-RS")} RSD
                  </span>
                  <span className="bg-destructive/10 text-destructive rounded px-1.5 py-0.5 text-[9px] font-bold">
                    -{Math.round((1 - price.price / price.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setEditing(true)}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/20 flex h-7 w-7 items-center justify-center rounded-lg transition-all"
              >
                <Icon name="edit" className="text-[12px]" />
              </button>
              <button
                onClick={async () => {
                  const { deletePrice } = await import("../_lib/ticket-admin-actions");
                  await deletePrice(price.id);
                  onDeleted();
                }}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex h-7 w-7 items-center justify-center rounded-lg transition-all"
              >
                <Icon name="delete" className="text-[12px]" />
              </button>
            </div>
          </div>
          <div className="mt-1 flex items-center gap-2">
            {price.label && (
              <span className="text-foreground/80 text-xs font-bold">{price.label}</span>
            )}
            <span className="bg-primary/5 text-primary rounded-full px-2 py-0.5 text-[9px] font-bold">
              {dayLabel}
            </span>
            <span className="bg-primary/5 text-primary rounded-full px-2 py-0.5 text-[9px] font-bold">
              {timeLabel}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
