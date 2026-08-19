import type {
  CreateRsvpInput,
  InvitationId,
  InvitationRepository,
  PublishInvitationInput,
  RsvpDashboardStats,
  RsvpRepository,
  RsvpResponse,
  WeddingInvitation,
} from "../types/invitationPlatform";

function nowIso(): string {
  return new Date().toISOString();
}

function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

/** In-memory invitation store — swap for REST later. */
export class MemoryInvitationRepository implements InvitationRepository {
  private byId = new Map<InvitationId, WeddingInvitation>();
  private idBySlug = new Map<string, InvitationId>();

  async upsertBySlug(
    input: PublishInvitationInput,
  ): Promise<WeddingInvitation> {
    const existingId = this.idBySlug.get(input.slug);
    const stamp = nowIso();

    if (existingId) {
      const prev = this.byId.get(existingId);
      if (!prev) throw new Error("Invitation index corrupt");

      const next: WeddingInvitation = {
        ...prev,
        templateId: input.templateId,
        content: structuredClone(input.content),
        expectedGuestCount: Math.max(0, Math.floor(input.expectedGuestCount)),
        status: "published",
        updatedAt: stamp,
        publishedAt: prev.publishedAt ?? stamp,
      };
      this.byId.set(existingId, next);
      return structuredClone(next);
    }

    const id = createId("inv");
    const invitation: WeddingInvitation = {
      id,
      slug: input.slug,
      status: "published",
      templateId: input.templateId,
      content: structuredClone(input.content),
      expectedGuestCount: Math.max(0, Math.floor(input.expectedGuestCount)),
      createdAt: stamp,
      updatedAt: stamp,
      publishedAt: stamp,
    };

    this.byId.set(id, invitation);
    this.idBySlug.set(input.slug, id);
    return structuredClone(invitation);
  }

  async getBySlug(slug: string): Promise<WeddingInvitation | null> {
    const id = this.idBySlug.get(slug);
    if (!id) return null;
    const invitation = this.byId.get(id);
    return invitation ? structuredClone(invitation) : null;
  }

  async getById(id: InvitationId): Promise<WeddingInvitation | null> {
    const invitation = this.byId.get(id);
    return invitation ? structuredClone(invitation) : null;
  }
}

/** In-memory RSVP store — swap for REST later. */
export class MemoryRsvpRepository implements RsvpRepository {
  private byInvitation = new Map<InvitationId, RsvpResponse[]>();

  async create(
    invitationId: InvitationId,
    input: CreateRsvpInput,
  ): Promise<RsvpResponse> {
    const guestName = input.guestName.trim();
    if (!guestName) {
      throw new Error("Ime gosta je obavezno.");
    }

    const attendance = input.attendance;
    const partySize =
      attendance === "yes"
        ? Math.max(1, Math.min(20, Math.floor(input.partySize || 1)))
        : 1;

    const response: RsvpResponse = {
      id: createId("rsvp"),
      invitationId,
      guestName,
      attendance,
      partySize,
      companionNames: (input.companionNames ?? "").trim(),
      note: (input.note ?? "").trim(),
      submittedAt: nowIso(),
    };

    const list = this.byInvitation.get(invitationId) ?? [];
    list.push(response);
    this.byInvitation.set(invitationId, list);
    return structuredClone(response);
  }

  async listByInvitation(
    invitationId: InvitationId,
  ): Promise<RsvpResponse[]> {
    const list = this.byInvitation.get(invitationId) ?? [];
    return structuredClone(list).sort((a, b) =>
      a.submittedAt < b.submittedAt ? 1 : -1,
    );
  }

  /** Demo seed so dashboard isn't empty on first open. */
  seedDemo(invitationId: InvitationId, samples: CreateRsvpInput[]): void {
    if (this.byInvitation.has(invitationId)) return;
    const stamp = Date.now();
    const list: RsvpResponse[] = samples.map((input, index) => ({
      id: createId("rsvp"),
      invitationId,
      guestName: input.guestName.trim(),
      attendance: input.attendance,
      partySize:
        input.attendance === "yes"
          ? Math.max(1, Math.floor(input.partySize || 1))
          : 1,
      companionNames: (input.companionNames ?? "").trim(),
      note: (input.note ?? "").trim(),
      submittedAt: new Date(stamp - index * 36e5).toISOString(),
    }));
    this.byInvitation.set(invitationId, list);
  }
}

export function computeRsvpStats(
  expectedGuestCount: number,
  responses: RsvpResponse[],
): RsvpDashboardStats {
  let attendingPartyTotal = 0;
  let decliningResponseCount = 0;

  for (const response of responses) {
    if (response.attendance === "yes") {
      attendingPartyTotal += response.partySize;
    } else {
      decliningResponseCount += 1;
    }
  }

  const pendingGuestEstimate = Math.max(
    0,
    expectedGuestCount - attendingPartyTotal - decliningResponseCount,
  );

  return {
    expectedGuestCount,
    responseCount: responses.length,
    attendingPartyTotal,
    decliningResponseCount,
    pendingGuestEstimate,
    responses,
  };
}

/**
 * Application service — UI depends on this, not on storage details.
 * Later: inject fetch-based repositories with the same interfaces.
 */
export class InvitationPlatformService {
  private invitations: InvitationRepository;
  private rsvps: RsvpRepository;

  constructor(
    invitations: InvitationRepository,
    rsvps: RsvpRepository,
  ) {
    this.invitations = invitations;
    this.rsvps = rsvps;
  }

  publish(input: PublishInvitationInput): Promise<WeddingInvitation> {
    return this.invitations.upsertBySlug(input);
  }

  getInvitationBySlug(slug: string): Promise<WeddingInvitation | null> {
    return this.invitations.getBySlug(slug);
  }

  async submitRsvp(
    invitationId: InvitationId,
    input: CreateRsvpInput,
  ): Promise<RsvpResponse> {
    const invitation = await this.invitations.getById(invitationId);
    if (!invitation) {
      throw new Error("Pozivnica nije pronađena.");
    }
    if (invitation.status === "closed") {
      throw new Error("RSVP je zatvoren za ovu pozivnicu.");
    }
    return this.rsvps.create(invitationId, input);
  }

  async getDashboard(invitationId: InvitationId): Promise<RsvpDashboardStats | null> {
    const invitation = await this.invitations.getById(invitationId);
    if (!invitation) return null;
    const responses = await this.rsvps.listByInvitation(invitationId);
    return computeRsvpStats(invitation.expectedGuestCount, responses);
  }
}
