import type { InvitationTemplateConfig } from "../shared/types";

export const SOFT_FLORAL_ID = "soft-floral" as const;

export const softFloralConfig: InvitationTemplateConfig = {
  id: SOFT_FLORAL_ID,
  title: "Soft Floral",
  assets: {},
  opener: {
    id: "flower-gate",
    phases: ["cover", "opening", "enter"] as const,
    layers: [],
  },
  sections: [
    { id: "hero", component: "HeroSection" },
    { id: "main-event", component: "MainEventSection" },
    { id: "timeline", component: "TimelineSection" },
    { id: "details", component: "DetailsSection" },
    { id: "rsvp", component: "RsvpSection" },
    { id: "closing", component: "ClosingSection" },
  ],
};
