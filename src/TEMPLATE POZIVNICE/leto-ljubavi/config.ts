import type { InvitationTemplateConfig } from "../shared/types";

export const LETO_LJUBAVI_ID = "leto-ljubavi" as const;

export const letoLjubaviConfig: InvitationTemplateConfig = {
  id: LETO_LJUBAVI_ID,
  title: "Leto ljubavi",
  assets: {},
  sections: [
    { id: "portal", component: "Portal" },
    { id: "hero", component: "Hero" },
    { id: "calendar", component: "Calendar" },
    { id: "venue", component: "Ceremony" },
    { id: "party", component: "Party" },
    { id: "gifts", component: "Gifts" },
    { id: "trip", component: "Trip" },
    { id: "closing", component: "Closing" },
    { id: "rsvp", component: "Rsvp" },
  ],
};
