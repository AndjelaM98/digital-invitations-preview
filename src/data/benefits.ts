import benefitiImg from "../assets/benefits/benefiti.webp";
import collageImg from "../assets/benefits/collage.webp";
import telefonImg from "../assets/benefits/telefon1.webp";

export type BenefitShot = {
  id: string;
  src: string;
  alt: string;
  shotClass: string;
};

export type BenefitNote = {
  id: string;
  title: string;
  body: string;
  noteClass: string;
};

export type BenefitBlock = {
  id: string;
  blockClass: string;
  shot: BenefitShot;
  note: BenefitNote;
};

export type ProcessStep = {
  id: string;
  /** Always two lines so station titles share the same height. */
  titleLines: [string, string];
  body: string;
};

/** Horizontal process ribbon — creation journey, not benefit list. */
export const invitationProcessSteps: ProcessStep[] = [
  {
    id: "style",
    titleLines: ["Odaberite", "pozivnicu"],
    body: "Pronađite dizajn koji najbolje odražava stil vašeg događaja i postavlja ton cele proslave.",
  },
  {
    id: "details",
    titleLines: ["Prilagodite", "svaki detalj"],
    body: "Dodajte imena, datum, lokaciju, fotografije i sve ono što vašu pozivnicu čini jedinstvenom.",
  },
  {
    id: "create",
    titleLines: ["Kreirajte", "bez ograničenja"],
    body: "Rasporedite sadržaj onako kako želite i oblikujte pozivnicu prema svom ukusu.",
  },
  {
    id: "preview",
    titleLines: ["Pregledajte", "i usavršite"],
    body: "Pre nego što je podelite, pregledajte svaki detalj i uverite se da izgleda baš onako kako ste zamislili.",
  },
  {
    id: "share",
    titleLines: ["Podelite", "i pratite odgovore"],
    body: "Pošaljite jedan link svim gostima i u svakom trenutku pratite RSVP odgovore na jednom mestu.",
  },
];

/**
 * Paired shot + note for a natural mobile/tablet reading order.
 * Desktop still uses absolute placement via shot/note class names.
 */
export const benefitBlocks: BenefitBlock[] = [
  {
    id: "modern",
    blockClass: "benefits__block--1",
    shot: {
      id: "img-1",
      src: collageImg,
      alt: "Elegantni digitalni prikaz pozivnice",
      shotClass: "benefits__shot--1",
    },
    note: {
      id: "modern",
      title: "Moderan i sofisticiran izbor",
      body: "Ostavite snažan prvi utisak uz elegantno i savremeno rešenje.",
      noteClass: "benefits__note--1",
    },
  },
  {
    id: "simple",
    blockClass: "benefits__block--2",
    shot: {
      id: "img-2",
      src: telefonImg,
      alt: "Digitalna pozivnica na telefonu",
      shotClass: "benefits__shot--2",
    },
    note: {
      id: "simple",
      title: "Jednostavno i bez stresa",
      body: "Kreirajte, podelite i pratite odgovore bez štamparije i čekanja.",
      noteClass: "benefits__note--4",
    },
  },
  {
    id: "all-in-one",
    blockClass: "benefits__block--3",
    shot: {
      id: "img-3",
      src: benefitiImg,
      alt: "Detalj premium digitalne pozivnice",
      shotClass: "benefits__shot--3",
    },
    note: {
      id: "all-in-one",
      title: "Sve na jednom mestu",
      body: "Lokacija, raspored i smeštaj kroz jednu elegantnu digitalnu stranicu.",
      noteClass: "benefits__note--5",
    },
  },
  {
    id: "communication",
    blockClass: "benefits__block--4",
    shot: {
      id: "img-4",
      src: telefonImg,
      alt: "Mobilni prikaz pozivnice",
      shotClass: "benefits__shot--4",
    },
    note: {
      id: "communication",
      title: "Laka komunikacija sa gostima",
      body: "Detalji događaja, lokacija i izmene uvek dostupni gostima.",
      noteClass: "benefits__note--2",
    },
  },
  {
    id: "rsvp",
    blockClass: "benefits__block--5",
    shot: {
      id: "img-5",
      src: collageImg,
      alt: "Atmosfera digitalne pozivnice",
      shotClass: "benefits__shot--5",
    },
    note: {
      id: "rsvp",
      title: "Jednostavan RSVP",
      body: "Gosti brzo potvrde dolazak, a vi uvek znate broj gostiju.",
      noteClass: "benefits__note--3",
    },
  },
];
