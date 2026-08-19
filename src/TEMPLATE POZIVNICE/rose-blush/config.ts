import type { InvitationTemplateConfig } from "../shared/types";

export const ROSE_BLUSH_ID = "rose-blush" as const;

export const roseBlushConfig: InvitationTemplateConfig = {
  id: ROSE_BLUSH_ID,
  title: "Blush Wedding",
  assets: {},
  opener: {
    id: "date-intro",
    phases: ["intro", "enter"] as const,
    layers: [],
  },
  sections: [
    { id: "hero", component: "HeroSection" },
    { id: "gallery", component: "GallerySection" },
    { id: "countdown", component: "CountdownSection" },
    { id: "timeline", component: "TimelineSection" },
    { id: "reception", component: "ReceptionSection" },
    { id: "dress-code", component: "DressCodeSection" },
    { id: "rsvp", component: "RsvpSection" },
    { id: "closing", component: "ClosingSection" },
  ],
};
