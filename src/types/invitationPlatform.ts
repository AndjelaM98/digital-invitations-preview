/**
 * Wedding invitation platform domain.
 *
 * Flow: published invitation → guest RSVP → persisted responses → couple dashboard.
 * Storage is swappable: MemoryRsvpStore today, HTTP/API later — same contracts.
 */

import type {
  PreparedTemplateId,
  TemplateContent,
} from "./templateStudio";

export type InvitationId = string;
export type RsvpResponseId = string;

export type InvitationStatus = "draft" | "published" | "closed";

/** Published (or draft) invitation instance guests open via slug. */
export type WeddingInvitation = {
  id: InvitationId;
  slug: string;
  status: InvitationStatus;
  templateId: PreparedTemplateId;
  content: TemplateContent;
  /**
   * Couple's estimate of invited people (heads).
   * Powers "ukupan broj pozvanih" until a full invitee list exists.
   */
  expectedGuestCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type RsvpAttendance = "yes" | "no";

/** Single guest RSVP submission stored for the couple. */
export type RsvpResponse = {
  id: RsvpResponseId;
  invitationId: InvitationId;
  guestName: string;
  attendance: RsvpAttendance;
  /** Heads in this party when attending; 1 when declining. */
  partySize: number;
  companionNames: string;
  note: string;
  submittedAt: string;
};

export type CreateRsvpInput = {
  guestName: string;
  attendance: RsvpAttendance;
  partySize: number;
  companionNames?: string;
  note?: string;
};

export type PublishInvitationInput = {
  slug: string;
  templateId: PreparedTemplateId;
  content: TemplateContent;
  expectedGuestCount: number;
};

/** Aggregates for the couple dashboard. */
export type RsvpDashboardStats = {
  expectedGuestCount: number;
  responseCount: number;
  attendingPartyTotal: number;
  decliningResponseCount: number;
  pendingGuestEstimate: number;
  responses: RsvpResponse[];
};

/**
 * Port for invitation persistence.
 * Replace MemoryInvitationRepository with API client later.
 */
export type InvitationRepository = {
  upsertBySlug: (
    input: PublishInvitationInput,
  ) => Promise<WeddingInvitation>;
  getBySlug: (slug: string) => Promise<WeddingInvitation | null>;
  getById: (id: InvitationId) => Promise<WeddingInvitation | null>;
};

/**
 * Port for RSVP persistence + reads.
 * Replace MemoryRsvpRepository with API client later.
 */
export type RsvpRepository = {
  create: (
    invitationId: InvitationId,
    input: CreateRsvpInput,
  ) => Promise<RsvpResponse>;
  listByInvitation: (
    invitationId: InvitationId,
  ) => Promise<RsvpResponse[]>;
};
