export type InvitationCategory =
  | "wedding"
  | "birthday"
  | "baptism"
  | "engagement"
  | "baby-shower"
  | "other";

export type InvitationImageMedia = {
  type: "image";
  src: string;
  alt: string;
};

export type InvitationVideoMedia = {
  type: "video";
  src: string;
  poster?: string;
};

export type InvitationMedia = InvitationImageMedia | InvitationVideoMedia;

/**
 * Catalog entry for carousel + detail pages.
 * `fullInvitationId` links to a complete invitation experience when ready.
 */
export type InvitationTemplate = {
  id: string;
  /** URL segment: /pozivnice/:slug */
  slug: string;
  title: string;
  category: InvitationCategory;
  media: InvitationMedia;
  accentColor?: string;
  priceLabel: string;
  shortDescription: string;
  /** Key into fullInvitationRegistry — omit until the full page exists. */
  fullInvitationId?: string;
};
