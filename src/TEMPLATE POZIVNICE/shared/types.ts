/**
 * Shared contracts for invitation templates.
 *
 * Separation of concerns:
 * - InvitationContent  = client data (names, dates, copy, photo URLs)
 * - Template assets    = Canva-exported graphic layers (PNG/WebP/SVG)
 * - Template config    = layout, layer order, animation timings per design
 * - React sections     = structure, text binding, Framer Motion
 *
 * Never treat a full invitation as one flat PNG or one video export.
 */

export type InvitationTemplateId = string;

export type InvitationMediaImage = {
  src: string;
  alt: string;
};

export type InvitationCouple = {
  partnerOne: string;
  partnerTwo: string;
  /** Display glue, e.g. "&" or "i" */
  joiner?: string;
};

export type InvitationVenue = {
  title: string;
  timeLabel: string;
  placeName: string;
  address?: string;
  mapUrl?: string;
  mapCtaLabel?: string;
};

export type InvitationTimelineItem = {
  id: string;
  time: string;
  title: string;
  description?: string;
  /** Optional icon key resolved inside the template */
  icon?: string;
};

export type InvitationHotel = {
  id: string;
  name: string;
  detailUrl?: string;
  ctaLabel?: string;
  /** Google Maps place / search URL with pin */
  mapUrl?: string;
};

export type InvitationMusic = {
  title: string;
  artist?: string;
  /** Audio URL when ready; player UI can exist before source is set */
  src?: string;
  /** YouTube video id for embedded player */
  youtubeId?: string;
  /** Skip intro — start at this second (lyrics / vocal entry) */
  startSeconds?: number;
};

/**
 * Core content bag most wedding templates will need.
 * Templates may ignore unused fields or extend via their own content type.
 */
export type InvitationContent = {
  couple: InvitationCouple;
  eventDateIso: string;
  eventDateLabel: string;
  quote?: string;
  announcement?: string;
  monogram?: string;
  parentsNote?: string;
  music?: InvitationMusic;
  heroImage?: InvitationMediaImage;
  storyImage?: InvitationMediaImage;
  closingImage?: InvitationMediaImage;
  venue?: InvitationVenue;
  timeline?: InvitationTimelineItem[];
  dressCode?: {
    title: string;
    label: string;
    note?: string;
  };
  gifts?: {
    title: string;
    body: string;
  };
  hotels?: {
    title: string;
    items: InvitationHotel[];
  };
  rsvp?: {
    title: string;
    deadlineLabel: string;
    ctaLabel: string;
    href?: string;
  };
  closingMessage?: string;
};

export type InvitationSectionId =
  | "hero"
  | "story"
  | "music"
  | "parents"
  | "countdown"
  | "venue"
  | "timeline"
  | "dress-code"
  | "gifts"
  | "hotels"
  | "rsvp"
  | "closing"
  | (string & {});

export type InvitationSectionDefinition = {
  id: InvitationSectionId;
  component: string;
};

export type InvitationTemplateDefinition = {
  id: InvitationTemplateId;
  title: string;
  sections: InvitationSectionDefinition[];
};

/* ——— Layered graphic system (Canva assets + React motion) ——— */

/** Role of a graphic piece exported from Canva (or similar). */
export type TemplateAssetRole =
  | "background"
  | "decorative"
  | "illustration"
  | "prop"
  | "interactive"
  | "mask"
  | "photo-slot";

/**
 * One exportable graphic asset.
 * Prefer transparent PNG/WebP/SVG of a single piece, not a full-page bake.
 */
export type TemplateAsset = {
  id: string;
  src: string;
  role: TemplateAssetRole;
  alt?: string;
};

/** Percentage or CSS length placement relative to a scene stage. */
export type LayerPlacement = {
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
  width?: string | number;
  height?: string | number;
  /** CSS transform-origin for hinged flaps, etc. */
  transformOrigin?: string;
  zIndex?: number;
};

/**
 * A renderable layer: asset reference + placement + optional motion key.
 * Placement is mobile-first. Use placementDesktop only to refine larger screens.
 */
export type TemplateLayer = {
  id: string;
  assetId: string;
  /** Default placement — phones first */
  placement: LayerPlacement;
  /** Optional refinements from tablet/desktop upward */
  placementDesktop?: Partial<LayerPlacement>;
  /** Maps to a Framer Motion variant group in the scene */
  motionKey?: string;
  /** Hit target (e.g. wax seal); keep tap-friendly on mobile (≥44px) */
  interactive?: boolean;
  /** Hide until a named scene phase */
  visibleFromPhase?: string;
  /** Hide after a named scene phase */
  hideAfterPhase?: string;
};

/**
 * Interactive intro / portal scene (envelope open, gate, book cover, …).
 * Phases are template-specific strings driven by React state + Framer Motion.
 */
export type TemplateSceneDefinition = {
  id: string;
  /** Ordered phases, e.g. closed → opening → card-rise → enter */
  phases: readonly string[];
  layers: TemplateLayer[];
};

/**
 * Design-time config for one template.
 * Swap assets + this file to ship a new look without a new app shell.
 */
export type InvitationTemplateConfig = {
  id: InvitationTemplateId;
  title: string;
  assets: Record<string, TemplateAsset>;
  /** Optional interactive opener before the full invitation scroll */
  opener?: TemplateSceneDefinition;
  sections: InvitationSectionDefinition[];
};
