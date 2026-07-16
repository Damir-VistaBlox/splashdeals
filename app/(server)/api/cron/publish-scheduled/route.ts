import { prisma } from "@/app/(server)/lib/prisma";
import { revalidatePublicBlog, revalidateSitemap } from "@/app/(server)/lib/revalidation";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const now = new Date();
    // Find drafts with future publishedAt that are now due
    const posts = await prisma.blogPost.updateMany({
      where: {
        status: "DRAFT",
        publishedAt: { lte: now, not: null },
      },
      data: { status: "PUBLISHED" },
    });

    // Unpublish expired blog posts
    const expiredPosts = await prisma.blogPost.updateMany({
      where: { status: "PUBLISHED", expiresAt: { lte: now, not: null } },
      data: { status: "ARCHIVED" },
    });

    // Unpublish expired pages
    const expiredPages = await prisma.page.updateMany({
      where: { status: "PUBLISHED", expiresAt: { lte: now, not: null } },
      data: { status: "ARCHIVED" },
    });

    if (posts.count > 0 || expiredPosts.count > 0) {
      revalidatePublicBlog();
    } else if (expiredPages.count > 0) {
      revalidateSitemap();
    }

    return NextResponse.json({
      published: posts.count,
      unpublishedPosts: expiredPosts.count,
      unpublishedPages: expiredPages.count,
    });
  } catch (error) {
    console.error("[publish-scheduled]", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
