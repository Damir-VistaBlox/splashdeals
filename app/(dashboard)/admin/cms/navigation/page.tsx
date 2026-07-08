import { prisma } from "@/server/lib/prisma";
import { requireAdmin } from "@/server/lib/auth-guards";
import { NavigationManager } from "./_components/NavigationManager";

export const metadata = {
  title: "Navigacija | CMS | Splashdeals",
};

export default async function NavigationPage() {
  await requireAdmin();

  const menus = await prisma.navigationMenu.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      sections: {
        orderBy: [{ column: "asc" }, { sortOrder: "asc" }],
        include: {
          items: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });

    const serializedMenus = menus.map(m => ({
    ...m,
    createdAt: m.createdAt instanceof Date ? m.createdAt.toISOString() : m.createdAt,
    updatedAt: m.updatedAt instanceof Date ? m.updatedAt.toISOString() : m.updatedAt,
  }));
  return <NavigationManager initialMenus={serializedMenus as unknown as Array<Record<string, unknown>>} />;
}
