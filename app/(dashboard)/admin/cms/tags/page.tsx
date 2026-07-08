import { requireAdmin } from "@/server/lib/auth-guards";
import { prisma } from "@/server/lib/prisma";
import { TagsManager } from "./_components/tags-manager";
import type { Metadata } from "next";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Tagovi | CMS | Splashdeals",
};

export default async function TagsPage() {
  await requireAdmin();
  await connection();

  const tags = await prisma.blogTag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  return <TagsManager tags={tags as unknown as Array<Record<string, unknown>>} />;
}
