/** Template-first studio — structure lives per template. */

export type TemplateStudioStepId =
  | "template"
  | "fill"
  | "photos"
  | "review"
  | "link"
  | "gosti";

export type PreparedTemplateId = "simple-timeline";

export type TemplateSlotId =
  | "cover"
  | "date"
  | "names"
  | "intro"
  | "countdown"
  | "story"
  | "schedule"
  | "gallery"
  | "party"
  | "venue"
  | "dressCode"
  | "practical"
  | "accommodation"
  | "wishes"
  | "closing"
  | "rsvp"
  | "contacts";

/** Toggleable page sections (same idea as the old wedding-page composer). */
export type TemplateModuleId =
  | "intro"
  | "countdown"
  | "story"
  | "schedule"
  | "gallery"
  | "party"
  | "dressCode"
  | "practical"
  | "accommodation"
  | "map"
  | "rsvp"
  | "wishes"
  | "closing";

export type PreparedTemplateMeta = {
  id: PreparedTemplateId;
  name: string;
  label: string;
  description: string;
  /** Fixed stack of slots this prepared layout exposes. */
  slots: TemplateSlotId[];
};

export type TemplateScheduleItem = {
  id: string;
  time: string;
  title: string;
  place: string;
};

export type TemplateContact = {
  id: string;
  name: string;
  phone: string;
  note: string;
};

export type TemplatePartyMember = {
  id: string;
  role: string;
  name: string;
};

export type TemplatePracticalItem = {
  id: string;
  title: string;
  body: string;
};

export type TemplatePhotos = {
  coverPreviewUrl: string | null;
  galleryPreviewUrls: string[];
};

export type TemplateModules = Record<TemplateModuleId, boolean>;

/** Content injected into the selected template's slots. */
export type TemplateContent = {
  partnerOne: string;
  partnerTwo: string;
  eventDate: string;
  eventTime: string;
  introMessage: string;
  story: string;
  venue: string;
  city: string;
  address: string;
  schedule: TemplateScheduleItem[];
  party: TemplatePartyMember[];
  practical: TemplatePracticalItem[];
  accommodation: string;
  dressCode: string;
  closingMessage: string;
  rsvpDeadline: string;
  wishesPrompt: string;
  /** Couple estimate of invited heads — feeds RSVP dashboard. */
  expectedGuestCount: number;
  contacts: TemplateContact[];
  photos: TemplatePhotos;
  modules: TemplateModules;
};

export type TemplateStudioDraft = {
  templateId: PreparedTemplateId;
  content: TemplateContent;
  shareSlug: string | null;
};

export type TemplateModuleMeta = {
  id: TemplateModuleId;
  title: string;
  hint: string;
};

export const TEMPLATE_MODULE_META: TemplateModuleMeta[] = [
  { id: "intro", title: "Uvodna poruka", hint: "Prvi stihovi" },
  { id: "countdown", title: "Odbrojavanje", hint: "Do dana venčanja" },
  { id: "story", title: "Naša priča", hint: "Vaša ljubavna priča" },
  { id: "schedule", title: "Raspored dana", hint: "Satnica" },
  { id: "gallery", title: "Galerija", hint: "Fotografije" },
  { id: "party", title: "Uz nas su", hint: "Kumovi i svatovi" },
  { id: "dressCode", title: "Dress code", hint: "Predlog odeće" },
  { id: "practical", title: "Dobro je znati", hint: "Parking, prevoz…" },
  { id: "accommodation", title: "Smeštaj", hint: "Preporuke" },
  { id: "map", title: "Lokacija i mapa", hint: "Adresa" },
  { id: "rsvp", title: "Potvrda dolaska", hint: "RSVP" },
  { id: "wishes", title: "Knjiga želja", hint: "Poruke mladencima" },
  { id: "closing", title: "Završna poruka", hint: "Poslednji stih" },
];

export const TEMPLATE_STUDIO_STEPS: {
  id: TemplateStudioStepId;
  index: string;
  title: string;
  hint: string;
}[] = [
  {
    id: "template",
    index: "01",
    title: "Šablon",
    hint: "Gotov dizajn",
  },
  {
    id: "fill",
    index: "02",
    title: "Stranica",
    hint: "Sekcije i sadržaj",
  },
  {
    id: "photos",
    index: "03",
    title: "Galerija",
    hint: "Cover i fotografije",
  },
  {
    id: "review",
    index: "04",
    title: "Pregled",
    hint: "Kako gosti vide",
  },
  {
    id: "link",
    index: "05",
    title: "Poziv",
    hint: "Link za goste",
  },
  {
    id: "gosti",
    index: "06",
    title: "Gosti",
    hint: "RSVP dashboard",
  },
];
