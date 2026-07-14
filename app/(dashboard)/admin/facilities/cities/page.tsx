import { requireAdmin } from "@/app/(server)/lib/auth-guards";
import { prisma } from "@/app/(server)/lib/prisma";
import { CitiesManager } from "./_components/cities-manager";
import type { Metadata } from "next";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Gradovi | Objekti | Splashdeals",
};

export default async function CitiesPage() {
  await requireAdmin();
  await connection();

  const cities = await prisma.city.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  const serializedCities = cities.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }));

  return <CitiesManager cities={serializedCities} />;
}
