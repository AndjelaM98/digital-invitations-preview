import type { InvitationTemplate } from "../types/invitation";

import beigePinkWedding from "../assets/invitations/beige-pink-compresed.mp4";
import beigePinkPoster from "../assets/invitations/beige-pink-poster-sm.jpg";
import whiteGreenWedding from "../assets/invitations/white-green-elegant-compresed.mp4";
import whiteGreenPoster from "../assets/invitations/white-green-poster-sm.jpg";

export const invitationTemplates: InvitationTemplate[] = [
  {
    id: "wedding-beige-pink-watercolor",
    slug: "beige-pink-watercolor",
    title: "Beige Pink Watercolor",
    category: "wedding",
    media: {
      type: "video",
      src: beigePinkWedding,
      poster: beigePinkPoster,
    },
    accentColor: "#C4A69B",
    priceLabel: "Od 150 €",
    shortDescription:
      "Nežni akvarelni tonovi, toplo beige i dusty rose, za proslave koje dišu mekoću i eleganciju.",
    fullInvitationId: "ana-i-marko",
  },
  {
    id: "wedding-white-green-romantic",
    slug: "white-green-romantic",
    title: "White Green Romantic",
    category: "wedding",
    media: {
      type: "video",
      src: whiteGreenWedding,
      poster: whiteGreenPoster,
    },
    accentColor: "#A3AE9A",
    priceLabel: "Od 150 €",
    shortDescription:
      "Čista bela i sage zelenilo, romantičan, savremen ritam za baštanske i boho ceremonije.",
    // fullInvitationId added when this template’s full page is ready
  },
];

export function getInvitationBySlug(
  slug: string | undefined,
): InvitationTemplate | undefined {
  if (!slug) return undefined;
  return invitationTemplates.find((item) => item.slug === slug);
}

export function getInvitationById(
  id: string | undefined,
): InvitationTemplate | undefined {
  if (!id) return undefined;
  return invitationTemplates.find((item) => item.id === id);
}
