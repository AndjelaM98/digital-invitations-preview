/**
 * Pearl decorations for Pearl Elegance.
 * The prominent pearls (draping strands and the signature winding necklace)
 * are photoreal PNG cutouts so they read as real jewelry, matching the
 * reference invitation. A tiny CSS drop remains for the calendar accent.
 */

import accentLilyA from "./assets/accent-lily-a.png";
import accentLilyB from "./assets/accent-lily-b.png";
import pearlStrand from "./assets/pearl-strand.png";
import pearlWinding from "./assets/pearl-winding.png";

type PearlStrandProps = {
  className?: string;
  /** kept for backwards compatibility; ignored by the image strand */
  count?: number;
};

/** Photoreal draping strand of pearls — used as a drape / divider. */
export function PearlStrand({ className = "" }: PearlStrandProps) {
  return (
    <img
      src={pearlStrand}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`pe-strand ${className}`.trim()}
    />
  );
}

/** Alias for a horizontal pearl strand used as a section divider. */
export const PearlDivider = PearlStrand;

type AccentLilyProps = {
  variant?: "a" | "b";
  className?: string;
};

/** White parrot-tulip accent, placed beside paper-like sections. */
export function AccentLily({ variant = "a", className = "" }: AccentLilyProps) {
  return (
    <img
      src={variant === "b" ? accentLilyB : accentLilyA}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`pe-lily pe-lily--${variant} ${className}`.trim()}
    />
  );
}

type PearlDropProps = {
  count?: number;
  className?: string;
};

/** Vertical pearl drop — like a hanging earring, used to accent a date. */
export function PearlDrop({ count = 3, className = "" }: PearlDropProps) {
  return (
    <div className={`pe-drop ${className}`.trim()} aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <span key={index} className="pe-drop__bead" />
      ))}
      <span className="pe-drop__pendant" />
    </div>
  );
}

/**
 * Signature winding pearl necklace for the Program section — a photoreal
 * serpentine strand of pearls.
 */
export function PearlWinding({ className = "" }: { className?: string }) {
  return (
    <img
      src={pearlWinding}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`pe-winding ${className}`.trim()}
    />
  );
}
