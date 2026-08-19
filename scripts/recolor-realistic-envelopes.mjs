import fs from "fs";
import path from "path";
import sharp from "sharp";

const outDir = path.resolve(
  "src/TEMPLATE POZIVNICE/envelope-romance/assets/mailbox",
);

const sources = {
  closed:
    "C:/Users/nenad/.cursor/projects/c-Users-nenad-Desktop-KlikDoVencanja/assets/envelope-closed-hq.png",
  open: "C:/Users/nenad/.cursor/projects/c-Users-nenad-Desktop-KlikDoVencanja/assets/envelope-open-hq.png",
};

/** Invitation wine / rose (keep luminance from source for realism) */
const WINE = { r: 92, g: 36, b: 51 }; // #5c2433
const WINE_DEEP = { r: 63, g: 24, b: 36 }; // #3f1824
const ROSE = { r: 196, g: 166, b: 155 }; // #c4a69b
const PETAL = { r: 216, g: 180, b: 168 }; // #d8b4a8
const CREAM = { r: 250, g: 246, b: 240 }; // #faf6f0

function lum(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function chroma(r, g, b) {
  return Math.max(r, g, b) - Math.min(r, g, b);
}

function clamp(n) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function mix(a, b, t) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

function tintWithLuma(base, sourceLuma, baseLuma = lum(base.r, base.g, base.b)) {
  // Preserve shading: scale base color by relative luminance
  const factor = baseLuma > 1 ? sourceLuma / baseLuma : 1;
  // Soften extreme darks/lights so texture stays natural
  const f = 0.35 + factor * 0.65;
  return {
    r: clamp(base.r * f),
    g: clamp(base.g * f),
    b: clamp(base.b * f),
  };
}

function isBg(r, g, b, a) {
  if (a < 8) return true;
  const c = chroma(r, g, b);
  const l = lum(r, g, b);
  if (c < 30 && l > 165) return true;
  if (c < 20 && l > 130) return true;
  if (c < 16 && l > 100 && Math.abs(r - g) < 10 && Math.abs(g - b) < 10) {
    return true;
  }
  return false;
}

function isPinkAccent(r, g, b) {
  const l = lum(r, g, b);
  const c = chroma(r, g, b);
  // heart seal + striped lining (bright / pastel pinks)
  if (r > 150 && g > 90 && b > 100 && r >= g - 8 && l > 110 && c > 12) {
    // not deep red paper
    if (!(r > g + 45 && r > b + 45 && l < 140)) return true;
  }
  // lighter pinks / near-white pink highlights on seal
  if (r > 200 && g > 160 && b > 160 && r >= g && l > 170 && c > 8) return true;
  return false;
}

function isRedPaper(r, g, b) {
  const l = lum(r, g, b);
  // burgundy / maroon / dark red paper (incl. folds)
  if (r > 40 && r >= g + 10 && r >= b + 10) {
    if (!isPinkAccent(r, g, b)) return true;
  }
  // very dark red shadows
  if (r > 25 && r > g && r > b && l < 90 && chroma(r, g, b) > 6) return true;
  return false;
}

function recolorPixel(r, g, b) {
  const l = lum(r, g, b);

  if (isPinkAccent(r, g, b)) {
    // Map pastel pinks → dusty rose / cream (seal + lining)
    const t = Math.max(0, Math.min(1, (l - 120) / 110));
    const base = mix(ROSE, mix(PETAL, CREAM, t), t * 0.65);
    return tintWithLuma(base, l, lum(base.r, base.g, base.b));
  }

  if (isRedPaper(r, g, b)) {
    // Map red paper → invitation wine, keep folds via luma
    const t = Math.max(0, Math.min(1, l / 160));
    const base = mix(WINE_DEEP, WINE, t);
    // slightly lift midtones so it doesn't go muddy
    const lifted = mix(base, { r: 110, g: 48, b: 66 }, t * 0.25);
    return tintWithLuma(lifted, l, lum(lifted.r, lifted.g, lifted.b));
  }

  return null;
}

async function processOne(input, output, width) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: ch } = info;
  const out = Buffer.alloc(w * h * 4);

  for (let i = 0, p = 0; i < data.length; i += ch, p += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (isBg(r, g, b, a)) {
      out[p] = 0;
      out[p + 1] = 0;
      out[p + 2] = 0;
      out[p + 3] = 0;
      continue;
    }

    const next = recolorPixel(r, g, b);
    if (!next) {
      // leftover non-content → transparent
      if (lum(r, g, b) > 180 && chroma(r, g, b) < 35) {
        out[p + 3] = 0;
      } else {
        out[p] = r;
        out[p + 1] = g;
        out[p + 2] = b;
        out[p + 3] = a;
      }
      continue;
    }

    out[p] = next.r;
    out[p + 1] = next.g;
    out[p + 2] = next.b;
    out[p + 3] = a;
  }

  // fringe cleanup
  const copy = Buffer.from(out);
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = (y * w + x) * 4;
      if (copy[i + 3] === 0) continue;
      let trans = 0;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        if (copy[((y + dy) * w + (x + dx)) * 4 + 3] === 0) trans++;
      }
      const r = copy[i];
      const g = copy[i + 1];
      const b = copy[i + 2];
      if (trans >= 2 && chroma(r, g, b) < 40 && lum(r, g, b) > 120) {
        out[i + 3] = 0;
      }
    }
  }

  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (out[(y * w + x) * 4 + 3] > 15) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  const pad = 4;
  minX = Math.max(0, minX - pad);
  minY = Math.max(0, minY - pad);
  maxX = Math.min(w - 1, maxX + pad);
  maxY = Math.min(h - 1, maxY + pad);

  await sharp(out, { raw: { width: w, height: h, channels: 4 } })
    .extract({
      left: minX,
      top: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1,
    })
    .resize({ width, withoutEnlargement: false })
    .png()
    .toFile(output);

  const m = await sharp(output).metadata();
  console.log(
    path.basename(output),
    `${m.width}x${m.height}`,
    `${Math.round(fs.statSync(output).size / 1024)}KB`,
  );
}

await processOne(
  sources.closed,
  path.join(outDir, "envelope-closed.png"),
  1800,
);
await processOne(sources.open, path.join(outDir, "envelope-open.png"), 1600);
