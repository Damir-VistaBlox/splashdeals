import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getFacilityAdminShell } from "../_lib/get-facility-admin";
import { getTicketHierarchy } from "./_lib/ticket-admin-actions";
import { TicketManagementV2 } from "./_components/ticket-management-v2";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "facility-id": string }>;
}): Promise<Metadata> {
  const { "facility-id": facilityId } = await params;
  const facility = await getFacilityAdminShell(facilityId);
  return {
    title: `${facility?.name || "Objekat"} — Ulaznice | Splashdeals Admin`,
    description: `Kategorije, tipovi i cene za ${facility?.name || "ovaj objekat"}.`,
  };
}

export default async function TicketsPageV2({
  params,
}: {
  params: Promise<{ "facility-id": string }>;
}) {
  const { "facility-id": facilityId } = await params;
  await connection();

  const facility = await getFacilityAdminShell(facilityId);
  if (!facility) return notFound();

  const hierarchy = await getTicketHierarchy(facilityId);
  const productCount = hierarchy.reduce((sum, category) => sum + category.products.length, 0);
  const priceCount = hierarchy.reduce(
    (sum, category) =>
      sum +
      category.products.reduce((productSum, product) => productSum + product.prices.length, 0),
    0,
  );

  return (
    <div className="animate-in fade-in slide-in-from-right-4 flex h-full flex-col gap-6 duration-500">
      <div className="border-border/60 bg-card/95 relative overflow-hidden rounded-[30px] border px-6 py-5 shadow-sm backdrop-blur-md">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(20,184,166,0.14),transparent_60%)] lg:block" />
        <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-black tracking-[0.22em] uppercase">
              <span className="size-2 rounded-full bg-teal-500" />
              Prodajni katalog
            </div>
            <h1 className="text-foreground mt-2 text-2xl font-black tracking-tight uppercase">
              Upravljanje ulaznicama
            </h1>
            <p className="text-muted-foreground mt-1 text-sm leading-6">
              {facility.name} — kategorije, tipovi i cenovni nivoi za javnu prodaju i operativno
              upravljanje ponudom.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[460px]">
            <div className="border-border/60 bg-background/75 rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                Kategorije
              </div>
              <div className="text-foreground mt-1 text-2xl font-black">{hierarchy.length}</div>
            </div>
            <div className="border-border/60 bg-background/75 rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                Tipovi
              </div>
              <div className="text-foreground mt-1 text-2xl font-black">{productCount}</div>
            </div>
            <div className="border-border/60 bg-background/75 rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                Cene
              </div>
              <div className="text-foreground mt-1 text-2xl font-black">{priceCount}</div>
            </div>
          </div>
        </div>
      </div>

      <TicketManagementV2 facilityId={facilityId} initialCategories={hierarchy} />
    </div>
  );
}
