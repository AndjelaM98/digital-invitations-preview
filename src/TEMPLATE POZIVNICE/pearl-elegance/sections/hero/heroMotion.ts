/** Premium ceremonial easing — soft ease-out with gentle deceleration. */
export const HERO_EASE: [number, number, number, number] = [
  0.16, 0.84, 0.32, 1,
];

/** Start the hero as soon as the opener zoom finishes. */
export const HERO_BASE_DELAY = 0;

export const HERO_CARD_DELAY = 0;
export const HERO_CARD_DURATION = 1.65;
export const HERO_FLOAT_DELAY_MS = 1700;

export const HERO_IMAGE_DURATION = 2.6;

export const HERO_NAME_DURATION = 0.95;
export const HERO_NAME_DELAYS = [1.05, 1.21, 1.37] as const;

export const HERO_COUNTDOWN_DELAY = 1.7;
export const HERO_COUNTDOWN_DURATION = 0.95;

export const HERO_COL_BASE = 1.8;
export const HERO_COL_STAGGER = 0.08;

export const HERO_BACKDROP_DURATION = 2.4;

export function heroT(base: number, offset: number) {
  return base + offset;
}
