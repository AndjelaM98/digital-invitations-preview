/**
 * Design config for Pearl Elegance.
 * Premium, pearl-adorned wedding invitation inspired by Lake Como stationery.
 * Decorative pearls are rendered with CSS (crisp + themeable), not baked PNGs.
 * The only photographic asset is the hero portrait; everything else is real markup.
 */

import type { InvitationTemplateConfig } from "../shared/types";

export const PEARL_ELEGANCE_ID = "pearl-elegance" as const;

export const pearlEleganceConfig: InvitationTemplateConfig = {
  id: PEARL_ELEGANCE_ID,
  title: "Pearl Elegance",
  assets: {},
  sections: [
    { id: "hero", component: "HeroSection" },
    { id: "invite", component: "InviteSection" },
    { id: "calendar", component: "CalendarSection" },
    { id: "countdown", component: "CountdownSection" },
    { id: "cinematic", component: "CinematicSection" },
    { id: "venue", component: "VenueSection" },
    { id: "program", component: "ProgramSection" },
    { id: "dress-code", component: "DressCodeSection" },
    { id: "rsvp", component: "RsvpSection" },
    { id: "closing", component: "ClosingSection" },
  ],
};
