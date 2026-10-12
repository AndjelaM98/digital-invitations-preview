const EXTENSIONS = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heif",
  mp4: "video/mp4",
  mov: "video/quicktime",
};

export function extensionOf(name) {
  const match = /\.([a-z0-9]+)$/i.exec(String(name || "").trim());
  return match ? match[1].toLowerCase() : "";
}

export function safeFileName(name) {
  const base = String(name || "fajl").split(/[/\\]/).pop() || "fajl";
  const cleaned = base.replace(/[^\p{L}\p{N}.\- _]/gu, "_").replace(/_+/g, "_").slice(0, 80);
  return cleaned.replace(/^_+|_+$/g, "") || "fajl";
}

export function expectedMime(name, declared) {
  const extension = extensionOf(name);
  const mime = EXTENSIONS[extension];
  if (!mime) return null;
  if (!declared || declared === "application/octet-stream" || declared === mime) return mime;
  if (extension === "heic" && (declared === "image/heic" || declared === "image/heif")) return declared;
  if (extension === "heif" && (declared === "image/heif" || declared === "image/heic")) return declared;
  if ((extension === "jpg" || extension === "jpeg") && declared === "image/jpg") return "image/jpeg";
  return null;
}

function startsWith(bytes, signature, offset = 0) {
  if (bytes.length < offset + signature.length) return false;
  return signature.every((value, index) => bytes[offset + index] === value);
}

function ascii(bytes, start, length) {
  return String.fromCharCode(...bytes.slice(start, start + length));
}

export function matchesSignature(bytes, mime) {
  if (mime === "image/jpeg") return startsWith(bytes, [0xff, 0xd8, 0xff]);
  if (mime === "image/png") return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47]);
  if (mime === "image/webp") {
    return ascii(bytes, 0, 4) === "RIFF" && ascii(bytes, 8, 4) === "WEBP";
  }
  const brand = ascii(bytes, 4, 4) === "ftyp" ? ascii(bytes, 8, 4) : "";
  if (mime === "image/heic" || mime === "image/heif") {
    return ["heic", "heix", "hevc", "hevx", "mif1", "msf1", "heim", "heis"].includes(brand.toLowerCase());
  }
  if (mime === "video/mp4" || mime === "video/quicktime") {
    const atom = ascii(bytes, 4, 4);
    if (atom === "ftyp") return /^[\x20-\x7e]{4}$/.test(brand);
    if (mime === "video/quicktime") {
      return atom === "moov" || atom === "mdat" || atom === "wide" || atom === "free";
    }
    return false;
  }
  return false;
}
