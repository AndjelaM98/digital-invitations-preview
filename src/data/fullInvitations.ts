import type { ComponentType } from "react";

import AnaIMarkoInvitation from "../pages/invitations/full/AnaIMarkoInvitation";

/**
 * Registry of complete digital invitations.
 * Add a new entry here when a full template page is ready —
 * then set `fullInvitationId` on the catalog template.
 */
export const fullInvitationRegistry: Record<
  string,
  {
    title: string;
    Component: ComponentType;
  }
> = {
  "ana-i-marko": {
    title: "Ana & Marko",
    Component: AnaIMarkoInvitation,
  },
};

export function getFullInvitation(id: string | undefined) {
  if (!id) return undefined;
  return fullInvitationRegistry[id];
}
