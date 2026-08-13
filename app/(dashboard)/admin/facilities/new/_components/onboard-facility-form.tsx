"use client";

import { Icon } from "@/components/ui/Icon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createFacilityAction } from "@/app/(server)/actions/facilities";
import { toast } from "sonner";
import { facilitySchema, type FacilityFormValues } from "@/app/(server)/lib/validations/facility";

import { IdentitySection } from "./sections/identity-section";
import { LocalizationSection } from "./sections/localization-section";
import { ConfigurationSection } from "./sections/configuration-section";

function isSuccessResponse(result: unknown): result is { success: true; id: string } {
  return (
    typeof result === "object" &&
    result !== null &&
    "success" in result &&
    (result as Record<string, unknown>).success === true &&
    typeof (result as Record<string, unknown>).id === "string"
  );
}

function hasError(result: unknown): result is { success: false; error: string } {
  return (
    typeof result === "object" &&
    result !== null &&
    "success" in result &&
    (result as Record<string, unknown>).success === false &&
    typeof (result as Record<string, unknown>).error === "string"
  );
}

export function OnboardFacilityForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSlugLocked, setIsSlugLocked] = useState(true);

  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilitySchema),
    defaultValues: {
      name: "",
      slug: "",
      category: "Akva Park",
      city: "",
      streetName: "",
      streetNumber: "",
      postalCode: "",
      status: "DRAFT",
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    form.setValue("name", newName);

    if (isSlugLocked) {
      const autoSlug = newName
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      form.setValue("slug", autoSlug, { shouldValidate: true });
    }
  };

  async function onSubmit(values: FacilityFormValues) {
    setIsSubmitting(true);
    setServerError("");

    const result = await createFacilityAction(values);

    if (isSuccessResponse(result)) {
      const { id } = result;
      toast.success("Objekat je uspešno kreiran");
      router.push(`/admin/facilities/${id}`);
    } else if (hasError(result)) {
      setServerError(result.error);
      setIsSubmitting(false);
    } else {
      setServerError("Kreiranje objekta nije uspelo.");
      setIsSubmitting(false);
    }
  }

  const currentSlug = useWatch({ control: form.control, name: "slug" });
  const currentName = useWatch({ control: form.control, name: "name" });
  const currentCity = useWatch({ control: form.control, name: "city" });
  const currentStatus = useWatch({ control: form.control, name: "status" });
  const currentCategory = useWatch({ control: form.control, name: "category" });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 space-y-6"
        aria-label="Forma za unos novog objekta"
      >
        {serverError && (
          <div className="bg-destructive/15 text-destructive border-destructive/20 animate-in fade-in slide-in-from-top-2 rounded-xl border p-4 text-sm font-medium">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.65fr_0.95fr]">
          <div className="space-y-6 lg:col-span-2">
            <IdentitySection
              isSlugLocked={isSlugLocked}
              setIsSlugLocked={setIsSlugLocked}
              onNameChange={handleNameChange}
            />

            <LocalizationSection />
          </div>

          <div className="space-y-6">
            <ConfigurationSection />

            <div className="border-border/60 bg-card/95 rounded-[28px] border p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-2xl">
                  <Icon name="preview" className="text-[18px]" />
                </div>
                <div>
                  <div className="text-foreground text-sm font-black uppercase">Pregled unosa</div>
                  <div className="text-muted-foreground text-[11px]">
                    Brza provera pre kreiranja objekta
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="border-border/50 bg-background/60 rounded-2xl border px-4 py-3">
                  <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                    Naziv
                  </div>
                  <div className="text-foreground mt-1 text-sm font-black uppercase">
                    {currentName?.trim() || "Još nije unet"}
                  </div>
                </div>

                <div className="border-border/50 bg-background/60 rounded-2xl border px-4 py-3">
                  <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                    Javna putanja
                  </div>
                  <div className="text-primary mt-1 font-mono text-[11px] break-all">
                    splashdeals.rs/{currentSlug?.trim() || "slug-objekta"}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div className="border-border/50 bg-background/60 rounded-2xl border px-4 py-3">
                    <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                      Kategorija
                    </div>
                    <div className="text-foreground mt-1 text-sm font-black uppercase">
                      {currentCategory || "Nije izabrana"}
                    </div>
                  </div>
                  <div className="border-border/50 bg-background/60 rounded-2xl border px-4 py-3">
                    <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                      Status
                    </div>
                    <div className="text-foreground mt-1 text-sm font-black uppercase">
                      {currentStatus === "ACTIVE" ? "Aktivan" : "Nacrt"}
                    </div>
                  </div>
                </div>

                <div className="border-border/50 bg-background/60 rounded-2xl border px-4 py-3">
                  <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                    Lokacija
                  </div>
                  <div className="text-foreground mt-1 text-sm font-black uppercase">
                    {currentCity?.trim() || "Grad još nije unet"}
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="hover:bg-muted bg-foreground text-background shadow-foreground/5 h-14 w-full rounded-2xl text-base font-bold shadow-xl transition-colors hover:scale-[1.01] active:scale-[0.99]"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Icon name="progress_activity" className="mr-2 animate-spin text-[20px]" />
                  Kreiranje objekta...
                </>
              ) : (
                <>
                  <Icon name="save" className="mr-2 text-[20px]" />
                  Sačuvaj i otvori objekat
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
