// Local type definitions (Prisma multi-schema doesn't re-export new model types)
// Mirrors the Prisma models at prisma/schema.prisma

export interface NavigationMenu {
  id: string;
  label: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NavigationMenuSection {
  id: string;
  menuId: string;
  heading: string | null;
  column: number;
  style: string;
  config: unknown | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NavigationMenuItem {
  id: string;
  sectionId: string;
  label: string;
  href: string | null;
  icon: string | null;
  desc: string | null;
  metadata: unknown | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type MenuWithSections = NavigationMenu & {
  sections: SectionWithItems[];
};

export type SectionWithItems = NavigationMenuSection & {
  items: NavigationMenuItem[];
};

export type LinkMetadata = {
  badge?: {
    type: "new" | "sale" | "popular" | "soon" | "custom";
    text?: string;
  };
  price?: string;
  variant?: "default" | "featured" | "cta";
  imageUrl?: string;
  count?: number;
  accentColor?: string;
  external?: boolean;
};
