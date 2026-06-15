import { create } from 'zustand';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbState {
  items: BreadcrumbItem[];
  backHref?: string;
  setBreadcrumbs: (items: BreadcrumbItem[], backHref?: string) => void;
  clearBreadcrumbs: () => void;
}

export const useBreadcrumb = create<BreadcrumbState>((set) => ({
  items: [],
  backHref: undefined,
  setBreadcrumbs: (items, backHref) => set({ items, backHref }),
  clearBreadcrumbs: () => set({ items: [], backHref: undefined }),
}));
