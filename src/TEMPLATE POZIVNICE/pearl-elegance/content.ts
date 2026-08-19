import type { InvitationContent, InvitationMediaImage } from "../shared/types";
import coupleHero from "./assets/couple-hero.png";
import coupleCinematic from "./assets/couple-cinematic.png";

/**
 * Content contract for Pearl Elegance.
 * Extends the shared InvitationContent with a few template-specific,
 * fully optional blocks so the section components stay 100% data-driven.
 * Swap `pearlEleganceDemoContent` per client without touching components.
 */

export type PearlProgramItem = {
  id: string;
  time: string;
  label: string;
};

export type PearlCalendarDay = {
  id: string;
  weekday: string;
  day: string;
  highlight?: boolean;
};

export type PearlVenuePlace = {
  id: string;
  kind: string;
  name: string;
  addressLines: string[];
  mapUrl?: string;
  mapLabel?: string;
};

export type PearlSwatch = {
  id: string;
  name: string;
  hex: string;
};

export type PearlEleganceContent = InvitationContent & {
  /** Spaced date digits shown at the top of the hero (e.g. "14 · 08 · 2026") */
  dateDigits?: string;
  /** Script line under the names (e.g. "Naš dan venčanja") */
  heroScript?: string;
  /** Short guest-invitation line on the opener paper inside the envelope */
  openerInvite?: string;

  invite?: {
    eyebrow?: string;
    title: string;
    script?: string;
    body: string;
    monogram?: string;
    /** Realistic envelope + clipped paper flat-lay scene */
    image?: InvitationMediaImage;
  };

  calendar?: {
    eyebrow?: string;
    monthLabel: string;
    script?: string;
    days: PearlCalendarDay[];
  };

  /** Elegant days-until-the-wedding countdown, driven by eventDateIso */
  countdown?: {
    script?: string;
    title: string;
    /** Text shown before the day number, e.g. "Još" */
    lead?: string;
    /** Singular/plural unit label — use unitSuffix + auto dan/dana, or legacy unit string */
    unit?: string;
    /** e.g. "do našeg venčanja" — paired with automatic dan/dana */
    unitSuffix?: string;
    /** Small note shown when the day has arrived */
    arrivedNote?: string;
  };

  /** Full-bleed cinematic photo interlude */
  cinematic?: {
    image: InvitationMediaImage;
    caption?: string;
  };

  venues?: {
    eyebrow?: string;
    title: string;
    script?: string;
    places: PearlVenuePlace[];
    /** Realistic silver tray + card flat-lay scene */
    image?: InvitationMediaImage;
  };

  program?: {
    eyebrow?: string;
    title: string;
    script?: string;
    items: PearlProgramItem[];
  };

  palette?: {
    eyebrow?: string;
    title: string;
    script?: string;
    note?: string;
    swatches?: PearlSwatch[];
    ctaLabel?: string;
    ctaHref?: string;
  };

  /** Visual-only RSVP block (functionality added later) */
  rsvpBlock?: {
    eyebrow?: string;
    title: string;
    script?: string;
    body?: string;
    nameLabel: string;
    namePlaceholder: string;
    guestsLabel: string;
    guestsPlaceholder: string;
    attendingLabel: string;
    attendingYes: string;
    attendingNo: string;
    ctaLabel: string;
    deadlineNote?: string;
  };

  /** Elegant closing section with a romantic quote */
  closing?: {
    script?: string;
    quote: string;
    signature?: string;
  };
};

/**
 * Demo content for Pearl Elegance (Serbian).
 * Warm, premium wedding invitation.
 */
export const pearlEleganceDemoContent: PearlEleganceContent = {
  couple: {
    partnerOne: "Milica",
    partnerTwo: "Miloš",
    joiner: "i",
  },
  eventDateIso: "2027-08-14T15:00:00",
  eventDateLabel: "14. avgust 2027.",
  dateDigits: "14.08.2027.",
  heroScript: "Naš dan venčanja",
  monogram: "M | M",
  quote:
    "Sa velikom radošću vas pozivamo na naše venčanje. Biće nam čast da taj dan proživimo zajedno sa vama.",
  openerInvite:
    "Sa velikom radošću vas pozivamo da budete deo našeg najlepšeg dana.",
  music: {
    title: "A Thousand Years",
    artist: "Christina Perri",
    youtubeId: "rtOvBOTyX00",
    startSeconds: 12,
  },
  heroImage: {
    src: coupleHero,
    alt: "Milica i Miloš, pinky promise sa vereničkim prstenom",
  },

  invite: {
    title: "Dragi prijatelji",
    script: "Pozvani ste",
    body: "Sa radošću vas pozivamo da proslavite početak našeg zajedničkog života. Vaše prisustvo učiniće naš dan nezaboravnim.",
    monogram: "M | M",
  },

  calendar: {
    monthLabel: "Avgust",
    script: "Sačuvajte datum",
    days: [
      { id: "thu", weekday: "Četvrtak", day: "13" },
      { id: "fri", weekday: "Petak", day: "14", highlight: true },
      { id: "sat", weekday: "Subota", day: "15" },
    ],
  },

  countdown: {
    script: "još malo pa zajedno",
    title: "Do venčanja",
    lead: "Još",
    unitSuffix: "do našeg venčanja",
    arrivedNote: "Danas je naš dan!",
  },

  cinematic: {
    image: {
      src: coupleCinematic,
      alt: "Verenički prsten u prvom planu, par u zagrljaju",
    },
  },

  venues: {
    title: "Mesto",
    script: "Radujemo se vašem dolasku",
    places: [
      {
        id: "ceremony",
        kind: "Ceremonija i proslava",
        name: "Sala Garden",
        addressLines: ["Surčin", "Beograd"],
        mapUrl: "https://maps.google.com/?q=Sala+Garden+Surcin+Beograd",
        mapLabel: "Prikaži na mapi",
      },
    ],
  },

  program: {
    title: "Program",
    script: "dana",
    items: [
      { id: "gathering", time: "15:00", label: "Skup svatova i slikanje sa mladencima" },
      { id: "entrance", time: "17:00", label: "Ulazak mladenaca" },
      { id: "ceremony", time: "18:00", label: "Građansko venčanje" },
      { id: "cake", time: "21:00", label: "Svadbena torta i prvi ples" },
      { id: "closing", time: "00:00", label: "Kraj" },
    ],
  },

  palette: {
    title: "Dress code",
    note: "Dobro raspoloženje i udobne cipele",
  },

  rsvpBlock: {
    title: "Potvrda dolaska",
    script: "RSVP",
    body: "Molimo vas da nam potvrdite svoj dolazak kako bismo sve pripremili baš za vas.",
    nameLabel: "Ime i prezime",
    namePlaceholder: "Vaše ime i prezime",
    guestsLabel: "Broj gostiju",
    guestsPlaceholder: "npr. 2",
    attendingLabel: "Da li dolazite?",
    attendingYes: "Sa radošću dolazim",
    attendingNo: "Nažalost, ne mogu",
    ctaLabel: "Pošalji potvrdu",
    deadlineNote: "Molimo potvrdite do 1. jula 2027.",
  },

  closing: {
    script: "Sa ljubavlju",
    quote:
      "I tako počinje zauvek — dva srca, jedan dom, i čitav život ispisan zajedno.",
    signature: "Milica & Miloš",
  },
};
