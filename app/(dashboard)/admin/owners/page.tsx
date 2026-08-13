"use client";

import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Facility {
  id: string;
  name: string;
  city: string;
}

export default function AdminOwnersPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [facilityId, setFacilityId] = useState("");
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const selectedFacility = facilities.find((facility) => facility.id === facilityId) ?? null;

  useEffect(() => {
    const load = async () => {
      try {
        const { getOwnerFacilitiesAction } = await import("@/app/(server)/actions/owner");
        const result = await getOwnerFacilitiesAction();
        setFacilities(result);
      } catch {
        toast.error("Učitavanje objekata nije uspelo");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAssign = async () => {
    if (!email.trim()) {
      toast.error("Unesite email adresu");
      return;
    }
    if (!facilityId) {
      toast.error("Izaberite objekat");
      return;
    }

    setSubmitting(true);
    try {
      const { assignFacilityOwnerAction } = await import("@/app/(server)/actions/users");
      const result = await assignFacilityOwnerAction(email.trim(), facilityId);
      if (result.success) {
        toast.success("Vlasnik uspešno dodeljen");
        setEmail("");
        setFacilityId("");
        router.refresh();
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Greška pri dodeli vlasnika");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-6 md:px-6">
      <section className="border-border/60 bg-card/95 relative overflow-hidden rounded-[30px] border p-5 shadow-sm md:p-6">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.14),transparent_60%)] lg:block" />
        <div className="relative z-10 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-3">
            <div className="text-muted-foreground flex items-center gap-2 text-[10px] font-black tracking-[0.22em] uppercase">
              <span className="size-2 rounded-full bg-amber-500" />
              Vlasništvo nad objektima
            </div>
            <div>
              <h1 className="text-foreground text-3xl font-black tracking-tight uppercase">
                Dodela vlasnika
              </h1>
              <p className="text-muted-foreground mt-1 max-w-2xl text-sm leading-6">
                Povežite korisnika sa objektom putem email adrese i dodelite mu ulogu vlasnika za
                upravljanje prodajom, cenama i operativnim pregledom.
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="border-border/60 bg-background/75 rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                Dostupni objekti
              </div>
              <div className="text-foreground mt-1 text-2xl font-black">{facilities.length}</div>
            </div>
            <div className="border-border/60 bg-background/75 rounded-2xl border px-4 py-3">
              <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                Izabrani objekat
              </div>
              <div className="text-foreground mt-1 text-sm font-black uppercase">
                {selectedFacility ? selectedFacility.name : "Nije izabran"}
              </div>
              <div className="text-muted-foreground mt-1 text-[11px]">
                {selectedFacility ? selectedFacility.city : "Odaberite objekat iz liste"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Card className="bg-card/95 border-border/60 overflow-hidden rounded-[30px] shadow-sm">
        <CardHeader className="border-border/50 border-b">
          <CardTitle className="flex items-center gap-2 text-lg font-black tracking-tight uppercase">
            <Icon name="manage_accounts" className="text-primary text-[20px]" />
            Formular za dodelu
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm leading-6">
            Korisnik dobija ulogu{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-[11px]">
              FACILITY_OWNER
            </code>{" "}
            i pristup odgovarajućem objektu odmah nakon uspešne dodele.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 p-5 md:grid-cols-[1.2fr_1fr] md:p-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-muted-foreground text-[10px] font-black tracking-[0.18em] uppercase">
                Email adresa korisnika
              </label>
              <Input
                type="email"
                placeholder="korisnik@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-2xl"
              />
            </div>

            <div className="space-y-2">
              <label className="text-muted-foreground text-[10px] font-black tracking-[0.18em] uppercase">
                Objekat
              </label>
              <Select value={facilityId} onValueChange={setFacilityId} disabled={loading}>
                <SelectTrigger className="h-11 rounded-2xl">
                  <SelectValue placeholder={loading ? "Učitavanje..." : "Izaberite objekat"} />
                </SelectTrigger>
                <SelectContent>
                  {facilities.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name} — {f.city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleAssign}
              disabled={submitting || !email.trim() || !facilityId}
              className="h-11 w-full rounded-2xl text-[11px] font-black tracking-[0.18em] uppercase"
            >
              {submitting ? "Dodeljivanje..." : "Dodeli vlasništvo"}
            </Button>
          </div>

          <div className="border-border/50 bg-background/60 space-y-4 rounded-3xl border p-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-2xl">
                <Icon name="shield" className="text-[18px]" />
              </div>
              <div>
                <div className="text-foreground text-sm font-black uppercase">Šta se dodeljuje</div>
                <div className="text-muted-foreground text-[11px]">Pristup za vlasnika objekta</div>
              </div>
            </div>

            <ul className="text-muted-foreground space-y-3 text-sm leading-6">
              <li>Upravljanje cenama i ponudom objekta.</li>
              <li>Pregled prodaje i operativnih podataka.</li>
              <li>Pristup samo izabranom objektu i njegovim sekcijama.</li>
            </ul>

            <div className="border-border/50 bg-muted/20 rounded-2xl border p-3">
              <div className="text-muted-foreground text-[9px] font-black tracking-[0.18em] uppercase">
                Trenutni izbor
              </div>
              <div className="text-foreground mt-2 text-sm font-black uppercase">
                {selectedFacility
                  ? `${selectedFacility.name} — ${selectedFacility.city}`
                  : "Čeka izbor objekta"}
              </div>
              <div className="text-muted-foreground mt-1 text-[11px]">
                {email.trim() ? email.trim() : "Čeka unos email adrese"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
