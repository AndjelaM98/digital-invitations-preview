import fs from "fs";
import path from "path";
import sharp from "sharp";

const outDir = path.resolve(
  "src/TEMPLATE POZIVNICE/envelope-romance/assets/mailbox",
);

/** Invitation palette */
const WINE = "#5c2433";
const WINE_MID = "#6e2f40";
const WINE_DEEP = "#3f1824";
const ROSE = "#c4a69b";
const PETAL = "#d8b4a8";
const CREAM = "#faf6f0";

const closedSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${WINE_MID}"/>
      <stop offset="45%" stop-color="${WINE}"/>
      <stop offset="100%" stop-color="${WINE_DEEP}"/>
    </linearGradient>
    <linearGradient id="flap" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#7a3849"/>
      <stop offset="100%" stop-color="${WINE}"/>
    </linearGradient>
    <radialGradient id="seal" cx="32%" cy="28%" r="72%">
      <stop offset="0%" stop-color="${CREAM}"/>
      <stop offset="45%" stop-color="${PETAL}"/>
      <stop offset="100%" stop-color="${ROSE}"/>
    </radialGradient>
    <filter id="soft" x="-25%" y="-25%" width="150%" height="150%">
      <feDropShadow dx="0" dy="16" stdDeviation="14" flood-color="${WINE_DEEP}" flood-opacity="0.32"/>
    </filter>
  </defs>
  <g filter="url(#soft)">
    <rect x="72" y="110" width="1456" height="880" rx="16" fill="url(#paper)"/>
    <path d="M72 990 L800 510 L1528 990" fill="none" stroke="${WINE_DEEP}" stroke-width="3" opacity="0.4"/>
    <path d="M72 110 L800 550 L1528 110" fill="url(#flap)"/>
    <path d="M72 110 L800 550 L1528 110" fill="none" stroke="${WINE_DEEP}" stroke-width="3.5" opacity="0.28"/>
    <g transform="translate(800 510)">
      <path d="M0 -26 C-36 -74 -104 -26 -66 26 C-28 74 0 94 0 94 C0 94 28 74 66 26 C104 -26 36 -74 0 -26 Z"
            fill="url(#seal)" stroke="${ROSE}" stroke-width="5"/>
      <path d="M0 -8 C-20 -36 -58 -12 -38 16 C-18 44 0 56 0 56 C0 56 18 44 38 16 C58 -12 20 -36 0 -8 Z"
            fill="${CREAM}" opacity="0.28"/>
    </g>
  </g>
</svg>`;

const openSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1900" viewBox="0 0 1400 1900">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${WINE_MID}"/>
      <stop offset="100%" stop-color="${WINE_DEEP}"/>
    </linearGradient>
    <pattern id="stripes" width="34" height="34" patternUnits="userSpaceOnUse">
      <rect width="17" height="34" fill="${CREAM}"/>
      <rect x="17" width="17" height="34" fill="${PETAL}"/>
    </pattern>
    <filter id="soft" x="-20%" y="-12%" width="140%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="${WINE_DEEP}" flood-opacity="0.3"/>
    </filter>
  </defs>
  <g filter="url(#soft)">
    <path d="M120 820 L700 80 L1280 820 Z" fill="url(#stripes)" stroke="${ROSE}" stroke-width="2.5"/>
    <rect x="160" y="820" width="1080" height="700" fill="url(#stripes)"/>
    <path d="M120 820 L700 1480 L1280 820 L1280 1680 L120 1680 Z" fill="url(#paper)"/>
    <path d="M120 820 L700 1480 L1280 820" fill="none" stroke="${WINE_DEEP}" stroke-width="4" opacity="0.32"/>
    <path d="M120 1680 L700 1180 L1280 1680" fill="${WINE}"/>
    <path d="M120 1680 L700 1180 L1280 1680" fill="none" stroke="${WINE_DEEP}" stroke-width="3" opacity="0.28"/>
  </g>
</svg>`;

async function render(svg, file, width) {
  const out = path.join(outDir, file);
  const buf = await sharp(Buffer.from(svg)).resize({ width }).png().toBuffer();
  const trimmed = await sharp(buf).trim({ threshold: 0 }).png().toBuffer();
  fs.writeFileSync(out, trimmed);
  const m = await sharp(out).metadata();
  console.log(file, `${m.width}x${m.height}`, `${Math.round(fs.statSync(out).size / 1024)}KB`);
}

await render(closedSvg, "envelope-closed.png", 1800);
await render(openSvg, "envelope-open.png", 1600);
