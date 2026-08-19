import type { InvitationContent } from "../shared/types";

export type LetoLjubaviContent = InvitationContent & {
  ticker: string;
  greeting: string;
  intro: string;
  calendar: {
    month: string;
    days: string[];
    dates: number[];
    highlight: number;
  };
  ceremony: InvitationContent["venue"] & {
    timePlace: string;
  };
  afterTitle: string;
  afterBody: string;
  partyPrompt: string;
  party: InvitationContent["venue"] & {
    timePlace: string;
  };
  giftNote: string;
  extraDayBox: {
    line: string;
    aside: string;
  };
  tripIntro: string;
  tripDates: string;
  tripPlace: string;
  tripBody: string;
  packingNote: string;
  closing: string;
  signOff: string;
};

export const letoLjubaviDemoContent: LetoLjubaviContent = {
  couple: {
    partnerOne: "Ana",
    partnerTwo: "Marko",
    joiner: "&",
  },
  eventDateIso: "2026-07-23T15:00:00",
  eventDateLabel: "23. 07. 2026.",
  ticker: "OVOG LETA ĆE BITI PUNO LJUBAVI!",
  greeting: "Dragi gosti!",
  intro:
    "U našim životima se sprema događaj koji smo rešili da ne odlažemo, venčavamo se! I bićemo iskreno srećni ako ovaj važan dan podelite sa nama.",
  calendar: {
    month: "Jul",
    days: ["pon", "uto", "sre", "čet", "pet", "sub", "ned"],
    dates: [20, 21, 22, 23, 24, 25, 26],
    highlight: 23,
  },
  ceremony: {
    title: "Matičar",
    timeLabel: "15:00",
    timePlace: "15:00 | MATIČAR",
    placeName: "Matičar Stari Grad",
    address: "Makedonska 42, Beograd",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Makedonska+42+Beograd",
    mapCtaLabel: "Otvori mapu",
  },
  venue: {
    title: "Matičar",
    timeLabel: "15:00",
    placeName: "Matičar Stari Grad",
    address: "Makedonska 42, Beograd",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Makedonska+42+Beograd",
    mapCtaLabel: "Otvori mapu",
  },
  afterTitle: "A odmah nakon...",
  afterBody:
    "nastavljamo u opuštenijoj atmosferi, gde će se zvanični deo polako pretvoriti u praznični.",
  partyPrompt: "Gde idemo dalje?",
  party: {
    title: "Svečanost",
    timeLabel: "16:00",
    timePlace: "16:00 | 23.07.2026",
    placeName: "restoran «Vila Bella»",
    address: "Avala, Beograd",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Avala+Beograd",
    mapCtaLabel: "Otvori mapu",
  },
  giftNote:
    "Umesto cveća, bićemo zahvalni na alternativi, flaši vina ili vašem omiljenom piću uz vaše najlepše želje.",
  extraDayBox: {
    line: "A ako vam se jedan dan učini malo...",
    aside: "(nama, sigurno malo!)",
  },
  tripIntro:
    "Pozivamo vas da nastavite slavlje na Fruškoj gori, na veoma živopisnom mestu.",
  tripDates: "24.07.",
  tripPlace: "Iriški venac, Fruška gora",
  tripBody:
    "Tamo nas čekaju priroda, udobnost, razgovori do kasno u noć i još malo slavlja.",
  packingNote:
    "Ponesite dobro raspoloženje, udobnu obuću i spremnost da se radujemo zajedno.",
  closing: "S nestrpljenjem očekujemo susret!",
  closingMessage: "S nestrpljenjem očekujemo susret!",
  signOff: "Sa ljubavlju, Ana i Marko",
  rsvp: {
    title: "Potvrdite dolazak",
    deadlineLabel:
      "Molimo vas da potvrdite prisustvo do 1. avgusta 2026.",
    ctaLabel: "Pošalji potvrdu",
  },
  gifts: {
    title: "Pokloni",
    body: "Umesto cveća, bićemo zahvalni na alternativi, flaši vina ili vašem omiljenom piću uz vaše najlepše želje.",
  },
};
