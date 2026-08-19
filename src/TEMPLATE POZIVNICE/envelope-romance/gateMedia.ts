import frame01 from "./assets/gate/envelope-frame-01.png";
import frame02 from "./assets/gate/envelope-frame-02.png";
import frame03 from "./assets/gate/envelope-frame-03.png";
import frame04 from "./assets/gate/envelope-frame-04.png";
import frame05 from "./assets/gate/envelope-frame-05.png";
import envelopePaper from "./assets/gate/burgundy-paper.png";

/** Opening sequence only — frames 6–9 (yellow interior) are excluded. */
export const envelopeGateFrames = [
  frame01,
  frame02,
  frame03,
  frame04,
  frame05,
] as const;

export const envelopeGatePaper = envelopePaper;
