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

function lum(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function chroma(r, g, b) {
  return Math.max(r, g, b) - Math.min(r, g, b);
}

/** Checkerboard / pale plate — not envelope content */
function isBg(r, g, b, a) {
  if (a < 8) return true;
  const c = chroma(r, g, b);
  const l = lum(r, g, b);
  // white / light gray checker
  if (c < 30 && l > 165) return true;
  if (c < 20 && l > 130) return true;
  // mid checker gray tiles
  if (c < 16 && l > 100 && Math.abs(r - g) < 10 && Math.abs(g - b) < 10) {
    return true;
  }
  return false;
}

function keepContent(r, g, b) {
  const c = chroma(r, g, b);
  const l = lum(r, g, b);
  // burgundy / red paper
  if (r > 55 && r >= g + 12 && r >= b + 12) return true;
  // pink heart / pink lining
  if (r > 140 && b > 100 && r >= g - 5 && c > 10 && l > 90) return true;
  // warm dark fold shadows on red paper
  if (r > 40 && r > g && r > b && l < 120 && c > 8) return true;
  return false;
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
    out[p] = r;
    out[p + 1] = g;
    out[p + 2] = b;
    if (isBg(r, g, b, a) || !keepContent(r, g, b)) {
      out[p + 3] = 0;
    } else {
      out[p + 3] = a;
    }
  }

  // mild erode of leftover fringe: kill near-bg pixels next to transparent
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
  const check = await sharp(output)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const cw = check.info.width;
  const chh = check.info.height;
  let opaque = 0;
  for (let i = 3; i < check.data.length; i += 4) {
    if (check.data[i] > 15) opaque++;
  }
  const cover = opaque / (cw * chh);
  console.log(
    path.basename(output),
    `${m.width}x${m.height}`,
    `cover=${(cover * 100).toFixed(1)}%`,
    `cornerA=${check.data[3]}`,
    `${Math.round(fs.statSync(output).size / 1024)}KB`,
  );
}

await processOne(
  sources.closed,
  path.join(outDir, "envelope-closed.png"),
  1800,
);
await processOne(sources.open, path.join(outDir, "envelope-open.png"), 1600);
