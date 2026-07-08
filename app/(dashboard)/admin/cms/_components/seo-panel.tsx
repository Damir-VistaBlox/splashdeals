"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useFormContext } from "react-hook-form";

interface SEOPanelProps {
  previewUrl?: string;
}

export function SEOPanel({ previewUrl }: SEOPanelProps) {
  const { register, watch } = useFormContext();
  const title = watch("title");
  const metaTitle = watch("metaTitle");
  const metaDescription = watch("metaDescription");

  const serpTitle = metaTitle || title || "—";
  const serpDesc = metaDescription || "Dodaj meta opis za prikaz u pretrazi...";

  return (
    <div className="space-y-6">
      {/* SERP Preview */}
      <div>
        <h4 className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
          Google SERP Preview
        </h4>
        <div className="bg-card space-y-1 rounded-lg border p-3">
          <p className="truncate text-xs text-green-700 dark:text-green-400">
            {previewUrl || "splashdeals.rs/blog/..."}
          </p>
          <p className="truncate text-sm leading-tight font-medium text-blue-600 dark:text-blue-400">
            {serpTitle.length > 60 ? serpTitle.slice(0, 57) + "..." : serpTitle}
          </p>
          <p className="text-muted-foreground line-clamp-2 text-xs leading-tight">
            {serpDesc.length > 160 ? serpDesc.slice(0, 157) + "..." : serpDesc}
          </p>
        </div>
      </div>

      <Separator />

      {/* Meta naslov */}
      <div className="space-y-2">
        <Label htmlFor="metaTitle">Meta naslov</Label>
        <Input
          id="metaTitle"
          {...register("metaTitle")}
          placeholder={title ? `${title} | Splashdeals.rs` : "SEO naslov..."}
        />
        <p className="text-muted-foreground text-xs">
          Preporučeno: do 60 karaktera.{" "}
          <span className={metaTitle?.length > 60 ? "text-destructive font-medium" : ""}>
            ({metaTitle?.length || 0})
          </span>
        </p>
      </div>

      {/* Meta opis */}
      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta opis</Label>
        <Textarea
          id="metaDescription"
          {...register("metaDescription")}
          placeholder="Kratak opis za prikaz u Google rezultatima..."
          className="min-h-[80px] resize-none"
        />
        <p className="text-muted-foreground text-xs">
          Preporučeno: 150-160 karaktera.{" "}
          <span className={metaDescription?.length > 160 ? "text-destructive font-medium" : ""}>
            ({metaDescription?.length || 0})
          </span>
        </p>
      </div>

      <Separator />

      {/* Open Graph */}
      <div className="space-y-3">
        <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Open Graph (društvene mreže)
        </h4>

        <div className="space-y-2">
          <Label htmlFor="ogTitle">OG naslov</Label>
          <Input
            id="ogTitle"
            {...register("ogTitle")}
            placeholder={metaTitle || `${title} | Splashdeals.rs`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ogDescription">OG opis</Label>
          <Textarea
            id="ogDescription"
            {...register("ogDescription")}
            placeholder={metaDescription || "Opis za Facebook, LinkedIn..."}
            className="min-h-[60px] resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ogImage">OG slika (URL)</Label>
          <Input id="ogImage" {...register("ogImage")} placeholder="https://..." />
        </div>
      </div>

      <Separator />

      {/* Napredno */}
      <div className="space-y-3">
        <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Napredno
        </h4>

        <div className="space-y-2">
          <Label htmlFor="canonicalUrl">Canonical URL</Label>
          <Input
            id="canonicalUrl"
            {...register("canonicalUrl")}
            placeholder="https://splashdeals.rs/blog/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="robotsDirective">Robots direktiva</Label>
          <select
            id="robotsDirective"
            {...register("robotsDirective")}
            className="border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
          >
            <option value="">Podrazumevano (index, follow)</option>
            <option value="noindex,nofollow">noindex, nofollow</option>
            <option value="noindex,follow">noindex, follow</option>
            <option value="index,nofollow">index, nofollow</option>
          </select>
        </div>
      </div>
    </div>
  );
}
