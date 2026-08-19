/**
 * Design config for Envelope Romance.
 * Starts on hero — opener animation removed.
 */

import type { InvitationTemplateConfig } from "../shared/types";

export const ENVELOPE_ROMANCE_ID = "envelope-romance" as const;

/**
 * Expected Canva exports (replace src when files land):
 * - envelope-body.png
 * - envelope-flap.png
 * - envelope-seal.png
 * - invitation-paper.png
 * - floral accents / lace as needed
 *
 * Author layer `placement` for ~390px phones first.
 * Add `placementDesktop` only where tablet/desktop needs different scale.
 */
export const envelopeRomanceConfig: InvitationTemplateConfig = {
  id: ENVELOPE_ROMANCE_ID,
  title: "Envelope Romance",
  assets: {
    // Placeholder ids — wire real imports when Canva layers arrive.
    // Example:
    // "envelope-body": { id: "envelope-body", src: bodyUrl, role: "prop" },
  },
  opener: {
    id: "envelope-open",
    phases: ["closed", "flap-opening", "card-rising", "enter"] as const,
    layers: [
      // Filled when assets exist, e.g.:
      // {
      //   id: "body",
      //   assetId: "envelope-body",
      //   placement: { left: 10, top: 18, width: 80, zIndex: 1 },
      // },
      // {
      //   id: "flap",
      //   assetId: "envelope-flap",
      //   placement: {
      //     left: 10, top: 18, width: 80, zIndex: 3,
      //     transformOrigin: "50% 0%",
      //   },
      //   motionKey: "flap",
      // },
      // {
      //   id: "seal",
      //   assetId: "envelope-seal",
      //   placement: { left: 42, top: 48, width: 16, zIndex: 4 },
      //   interactive: true,
      //   motionKey: "seal",
      // },
      // {
      //   id: "paper",
      //   assetId: "invitation-paper",
      //   placement: { left: 18, top: 28, width: 64, zIndex: 2 },
      //   motionKey: "paper",
      //   visibleFromPhase: "card-rising",
      // },
    ],
  },
  sections: [
    { id: "hero", component: "HeroSection" },
    { id: "story", component: "StorySection" },
    { id: "parents", component: "ParentsSection" },
    { id: "countdown", component: "CountdownSection" },
    { id: "venue", component: "VenueSection" },
    { id: "timeline", component: "TimelineSection" },
    { id: "dress-code", component: "DressCodeSection" },
    { id: "hotels", component: "HotelsSection" },
    { id: "rsvp", component: "RsvpSection" },
    { id: "closing", component: "ClosingSection" },
  ],
};
