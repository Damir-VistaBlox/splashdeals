import { requireAdmin } from "@/app/(server)/lib/auth-guards";
import { PostsListClient } from "./_components/posts-list-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import type { Metadata } from "next";
import { connection } from "next/server";
import { loadCmsPosts, type PostsListFilter } from "@/app/(dashboard)/admin/cms/_data/cms-loaders";

export const metadata: Metadata = {
  title: "Blog objave | CMS | Splashdeals",
};

function resolveFilter(params: { stale?: string; status?: string }): PostsListFilter {
  if (params.status === "review") return "review";
  if (params.status === "scheduled") return "scheduled";
  if (params.stale === "true") return "stale";
  return "all";
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ stale?: string; status?: string }>;
}) {
  await requireAdmin();
  await connection();

  const params = await searchParams;
  const filter = resolveFilter(params);
  const posts = await loadCmsPosts(filter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Blog objave</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Upravljaj blog postovima, SEO meta podacima i kategorijama.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/cms/posts/new">
            <Icon name="add" className="size-4" />
            Nova objava
          </Link>
        </Button>
      </div>

      <PostsListClient
        posts={posts}
        isStaleFilter={filter === "stale"}
        isReviewFilter={filter === "review"}
        isScheduledFilter={filter === "scheduled"}
      />
    </div>
  );
}
