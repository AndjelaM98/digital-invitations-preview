import fs from "fs";
import path from "path";
import sharp from "sharp";

const outDir = path.resolve(
  "src/TEMPLATE POZIVNICE/envelope-romance/assets/mailbox",
);

/**
 * High-DPI embossed floral cream paper with crisp script names.
 * Rasterized large so zoom stays sharp.
 */
function buildCardSvg(partnerOne, partnerTwo) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1680" viewBox="0 0 1200 1680">
  <defs>
    <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fffefb"/>
      <stop offset="45%" stop-color="#faf6f0"/>
      <stop offset="100%" stop-color="#f2ebe3"/>
    </linearGradient>
    <radialGradient id="vignette" cx="50%" cy="45%" r="70%">
      <stop offset="55%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#e8dfd4" stop-opacity="0.35"/>
    </radialGradient>
    <!-- Emboss: light from top-left -->
    <filter id="emboss" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blur"/>
      <feOffset dx="-1.5" dy="-1.5" result="lightOff"/>
      <feFlood flood-color="#ffffff" flood-opacity="0.85"/>
      <feComposite in2="lightOff" operator="in" result="light"/>
      <feOffset in="blur" dx="1.8" dy="2.2" result="darkOff"/>
      <feFlood flood-color="#c4b5a5" flood-opacity="0.55"/>
      <feComposite in2="darkOff" operator="in" result="dark"/>
      <feMerge>
        <feMergeNode in="light"/>
        <feMergeNode in="dark"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="softGrain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.85  0 0 0 0 0.8  0 0 0 0 0.72  0 0 0 0.04 0"/>
    </filter>
  </defs>

  <!-- Paper body -->
  <rect width="1200" height="1680" fill="url(#paper)"/>
  <rect width="1200" height="1680" fill="url(#vignette)"/>
  <rect width="1200" height="1680" filter="url(#softGrain)" opacity="0.5"/>

  <!-- Inner frames -->
  <rect x="70" y="70" width="1060" height="1540" fill="none" stroke="#5c2433" stroke-opacity="0.18" stroke-width="2"/>
  <rect x="92" y="92" width="1016" height="1496" fill="none" stroke="#5c2433" stroke-opacity="0.1" stroke-width="1.2"/>

  <!-- Embossed florals (tone-on-tone) -->
  <g filter="url(#emboss)" fill="#f7f1e8" stroke="#d9cfc3" stroke-width="1.1" opacity="0.95">
    <!-- Top-left cluster -->
    <g transform="translate(90 140)">
      <path d="M40 180 C20 120 70 40 130 70 C160 20 230 50 220 110 C280 120 270 200 210 190 C200 250 120 250 100 200 C50 230 20 220 40 180 Z"/>
      <path d="M150 95 C135 70 160 45 185 60 C200 40 230 55 220 80 C245 90 235 120 210 115 C205 140 170 135 165 110 C145 125 130 115 150 95 Z"/>
      <path d="M70 210 C40 240 30 300 70 330 C50 360 80 400 120 380 C150 410 200 390 190 340 C230 330 230 270 190 270 C185 230 130 220 110 250 C90 230 80 230 70 210 Z"/>
      <path d="M200 200 C190 250 230 290 270 260 C300 290 350 260 330 220 C360 200 340 150 300 165 C290 130 240 140 245 180 C215 170 205 185 200 200 Z" opacity="0.9"/>
      <path d="M120 300 C90 360 110 430 170 440 C160 480 210 520 250 490 C290 520 340 480 320 430 C360 400 340 340 290 355 C280 310 220 310 210 350 C170 330 140 340 120 300 Z" opacity="0.85"/>
      <!-- stems -->
      <path d="M180 160 C160 220 150 300 170 380" fill="none" stroke="#d2c6b8" stroke-width="3"/>
      <path d="M210 200 C230 260 250 320 240 390" fill="none" stroke="#d2c6b8" stroke-width="2.5"/>
    </g>

    <!-- Top-right cluster -->
    <g transform="translate(780 120) scale(-1,1) translate(-320 0)">
      <path d="M40 160 C10 100 60 30 120 55 C150 10 220 40 210 95 C270 100 265 175 210 170 C200 225 130 230 110 185 C60 210 30 200 40 160 Z"/>
      <path d="M160 90 C145 65 175 40 200 60 C220 40 250 60 235 90 C260 105 245 135 220 125 C215 150 180 145 175 120 C155 130 145 110 160 90 Z"/>
      <path d="M90 200 C60 240 55 310 100 330 C80 365 120 405 160 380 C195 410 245 385 230 335 C270 320 265 260 225 265 C215 225 160 220 145 255 C120 235 105 235 90 200 Z" opacity="0.9"/>
      <path d="M180 150 C165 210 200 250 245 225 C275 255 320 225 300 185 C330 165 310 120 275 135 C265 100 220 110 225 145 C200 135 190 140 180 150 Z" opacity="0.88"/>
      <path d="M200 170 C185 230 200 290 230 340" fill="none" stroke="#d2c6b8" stroke-width="3"/>
    </g>

    <!-- Bottom-left cluster -->
    <g transform="translate(70 980)">
      <path d="M50 420 C20 360 70 290 130 320 C150 260 230 280 220 350 C280 360 270 440 210 430 C200 500 110 500 100 440 C50 470 20 470 50 420 Z"/>
      <path d="M140 350 C120 310 160 270 200 300 C230 270 280 300 260 350 C300 370 280 420 240 400 C230 450 170 450 165 400 C130 410 110 380 140 350 Z"/>
      <path d="M90 480 C60 530 80 600 140 610 C120 660 170 710 220 680 C270 720 330 670 300 610 C350 580 330 510 270 530 C260 480 190 475 180 520 C140 500 110 505 90 480 Z" opacity="0.9"/>
      <path d="M200 400 C180 470 210 540 260 560" fill="none" stroke="#d2c6b8" stroke-width="3"/>
      <path d="M160 380 C140 450 130 520 150 580" fill="none" stroke="#d2c6b8" stroke-width="2.5"/>
      <path d="M240 450 C255 400 300 390 320 440 C350 420 390 450 370 490 C400 510 380 560 340 540 C330 580 280 575 275 530 C240 540 225 500 240 450 Z" opacity="0.85"/>
    </g>

    <!-- Bottom-right cluster -->
    <g transform="translate(820 1020) scale(-1,1) translate(-300 0)">
      <path d="M40 380 C15 320 70 260 125 290 C150 235 225 255 215 320 C275 330 265 410 210 400 C200 465 120 470 105 415 C55 440 25 435 40 380 Z"/>
      <path d="M150 320 C130 280 175 245 210 280 C245 250 295 285 270 330 C310 350 290 405 250 380 C240 430 180 425 175 380 C140 390 125 355 150 320 Z"/>
      <path d="M100 430 C70 485 95 555 155 560 C140 610 195 655 245 620 C295 660 350 610 320 555 C365 525 345 460 285 480 C275 430 205 430 200 475 C160 455 125 460 100 430 Z" opacity="0.88"/>
      <path d="M190 360 C175 430 200 500 245 530" fill="none" stroke="#d2c6b8" stroke-width="3"/>
    </g>
  </g>

  <!-- Names — large so they stay sharp when zoomed -->
  <g fill="#5c2433" text-anchor="middle" font-family="Allura, 'Segoe Script', 'Brush Script MT', cursive">
    <text x="600" y="760" font-size="132">${escapeXml(partnerOne)}</text>
    <text x="600" y="860" font-size="92" opacity="0.82">&amp;</text>
    <text x="600" y="980" font-size="132">${escapeXml(partnerTwo)}</text>
  </g>
</svg>`;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const svg = buildCardSvg("Ana", "Marko");
const out = path.join(outDir, "invite-paper.png");

// 2x for retina sharpness under zoom
await sharp(Buffer.from(svg), { density: 220 })
  .resize({ width: 2000, withoutEnlargement: false })
  .png({ compressionLevel: 6 })
  .toFile(out);

const m = await sharp(out).metadata();
console.log("invite-paper.png", `${m.width}x${m.height}`, `${Math.round(fs.statSync(out).size / 1024)}KB`);
