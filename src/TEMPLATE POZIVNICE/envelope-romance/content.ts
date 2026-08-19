import type { InvitationContent } from "../shared/types";
import couplePlaceholder from "./assets/couple-hero-placeholder.jpg";
import inviteClosing from "./assets/invite-closing.jpg";
import decoFloral from "./assets/deco-floral-watercolor.png";
import decoRingsVeil from "./assets/deco-rings-veil.png";
import inviteVenue from "./assets/invite-venue.jpg";

/**
 * Demo content for Envelope Romance.
 * Swap per client without changing section components.
 */
export const envelopeRomanceDemoContent: InvitationContent = {
  couple: {
    partnerOne: "Teodora",
    partnerTwo: "Stefan",
    joiner: "&",
  },
  eventDateIso: "2026-09-12T17:00:00",
  eventDateLabel: "12. 09. 2026.",
  heroImage: {
    src: couplePlaceholder,
    alt: "Teodora i Stefan u prirodi",
  },
  storyImage: undefined,
  closingImage: {
    src: inviteClosing,
    alt: "Teodora i Stefan",
  },
  quote:
    "Sa velikom radošću vas pozivamo na naše venčanje. Biće nam čast i radost da taj dan proživimo zajedno sa vama, okruženi ljubavlju, smehom i onima koji nam najviše znače.",
  monogram: "T | S",
  announcement: undefined,
  parentsNote: "Dve porodice. Jedna ljubav.",
  music: {
    title: "Perfect",
    artist: "Ed Sheeran",
    youtubeId: "2Vv-BfVoq4g",
    /** Skip instrumental intro — lyrics start ~0:20 */
    startSeconds: 20,
  },
  venue: {
    title: "Svečanost",
    timeLabel: "17:00",
    placeName: "Sala Garden",
    address: "Surčin, Beograd",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Sala+Garden+Surcin+Beograd",
    mapCtaLabel: "Pogledaj lokaciju",
  },
  timeline: [
    {
      id: "gather",
      time: "15:00",
      title: "Okupljanje",
      description: "Dobrodošlica uz osveženje",
    },
    {
      id: "ceremony",
      time: "17:00",
      title: "Ceremonija",
      description: "Razmena zaveta u bašti",
    },
    {
      id: "toast",
      time: "18:30",
      title: "Zdravica",
      description: "Čaša u čast ljubavi",
    },
    {
      id: "dinner",
      time: "19:30",
      title: "Večera",
      description: "Svečana trpeza",
    },
    {
      id: "dance",
      time: "21:30",
      title: "Prvi ples",
      description: "Naša pesma",
    },
    {
      id: "party",
      time: "22:30",
      title: "Proslava",
      description: "Muzika do zore",
    },
  ],
  dressCode: {
    title: "Dress code",
    label: "Udobne cipele",
    note: "i dobro raspoloženje",
  },
  gifts: {
    title: "Pokloni",
    body: "Vaše prisustvo nam je najveći poklon. Ako želite, radujemo se koverti sa željama.",
  },
  hotels: {
    title: "Smeštaj",
    items: [
      {
        id: "hotel-1",
        name: "Hotel Avala",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Hotel+Avala+Belgrade",
        detailUrl:
          "https://www.google.com/maps/search/?api=1&query=Hotel+Avala+Belgrade",
        ctaLabel: "Prikaži na mapi",
      },
      {
        id: "hotel-2",
        name: "Crowne Plaza Belgrade",
        mapUrl:
          "https://www.google.com/maps/search/?api=1&query=Crowne+Plaza+Belgrade",
        detailUrl:
          "https://www.google.com/maps/search/?api=1&query=Crowne+Plaza+Belgrade",
        ctaLabel: "Prikaži na mapi",
      },
    ],
  },
  rsvp: {
    title: "Potvrdite dolazak",
    deadlineLabel: "do 1. avgusta 2026.",
    ctaLabel: "Pošalji potvrdu",
  },
  closingMessage: "Jedva čekamo da podelimo ovaj dan sa vama",
};

/** Decorative assets */
export const envelopeRomanceFloral = decoFloral;
export const envelopeRomanceParentsImage = decoRingsVeil;
export const envelopeRomanceVenueImage = inviteVenue;
