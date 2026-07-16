"use client";

import { useCallback, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Icon } from "@/components/ui/Icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { createCampaignAction, updateCampaignAction } from "@/app/(server)/actions/campaigns";

export type CampaignFormData = {
  id: string;
  name: string;
  code: string;
  discountPercent: number;
  minPurchaseAmount: number | null;
  validFrom: string;
  validTo: string;
  usageLimit: number | null;
  usedCount: number;
  isActive: boolean;
  facilityIds: string[];
};

type FacilityRow = { id: string; name: string };

type Props =
  | { mode: "create"; facilities: FacilityRow[] }
  | { mode: "edit"; campaign: CampaignFormData; facilities: FacilityRow[] };

export function CampaignForm(props: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEdit = props.mode === "edit";
  const campaign = isEdit ? props.campaign : null;
  const facilities = props.facilities;

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const formData = new FormData(form);
      const facilityIds = facilities
        .filter((f) => formData.get(`facility_${f.id}`) === "on")
        .map((f) => f.id);

      const payload = {
        name: formData.get("name") as string,
        code: formData.get("code") as string,
        discountPercent: Number(formData.get("discountPercent")),
        minPurchaseAmount: formData.get("minPurchaseAmount")
          ? Number(formData.get("minPurchaseAmount"))
          : null,
        validFrom: formData.get("validFrom") as string,
        validTo: formData.get("validTo") as string,
        usageLimit: formData.get("usageLimit") ? Number(formData.get("usageLimit")) : null,
        facilityIds,
      };

      startTransition(async () => {
        const result = isEdit
          ? await updateCampaignAction(campaign!.id, payload)
          : await createCampaignAction(payload);

        if (result.success) {
          toast.success(isEdit ? "Kampanja ažurirana" : "Kampanja kreirana");
          if (isEdit) router.refresh();
          else router.push("/admin/cms/campaigns");
        } else {
          toast.error(result.error || "Greška pri čuvanju");
        }
      });
    },
    [facilities, isEdit, campaign, router],
  );

  const handleToggleActive = useCallback(() => {
    if (!isEdit || !campaign) return;
    startTransition(async () => {
      const result = await updateCampaignAction(campaign.id, {
        name: campaign.name,
        code: campaign.code,
        discountPercent: campaign.discountPercent,
        validFrom: campaign.validFrom,
        validTo: campaign.validTo,
        facilityIds: campaign.facilityIds,
        isActive: !campaign.isActive,
      });
      if (result.success) {
        toast.success(campaign.isActive ? "Kampanja deaktivirana" : "Kampanja aktivirana");
        router.refresh();
      } else {
        toast.error(result.error || "Greška");
      }
    });
  }, [isEdit, campaign, router]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {isEdit ? "Izmeni kampanju" : "Nova kampanja"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {isEdit ? "Izmeni detalje kampanje." : "Kreiraj novu promo kampanju sa popustom."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEdit ? (
            <Button variant="outline" onClick={handleToggleActive} disabled={isPending}>
              {campaign!.isActive ? "Deaktiviraj" : "Aktiviraj"}
            </Button>
          ) : null}
          <Button variant="outline" asChild>
            <Link href="/admin/cms/campaigns">
              <Icon name="arrow_back" className="size-4" />
              Nazad
            </Link>
          </Button>
        </div>
      </div>

      {isEdit ? (
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">Status:</span>
          <Badge
            variant="outline"
            className={
              campaign!.isActive
                ? "border-primary/30 bg-primary/5 text-primary"
                : "text-muted-foreground"
            }
          >
            {campaign!.isActive ? "Aktivna" : "Neaktivna"}
          </Badge>
          <span className="text-muted-foreground ml-4 text-xs">
            Korišćeno: {campaign!.usedCount}
            {campaign!.usageLimit !== null ? ` / ${campaign!.usageLimit}` : ""}
          </span>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 rounded-lg border p-6">
          <h3 className="text-sm font-semibold">Osnovne informacije</h3>
          <div className="space-y-1.5">
            <Label htmlFor="name">Naziv kampanje</Label>
            <Input
              id="name"
              name="name"
              defaultValue={campaign?.name ?? ""}
              placeholder="npr. Letnji popust 2026"
              required
              className="max-w-md"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="code">Kod</Label>
            <Input
              id="code"
              name="code"
              defaultValue={campaign?.code ?? ""}
              placeholder="npr. LETO20"
              required
              className="max-w-sm font-mono uppercase"
            />
          </div>
          <div className="grid max-w-lg grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="discountPercent">Popust (%)</Label>
              <Input
                id="discountPercent"
                name="discountPercent"
                type="number"
                min={1}
                max={100}
                defaultValue={campaign?.discountPercent ?? ""}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="minPurchaseAmount">Minimalni iznos (RSD)</Label>
              <Input
                id="minPurchaseAmount"
                name="minPurchaseAmount"
                type="number"
                min={0}
                defaultValue={campaign?.minPurchaseAmount ?? ""}
                placeholder="0 = bez minimuma"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-6">
          <h3 className="text-sm font-semibold">Period važenja</h3>
          <div className="grid max-w-lg grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="validFrom">Važi od</Label>
              <Input
                id="validFrom"
                name="validFrom"
                type="date"
                defaultValue={campaign?.validFrom ?? ""}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="validTo">Važi do</Label>
              <Input
                id="validTo"
                name="validTo"
                type="date"
                defaultValue={campaign?.validTo ?? ""}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="usageLimit">Ograničenje korišćenja</Label>
            <Input
              id="usageLimit"
              name="usageLimit"
              type="number"
              min={0}
              defaultValue={campaign?.usageLimit ?? ""}
              placeholder="Ostavi prazno za neograničeno"
              className="max-w-sm"
            />
          </div>
        </div>

        <div className="space-y-4 rounded-lg border p-6">
          <h3 className="text-sm font-semibold">Ograničenja na objekte</h3>
          <p className="text-muted-foreground text-xs">
            Izaberite objekte na kojima kod važi. Ako ne izaberete nijedan, kod važi na svim
            objektima.
          </p>
          {facilities.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nema dostupnih objekata.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {facilities.map((facility) => (
                <Label
                  key={facility.id}
                  className="has-[:checked]:border-primary has-[:checked]:bg-primary/5 flex cursor-pointer items-start gap-3 rounded-md border p-3"
                >
                  <Checkbox
                    name={`facility_${facility.id}`}
                    value="on"
                    defaultChecked={campaign?.facilityIds.includes(facility.id)}
                  />
                  <span className="text-sm font-medium">{facility.name}</span>
                </Label>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            <Icon name={isEdit ? "save" : "add"} className="mr-1 size-4" />
            {isEdit ? "Sačuvaj izmene" : "Kreiraj kampanju"}
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/cms/campaigns">Odustani</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
