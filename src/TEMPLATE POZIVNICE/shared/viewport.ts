/**
 * Mobile-first breakpoints for invitation templates.
 * Base styles always target phones; these raise the floor upward.
 */
export const invitationBreakpoints = {
  /** Large phones / small tablets */
  sm: 480,
  /** Tablets / small laptops */
  md: 768,
  /** Desktop */
  lg: 1024,
  /** Wide desktop */
  xl: 1280,
} as const;

export type InvitationBreakpoint = keyof typeof invitationBreakpoints;

/** Min tap target for interactive layers (seal, CTAs) on touch devices. */
export const invitationMinTapPx = 44;
