export type PostRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  category?: { id: string; name: string; slug: string; color: string | null } | null;
  createdAt: string;
  updatedAt: string;
  reviewedAt: string | null;
  publishedAt: string | null;
  isFeatured: boolean;
  readingTime: number | null;
  isStale: boolean;
  isScheduled?: boolean;
  _count?: { tags: number };
};
