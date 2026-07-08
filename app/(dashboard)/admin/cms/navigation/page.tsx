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

  return <NavigationManager initialMenus={JSON.parse(JSON.stringify(menus))} />;
}
