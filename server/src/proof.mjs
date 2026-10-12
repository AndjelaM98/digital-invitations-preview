import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const SIX_DAYS_MS = 6 * 24 * 60 * 60 * 1000;

export function uploadUrlHash(uploadUrl) {
  return createHash("sha256").update(String(uploadUrl)).digest("base64url");
}

export function signProof(secret, { id, size, mime, uploadUrl }) {
  const payload = Buffer.from(
    JSON.stringify({
      id,
      size,
      mime,
      url: uploadUrlHash(uploadUrl),
      exp: Date.now() + SIX_DAYS_MS,
    }),
  ).toString("base64url");
  const mac = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}

export function proofMatchesUpload(proof, uploadUrl) {
  if (!proof?.url || typeof uploadUrl !== "string") return false;
  const left = Buffer.from(proof.url);
  const right = Buffer.from(uploadUrlHash(uploadUrl));
  return left.length === right.length && timingSafeEqual(left, right);
}

export function readProof(secret, proof) {
  if (!secret || typeof proof !== "string" || !proof.includes(".")) return null;
  const dot = proof.indexOf(".");
  const payload = proof.slice(0, dot);
  const mac = proof.slice(dot + 1);
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  const left = Buffer.from(mac);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (Date.now() > Number(data?.exp)) return { expired: true };
    const size = Number(data?.size);
    if (!data?.id || !Number.isSafeInteger(size) || size < 1 || !data.mime || !data.url) return null;
    return {
      id: String(data.id),
      size,
      mime: String(data.mime),
      url: String(data.url),
      exp: Number(data.exp),
    };
  } catch {
    return null;
  }
}
