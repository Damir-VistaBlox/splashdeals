import { prisma } from "@/app/(server)/lib/prisma";
import { FAQSectionList } from "./_components/faq-section-list";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";

import type { Metadata } from "next";

interface Props {
  params: Promise<{ "facility-id": string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { "facility-id": facilityId } = await params;
  const facility = await prisma.facility.findUnique({
    where: { id: facilityId },
    select: { name: true },
  });

  return {
    title: `${facility?.name || "Objekat"} — FAQ | Splashdeals Admin`,
    description: `Upravljanje često postavljanim pitanjima za ${facility?.name || "izabrani objekat"}.`,
  };
}

export default async function FAQPage({ params }: Props) {
  await connection();
  const { "facility-id": facilityId } = await params;

  const facility = await prisma.facility.findUnique({
    where: { id: facilityId },
    select: { id: true, name: true },
  });
  if (!facility) notFound();

  const faqs = await prisma.facilityFAQ.findMany({
    where: { facilityId },
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="animate-in fade-in slide-in-from-right-4 flex flex-col gap-8 duration-500">
      <div className="bg-muted/40 border-border/50 flex items-center justify-between rounded-2xl border p-6 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hover:bg-muted/50 h-8 w-8 rounded-lg p-0"
            >
              <Link href={`/admin/facilities/${facilityId}`}>
                <Icon name="keyboard_arrow_left" className="size-4" />
              </Link>
            </Button>
            <h1 className="text-foreground text-2xl font-black tracking-tight">FAQ sadržaj</h1>
          </div>
          <p className="text-muted-foreground ml-11 text-[10px] font-bold tracking-[0.2em] uppercase">
            Javna pitanja i odgovori za {facility.name}
          </p>
        </div>
        <div className="border-primary/20 bg-primary/10 rounded-full border px-4 py-1.5">
          <span className="text-primary text-[10px] font-black tracking-widest uppercase">
            Javni modul
          </span>
        </div>
      </div>

      <div className="border-border/50 bg-muted/20 mx-auto w-full max-w-4xl space-y-6 rounded-2xl border p-4 md:p-6">
        <p className="text-muted-foreground text-sm leading-6">
          Ova pitanja i odgovori se prikazuju na javnoj stranici objekta i treba da pokriju
          najvažnije nedoumice kupaca pre kupovine.
        </p>
        <FAQSectionList
          facilityId={facilityId}
          initialFaqs={faqs.map((f) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
            displayOrder: f.displayOrder,
          }))}
        />
      </div>
    </div>
  );
}
