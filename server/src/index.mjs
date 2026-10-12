import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import {
  authRedirectUrl,
  createPrivateFolder,
  createResumableSession,
  deleteDriveFile,
  exchangeCode,
  findPrivateFolder,
  forwardChunk,
  getAccessToken,
  queryUpload,
  readDriveFile,
  readFileHead,
} from "./drive.mjs";
import { allowedUploadUrl, clientAddress, hitLimit } from "./net.mjs";
import { proofMatchesUpload, readProof, signProof } from "./proof.mjs";
import { loadRefreshToken, saveRefreshToken } from "./store.mjs";
import { expectedMime, matchesSignature, safeFileName } from "./validate.mjs";

function repoFile(name) {
  const url = new URL(`../../${name}`, import.meta.url);
  let path = decodeURIComponent(url.pathname);
  if (/^\/[A-Za-z]:\//.test(path)) path = path.slice(1);
  return path;
}

loadEnv(repoFile(".env"));
loadEnv(repoFile("server/.env"));

const FOLDER_NAME = "Teodora i Lazar - Uspomene";
const CHUNK_LIMIT = 8 * 1024 * 1024;
const TEN_MINUTES = 10 * 60 * 1000;
const KNOWN_ERRORS = new Set([
  "invalid",
  "too_large",
  "network",
  "oauth_exchange_failed",
  "oauth_refresh_failed",
  "drive_session_failed",
  "drive_folder_failed",
]);

const config = {
  port: Number(process.env.PORT || process.env.API_PORT || 8787),
  host: process.env.API_HOST || "0.0.0.0",
  publicOrigin: process.env.PUBLIC_ORIGIN || "https://klikdovencanja.rs",
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  redirectUri:
    process.env.GOOGLE_REDIRECT_URI || "http://127.0.0.1:8787/api/memories/oauth/callback",
  folderId: process.env.GOOGLE_DRIVE_FOLDER_ID || "",
  scope: process.env.GOOGLE_DRIVE_SCOPE || "https://www.googleapis.com/auth/drive.file",
  setupSecret: process.env.OWNER_SETUP_SECRET || "",
  maxFileBytes: Number(process.env.MAX_FILE_BYTES || 5 * 1024 * 1024 * 1024),
  maxFiles: Number(process.env.MAX_FILES_PER_BATCH || 40),
  trustProxy: process.env.TRUST_PROXY === "1",
  proxyHops: configuredHops(),
};

function configuredHops() {
  const value = Number(process.env.TRUST_PROXY_HOPS || 1);
  return Number.isInteger(value) && value > 0 ? value : 1;
}

function loadEnv(file) {
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function proofSecret() {
  return process.env.PROOF_SECRET || config.setupSecret;
}

function ready() {
  return Boolean(
    loadRefreshToken() && config.folderId && config.clientId && config.clientSecret && proofSecret(),
  );
}

function guestKey(request) {
  const value = request.headers["x-guest-key"];
  return typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value) ? value.toLowerCase() : "";
}

function address(request) {
  return clientAddress(request, { trustProxy: config.trustProxy, hops: config.proxyHops });
}

function tooMany(request, action) {
  const ip = address(request);
  const guest = guestKey(request) || `anon:${ip}`;
  const limits = {
    session: [80, 600, 500],
    confirm: [160, 1200, 800],
    relay: [4000, 20000, 4000],
  };
  const [guestLimit, ipLimit, globalLimit] = limits[action] || limits.confirm;
  return (
    hitLimit(`guest:${guest}:${action}`, guestLimit, TEN_MINUTES) ||
    hitLimit(`ip:${ip}:${action}`, ipLimit, TEN_MINUTES) ||
    hitLimit(`all:${action}`, globalLimit, 60 * 1000)
  );
}

function allowedOrigin(origin) {
  if (!origin) return false;
  if (origin === config.publicOrigin) return true;
  const extra = (process.env.PUBLIC_ORIGINS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (extra.includes(origin)) return true;
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

function send(response, status, payload, origin) {
  const body = JSON.stringify(payload);
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Content-Length": Buffer.byteLength(body),
    "Referrer-Policy": "no-referrer",
  };
  if (origin && allowedOrigin(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers.Vary = "Origin";
  }
  response.writeHead(status, headers);
  response.end(body);
}

function readBounded(request, limit, tooBigCode) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    let settled = false;
    const fail = (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };
    const succeed = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    request.on("data", (chunk) => {
      size += chunk.length;
      if (size > limit) {
        request.pause();
        fail(new Error(tooBigCode));
        return;
      }
      chunks.push(chunk);
    });
    request.on("end", () => succeed(Buffer.concat(chunks)));
    request.on("error", () => fail(new Error("network")));
  });
}

function readJson(request) {
  return readBounded(request, 32_768, "invalid").then((buffer) => {
    try {
      return JSON.parse(buffer.toString("utf8") || "{}");
    } catch {
      throw new Error("invalid");
    }
  });
}

function readChunk(request) {
  return readBounded(request, CHUNK_LIMIT, "too_large");
}

function parseByteRange(value) {
  const match = /^bytes (\d+)-(\d+)\/(\d+)$/.exec(value);
  if (!match) return null;
  const start = Number(match[1]);
  const end = Number(match[2]);
  const total = Number(match[3]);
  if (![start, end, total].every((item) => Number.isSafeInteger(item))) return null;
  if (start > end || total < 1 || end >= total) return null;
  const length = end - start + 1;
  if (length < 1 || length > CHUNK_LIMIT) return null;
  return { start, end, total, length };
}

function signState() {
  const payload = Buffer.from(
    JSON.stringify({ t: Date.now(), n: randomBytes(8).toString("hex") }),
  ).toString("base64url");
  const mac = createHmac("sha256", config.setupSecret).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}

function validState(state) {
  if (!config.setupSecret || typeof state !== "string" || !state.includes(".")) return false;
  const dot = state.indexOf(".");
  const payload = state.slice(0, dot);
  const mac = state.slice(dot + 1);
  const expected = createHmac("sha256", config.setupSecret).update(payload).digest("base64url");
  const left = Buffer.from(mac);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return Date.now() - Number(data.t) < 10 * 60 * 1000;
  } catch {
    return false;
  }
}

function secretMatches(given) {
  if (!config.setupSecret || typeof given !== "string") return false;
  const left = Buffer.from(given);
  const right = Buffer.from(config.setupSecret);
  return left.length === right.length && timingSafeEqual(left, right);
}

function driveAuth() {
  return {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    refreshToken: loadRefreshToken(),
  };
}

function headerValue(request, name) {
  const value = request.headers[name];
  return typeof value === "string" ? value : "";
}

function headerIsList(request, names) {
  return names.some((name) => Array.isArray(request.headers[name]));
}

function originOf(request) {
  return typeof request.headers.origin === "string" ? request.headers.origin : "";
}

function rejectOrigin(origin) {
  return Boolean(origin) && !allowedOrigin(origin);
}

function html(response, status, message) {
  response.writeHead(status, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  });
  response.end(`<p>${message}</p>`);
}

async function handleSession(request, response, origin) {
  if (tooMany(request, "session")) {
    send(response, 429, { error: "rate" }, origin);
    return;
  }
  if (!ready()) {
    request.resume();
    send(response, 503, { error: "unavailable" }, origin);
    return;
  }
  const body = await readJson(request);
  if (typeof body.company === "string" ? body.company.length > 0 : body.company != null) {
    send(response, 400, { error: "invalid" }, origin);
    return;
  }
  const size = body.size;
  const mime = expectedMime(body.name, String(body.mime || ""));
  const tooLarge = typeof size === "number" && Number.isInteger(size) && size > config.maxFileBytes;
  if (
    !mime ||
    typeof size !== "number" ||
    !Number.isInteger(size) ||
    size < 1 ||
    size > config.maxFileBytes
  ) {
    send(response, 400, { error: tooLarge ? "too_large" : "invalid" }, origin);
    return;
  }
  const id = randomUUID();
  const driveName = `${new Date().toISOString().replace(/[:.]/g, "-")}_${id.slice(0, 8)}_${safeFileName(body.name)}`;
  const token = await getAccessToken(driveAuth());
  const uploadUrl = await createResumableSession({
    accessToken: token,
    folderId: config.folderId,
    name: driveName,
    mime,
    size,
    origin: origin || config.publicOrigin,
    sessionId: id,
  });
  const proof = signProof(proofSecret(), { id, size, mime, uploadUrl });
  send(response, 201, { id, uploadUrl, proof }, origin);
}

async function handleConfirm(request, response, origin) {
  if (tooMany(request, "confirm")) {
    send(response, 429, { error: "rate" }, origin);
    return;
  }
  const body = await readJson(request);
  const proof = readProof(proofSecret(), body.proof);
  if (proof?.expired) {
    send(response, 409, { error: "expired" }, origin);
    return;
  }
  if (!proof) {
    send(response, 400, { error: "rejected" }, origin);
    return;
  }
  const driveFileId = String(body.driveFileId || "");
  if (!/^[a-zA-Z0-9_-]{10,}$/.test(driveFileId)) {
    send(response, 400, { error: "rejected" }, origin);
    return;
  }
  if (!ready()) {
    send(response, 503, { error: "unavailable" }, origin);
    return;
  }
  const token = await getAccessToken(driveAuth());
  const file = await readDriveFile({ accessToken: token, fileId: driveFileId });
  const belongs =
    file &&
    !file.trashed &&
    file.appProperties?.sessionId === proof.id &&
    Array.isArray(file.parents) &&
    file.parents.includes(config.folderId) &&
    Number(file.size) === proof.size;
  if (!belongs) {
    send(response, 400, { error: "rejected" }, origin);
    return;
  }
  const head = await readFileHead({ accessToken: token, fileId: driveFileId });
  if (!head || !matchesSignature(head, proof.mime)) {
    if (head && file.appProperties?.sessionId === proof.id) {
      try {
        await deleteDriveFile({ accessToken: token, fileId: driveFileId });
      } catch {
        console.error("memories_api_error", "drive_delete_failed");
      }
    }
    send(response, 400, { error: "rejected" }, origin);
    return;
  }
  send(response, 200, { ok: true }, origin);
}

async function handleResume(request, response, origin) {
  if (tooMany(request, "relay")) {
    send(response, 429, { error: "rate" }, origin);
    return;
  }
  const body = await readJson(request);
  const proof = readProof(proofSecret(), body.proof);
  if (proof?.expired) {
    send(response, 409, { error: "expired" }, origin);
    return;
  }
  if (!proof || !allowedUploadUrl(body.uploadUrl) || !proofMatchesUpload(proof, body.uploadUrl)) {
    send(response, 400, { error: "rejected" }, origin);
    return;
  }
  if (!ready()) {
    send(response, 503, { error: "unavailable" }, origin);
    return;
  }
  const result = await queryUpload(body.uploadUrl, proof.size);
  if (result.status === "expired") {
    send(response, 409, { error: "expired" }, origin);
    return;
  }
  if (result.status === "rejected") {
    send(response, 502, { error: "network" }, origin);
    return;
  }
  send(response, 200, result, origin);
}

async function handleRelay(request, response, origin) {
  if (tooMany(request, "relay")) {
    send(response, 429, { error: "rate" }, origin);
    return;
  }
  if (headerIsList(request, ["x-proof", "x-upload-url", "x-mime", "content-range"])) {
    request.resume();
    send(response, 400, { error: "invalid" }, origin);
    return;
  }
  const proof = readProof(proofSecret(), headerValue(request, "x-proof"));
  const uploadUrl = headerValue(request, "x-upload-url");
  const contentRange = headerValue(request, "content-range");
  const mime = headerValue(request, "x-mime");
  if (proof?.expired) {
    request.resume();
    send(response, 409, { error: "expired" }, origin);
    return;
  }
  if (!proof || !uploadUrl || !allowedUploadUrl(uploadUrl) || !proofMatchesUpload(proof, uploadUrl)) {
    request.resume();
    send(response, 400, { error: "rejected" }, origin);
    return;
  }
  if (mime !== proof.mime) {
    request.resume();
    send(response, 400, { error: "invalid" }, origin);
    return;
  }
  const declaredLength = Number(request.headers["content-length"]);
  if (Number.isSafeInteger(declaredLength) && declaredLength > CHUNK_LIMIT) {
    send(response, 413, { error: "too_large" }, origin);
    request.resume();
    return;
  }
  const body = await readChunk(request);
  const range = parseByteRange(contentRange);
  if (!range || range.total !== proof.size || range.length !== body.length) {
    send(response, 400, { error: "invalid" }, origin);
    return;
  }
  if (!ready()) {
    send(response, 503, { error: "unavailable" }, origin);
    return;
  }
  const result = await forwardChunk({ uploadUrl, mime, contentRange, body });
  if (result.status === "expired") {
    send(response, 409, { error: "expired" }, origin);
    return;
  }
  if (result.status === "rejected") {
    send(response, 502, { error: "network" }, origin);
    return;
  }
  send(response, 200, result, origin);
}

async function handleCreateFolder(request, response, origin) {
  if (hitLimit(`admin-folder:${address(request)}`, 8, TEN_MINUTES)) {
    send(response, 429, { error: "rate" }, origin);
    return;
  }
  const body = await readJson(request);
  if (!secretMatches(typeof body.setup === "string" ? body.setup : "")) {
    send(response, 404, { error: "rejected" }, origin);
    return;
  }
  if (config.folderId) {
    send(response, 200, { folderId: config.folderId, created: false }, origin);
    return;
  }
  if (!loadRefreshToken() || !config.clientId || !config.clientSecret) {
    send(response, 503, { error: "unavailable" }, origin);
    return;
  }
  const token = await getAccessToken(driveAuth());
  const existing = await findPrivateFolder({ accessToken: token, name: FOLDER_NAME });
  if (existing) {
    send(response, 200, { folderId: existing, created: false }, origin);
    return;
  }
  const folderId = await createPrivateFolder({ accessToken: token, name: FOLDER_NAME });
  send(response, 201, { folderId, created: true, name: FOLDER_NAME }, origin);
}

function fail(request, response, origin, error) {
  const code = error instanceof Error ? error.message : "";
  const safe = KNOWN_ERRORS.has(code) ? code : "network";
  console.error("memories_api_error", safe);
  if (response.headersSent) return;
  if (safe === "too_large") {
    send(response, 413, { error: "too_large" }, origin);
    if (!request.destroyed) request.resume();
  } else if (safe === "invalid") send(response, 400, { error: "invalid" }, origin);
  else if (safe === "oauth_refresh_failed" || safe === "drive_session_failed") {
    send(response, 503, { error: "unavailable" }, origin);
  } else send(response, 502, { error: "network" }, origin);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
  const origin = originOf(request);

  if (request.method === "OPTIONS") {
    if (!allowedOrigin(origin)) {
      send(response, 403, { error: "rejected" }, origin);
      return;
    }
    response.writeHead(204, {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, X-Guest-Key, X-Proof, X-Upload-Url, X-Mime, Content-Range",
      "Access-Control-Max-Age": "600",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      Vary: "Origin",
    });
    response.end();
    return;
  }

  try {
    if (rejectOrigin(origin)) {
      send(response, 403, { error: "rejected" }, origin);
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/memories/status") {
      send(
        response,
        200,
        { ready: ready(), maxFileBytes: config.maxFileBytes, maxFiles: config.maxFiles },
        origin,
      );
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/memories/oauth/start") {
      if (!secretMatches(url.searchParams.get("setup") || "")) {
        send(response, 404, { error: "rejected" }, origin);
        return;
      }
      if (!config.clientId || !config.clientSecret || !config.setupSecret) {
        send(response, 503, { error: "unavailable" }, origin);
        return;
      }
      response.writeHead(302, {
        Location: authRedirectUrl({
          clientId: config.clientId,
          redirectUri: config.redirectUri,
          scope: config.scope,
          state: signState(),
        }),
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
      });
      response.end();
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/memories/oauth/callback") {
      if (!validState(url.searchParams.get("state") || "")) {
        html(response, 400, "Povezivanje nije prihvaćeno.");
        return;
      }
      const token = await exchangeCode({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        redirectUri: config.redirectUri,
        code: url.searchParams.get("code") || "",
      });
      const where = process.env.GOOGLE_REFRESH_TOKEN ? "env" : saveRefreshToken(token);
      const message =
        where === "volume"
          ? "Google nalog je povezan. Sada napravite privatni folder, pa njegov ID upišite u GOOGLE_DRIVE_FOLDER_ID. Ovaj prozor možete zatvoriti."
          : where === "env"
            ? "Nalog je već povezan promenljivom okruženja. Novi token nije upisan."
            : "Nalog je primljen samo u memoriji ovog procesa. Postavite DATA_DIR i TOKEN_ENCRYPTION_KEY, pa povežite nalog ponovo pre kreiranja foldera.";
      html(response, 200, message);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/memories/admin/folder") {
      await handleCreateFolder(request, response, origin);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/memories/sessions") {
      await handleSession(request, response, origin);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/memories/confirm") {
      await handleConfirm(request, response, origin);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/memories/resume") {
      await handleResume(request, response, origin);
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/memories/relay") {
      await handleRelay(request, response, origin);
      return;
    }

    send(response, 404, { error: "rejected" }, origin);
  } catch (error) {
    fail(request, response, origin, error);
  }
});

server.listen(config.port, config.host, () => {
  console.log(`memories api ${config.host}:${config.port} ready=${ready()} proxy=${config.trustProxy}`);
});
