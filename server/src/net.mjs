const buckets = new Map();

const IP =
  /^(?:\d{1,3}\.){3}\d{1,3}$|^(?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}$/i;

export function isIp(value) {
  if (!IP.test(value)) return false;
  if (value.includes(".")) {
    return value.split(".").every((part) => Number(part) <= 255);
  }
  return true;
}

export function normalizeIp(value) {
  if (!value) return "";
  const cleaned = value.replace(/^::ffff:/i, "");
  return isIp(cleaned) ? cleaned : "";
}

export function clientAddress(request, { trustProxy, hops }) {
  const socketIp = normalizeIp(request.socket?.remoteAddress || "") || "unknown";
  if (!trustProxy) return socketIp;
  const header = request.headers["x-forwarded-for"];
  if (typeof header !== "string") return socketIp;
  const hopCount = Number.isInteger(hops) && hops > 0 ? hops : 1;
  const parts = header.split(",");
  const index = parts.length - hopCount;
  if (index < 0 || index >= parts.length) return socketIp;
  return normalizeIp(parts[index].trim()) || socketIp;
}

export function allowedUploadUrl(value) {
  try {
    const url = new URL(value);
    const uploadId = url.searchParams.get("upload_id");
    return (
      url.protocol === "https:" &&
      url.hostname === "www.googleapis.com" &&
      url.pathname.startsWith("/upload/drive/") &&
      Boolean(uploadId)
    );
  } catch {
    return false;
  }
}

export function hitLimit(key, limit, windowMs, now = Date.now()) {
  const current = buckets.get(key);
  if (!current || current.reset <= now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  current.count += 1;
  return current.count > limit;
}

export function resetLimits() {
  buckets.clear();
}
