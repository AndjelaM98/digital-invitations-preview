import type {
  PreparedTemplateMeta,
  TemplateContent,
  TemplateModules,
  TemplateStudioDraft,
} from "../types/templateStudio";

let uid = 0;
export function templateStudioId(prefix: string): string {
  uid += 1;
  return `${prefix}-${uid}`;
}

function createShareSlug(partnerOne: string, partnerTwo: string): string {
  const slugify = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "pozivnica";

  const left = slugify(partnerOne || "mlada");
  const right = slugify(partnerTwo || "mladozenja");
  const suffix = Math.random().toString(36).slice(2, 6);

  return `${left}-${right}-${suffix}`;
}

export const defaultTemplateModules: TemplateModules = {
  intro: true,
  countdown: true,
  story: true,
  schedule: true,
  gallery: true,
  party: true,
  dressCode: true,
  practical: true,
  accommodation: false,
  map: true,
  rsvp: true,
  wishes: false,
  closing: true,
};

/** Prepared uploaded templates — each owns its layout/slots. */
export const preparedTemplates: PreparedTemplateMeta[] = [
  {
    id: "simple-timeline",
    name: "Simple Timeline",
    label: "Wedding stranica",
    description:
      "Puna stranica: cover, odbrojavanje, priča, raspored, galerija, kumovi, lokacija, dress code, RSVP i još…",
    slots: [
      "cover",
      "date",
      "names",
      "intro",
      "countdown",
      "story",
      "schedule",
      "gallery",
      "party",
      "venue",
      "dressCode",
      "practical",
      "accommodation",
      "wishes",
      "closing",
      "rsvp",
      "contacts",
    ],
  },
];

export const initialTemplateContent: TemplateContent = {
  partnerOne: "",
  partnerTwo: "",
  eventDate: "",
  eventTime: "17:00",
  introMessage: "",
  story: "",
  venue: "",
  city: "",
  address: "",
  schedule: [
    {
      id: templateStudioId("sch"),
      time: "15:00",
      title: "Skup svatova",
      place: "",
    },
    {
      id: templateStudioId("sch"),
      time: "17:00",
      title: "Ulazak mladenaca",
      place: "",
    },
    {
      id: templateStudioId("sch"),
      time: "18:45",
      title: "Ceremonija",
      place: "",
    },
    {
      id: templateStudioId("sch"),
      time: "21:00",
      title: "Torta i prvi ples",
      place: "",
    },
  ],
  party: [
    { id: templateStudioId("party"), role: "Kuma", name: "" },
    { id: templateStudioId("party"), role: "Kum", name: "" },
  ],
  practical: [
    { id: templateStudioId("prac"), title: "Parking", body: "" },
  ],
  accommodation: "",
  dressCode: "",
  closingMessage: "",
  rsvpDeadline: "",
  wishesPrompt: "",
  expectedGuestCount: 80,
  contacts: [
    {
      id: templateStudioId("ct"),
      name: "",
      phone: "",
      note: "Viber",
    },
    {
      id: templateStudioId("ct"),
      name: "",
      phone: "",
      note: "Viber, WhatsApp",
    },
  ],
  photos: {
    coverPreviewUrl: null,
    galleryPreviewUrls: [],
  },
  modules: { ...defaultTemplateModules },
};

export const initialTemplateStudioDraft: TemplateStudioDraft = {
  templateId: "simple-timeline",
  content: initialTemplateContent,
  shareSlug: null,
};

export function getPreparedTemplate(
  id: TemplateStudioDraft["templateId"],
): PreparedTemplateMeta {
  return (
    preparedTemplates.find((item) => item.id === id) ?? preparedTemplates[0]
  );
}

export function formatTemplateDate(value: string): string {
  if (!value) return "17.10.2026.";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}.`;
}

export function formatTemplateDateLong(value: string): string {
  if (!value) return "Datum događaja";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("sr-Latn-RS", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatTemplateDateStacked(value: string): string[] {
  if (!value) return ["17", "10", "2026"];
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return [value, "", ""];

  return [
    String(date.getDate()).padStart(2, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getFullYear()),
  ];
}

export function buildTemplateNames(
  partnerOne: string,
  partnerTwo: string,
): string {
  const a = partnerOne.trim() || "Teodora";
  const b = partnerTwo.trim() || "Lazar";
  return `${a} & ${b}`;
}

export function createTemplateShareSlug(
  partnerOne: string,
  partnerTwo: string,
): string {
  return createShareSlug(partnerOne, partnerTwo);
}

export function mapsQuery(venue: string, address: string, city: string): string {
  return [venue, address, city]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}

/** Live countdown label for the wedding page. */
export function formatCountdown(
  eventDate: string,
  eventTime: string,
): string {
  if (!eventDate) return "Još malo do velikog dana";

  const time = eventTime.trim() || "12:00";
  const target = new Date(`${eventDate}T${time}:00`);
  if (Number.isNaN(target.getTime())) return "Još malo do velikog dana";

  const now = new Date();
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) return "Dan je stigao";

  const days = Math.floor(diffMs / 86_400_000);
  const hours = Math.floor((diffMs % 86_400_000) / 3_600_000);

  if (days === 0) {
    return hours <= 1 ? "Manje od sat vremena" : `Još ${hours} sati`;
  }

  if (days === 1) return hours > 0 ? `Još 1 dan i ${hours} h` : "Još 1 dan";

  return hours > 0 ? `Još ${days} dana i ${hours} h` : `Još ${days} dana`;
}
