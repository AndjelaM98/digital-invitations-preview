import {
  InvitationPlatformService,
  MemoryInvitationRepository,
  MemoryRsvpRepository,
} from "./invitationPlatform";

const invitationRepo = new MemoryInvitationRepository();
const rsvpRepo = new MemoryRsvpRepository();

/**
 * App-wide platform facade.
 * Swap repositories here when connecting to a real API — UI stays the same.
 */
export const invitationPlatform = new InvitationPlatformService(
  invitationRepo,
  rsvpRepo,
);

/** Exposed only for local demo seeding. */
export const memoryRsvpRepository = rsvpRepo;
