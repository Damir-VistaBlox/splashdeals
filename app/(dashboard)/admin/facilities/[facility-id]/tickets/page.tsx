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

  return (
    <div className="animate-in fade-in slide-in-from-right-4 flex h-full flex-col gap-6 duration-500">
      <div className="border-border/50 bg-background/60 flex shrink-0 items-center justify-between rounded-2xl border px-6 py-5 backdrop-blur-md">
        <div>
          <h1 className="text-foreground text-2xl font-black tracking-tight">
            Upravljanje ulaznicama
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {facility.name} — kategorije, tipovi i cenovni nivoi za javnu prodaju
          </p>
        </div>
        <div className="border-primary/20 bg-primary/10 rounded-full border px-4 py-1.5">
          <span className="text-primary text-[10px] font-black tracking-widest uppercase">
            Prodajni katalog
          </span>
        </div>
      </div>

      <TicketManagementV2 facilityId={facilityId} initialCategories={hierarchy} />
    </div>
  );
}
