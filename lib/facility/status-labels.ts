import type { FacilityStatus } from "@prisma/client";

/** Serbian Latin labels for facility lifecycle status (admin UI). */
export const FACILITY_STATUS_LABEL: Record<FacilityStatus, string> = {
  ACTIVE: "Aktivan",
  DRAFT: "Nacrt",
  CLOSED: "Zatvoren",
  EMERGENCY_SHUTDOWN: "Hitno gašenje",
};

export const FACILITY_STATUS_DESCRIPTION: Record<FacilityStatus, string> = {
  ACTIVE:
    "Objekat je na tržištu; prodaja i skeniranje zavise od radnog vremena i privremenih zatvaranja.",
  DRAFT: "Objekat nije objavljen; nije vidljiv u pretrazi ni u prodaji.",
  CLOSED:
    "Meko trajno skidanje sa tržišta. Istorija i transakcije ostaju. Možete ponovo otvoriti kasnije.",
  EMERGENCY_SHUTDOWN: "Hitni kill switch: nova prodaja i skeniranje ulaznica su isključeni odmah.",
};

export const FACILITY_STATUS_CONSEQUENCES: Record<
  "CLOSED" | "EMERGENCY_SHUTDOWN" | "ACTIVE" | "DRAFT",
  string[]
> = {
  CLOSED: [
    "Objekat nestaje iz pretrage i kategorija",
    "Nova prodaja se zaustavlja",
    "Postojeće ulaznice ostaju u istoriji (nema hard-delete)",
    "Možete ponovo otvoriti kasnije",
  ],
  EMERGENCY_SHUTDOWN: [
    "Nova prodaja se trenutno zaustavlja",
    "Skeniranje ulaznica se hard-stop-uje",
    "Namenjeno vanrednim situacijama, ne planiranom održavanju",
    "Za planirane datume koristite Privremena zatvaranja (status ostaje Aktivan)",
  ],
  ACTIVE: [
    "Objekat se vraća na tržište (ako je bio zatvoren ili u nacrtu)",
    "Prodaja i sken zavise od radnog vremena i privremenih zatvaranja",
  ],
  DRAFT: [
    "Objekat se skida sa javnog tržišta",
    "Nije vidljiv u pretrazi ni u prodaji",
    "Podaci i ulaznice ostaju sačuvani",
  ],
};
