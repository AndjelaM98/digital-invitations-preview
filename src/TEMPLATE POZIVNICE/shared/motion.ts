import type { Transition, Variants } from "framer-motion";

/** Soft premium easing for invitation templates. */
export const invitationEase: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

export const invitationTransition: Transition = {
  duration: 1.05,
  ease: invitationEase,
};

/** Stronger entrance for desktop / ceremonial beats */
export const slideInTransition: Transition = {
  duration: 1.25,
  ease: [0.16, 1, 0.3, 1],
};

/**
 * Ceremonial openers (envelope, gates, cards).
 * Keep durations moderate on mobile so motion stays fluid, not sluggish.
 */
export const ceremonialTransition: Transition = {
  duration: 1.2,
  ease: invitationEase,
};

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
};

export const revealFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const revealScale: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};

/**
 * Full-viewport slide-ins — content flies in from off-screen.
 * Measured against a static wrapper (see SlideIn) so IO still fires.
 */
export const revealFromRight: Variants = {
  hidden: { opacity: 0, x: "70vw" },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: "30vw" },
};

export const revealFromLeft: Variants = {
  hidden: { opacity: 0, x: "-70vw" },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: "-30vw" },
};

export function slideVariants(from: "left" | "right"): Variants {
  return from === "right" ? revealFromRight : revealFromLeft;
}

/**
 * Reusable hinge-open for envelope flaps / book covers.
 * Apply with transformOrigin set on the layer placement.
 */
export const hingeOpenUp: Variants = {
  closed: { rotateX: 0 },
  open: { rotateX: -168 },
};

export const cardRiseFromEnvelope: Variants = {
  nested: { y: "42%", opacity: 0.85, scale: 0.92 },
  risen: { y: "-8%", opacity: 1, scale: 1 },
};
