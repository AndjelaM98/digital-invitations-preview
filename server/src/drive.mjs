import https from "node:https";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

let accessCache = null;

async function googleFetch(url, options) {
  try {
    return await fetch(url, { ...options, redirect: "manual" });
  } catch {
    throw new Error("network");
  }
}

async function discard(response) {
  await response.body?.cancel().catch(() => {});
}

export function authRedirectUrl({ clientId, redirectUri, scope, state }) {
  const url = new URL(AUTH_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scope);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", state);
  return url.toString();
}

export async function exchangeCode({ clientId, clientSecret, redirectUri, code }) {
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });
  const response = await googleFetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.refresh_token) {
    throw new Error("oauth_exchange_failed");
  }
  return data.refresh_token;
}

async function refreshAccessToken({ clientId, clientSecret, refreshToken }) {
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
  const response = await googleFetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.access_token) {
    throw new Error("oauth_refresh_failed");
  }
  return {
    token: data.access_token,
    expiresAt: Date.now() + Number(data.expires_in || 3000) * 1000,
  };
}

export async function getAccessToken(config) {
  if (accessCache && accessCache.expiresAt - Date.now() > 60_000) return accessCache.token;
  accessCache = await refreshAccessToken(config);
  return accessCache.token;
}

export async function createResumableSession({
  accessToken,
  folderId,
  name,
  mime,
  size,
  origin,
  sessionId,
}) {
  const response = await googleFetch(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": mime,
        "X-Upload-Content-Length": String(size),
        Origin: origin,
      },
      body: JSON.stringify({
        name,
        parents: [folderId],
        appProperties: { sessionId },
      }),
    },
  );
  if (response.status !== 200 && response.status !== 201) {
    console.error("drive_session_failed", response.status);
    await discard(response);
    throw new Error("drive_session_failed");
  }
  const location = response.headers.get("location");
  await discard(response);
  if (!location) throw new Error("drive_session_failed");
  return location;
}

export async function readDriveFile({ accessToken, fileId }) {
  const response = await googleFetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?fields=id,name,mimeType,size,parents,trashed,appProperties`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!response.ok) {
    await discard(response);
    return null;
  }
  return response.json();
}

export function readFileHead({ accessToken, fileId }) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    const req = https.request(
      {
        hostname: "www.googleapis.com",
        path: `/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Range: "bytes=0-31",
        },
      },
      (res) => {
        const chunks = [];
        let size = 0;
        const stop = () => {
          res.destroy();
          req.destroy();
        };
        res.on("data", (chunk) => {
          if (size >= 32) {
            stop();
            return;
          }
          const slice = chunk.subarray(0, 32 - size);
          chunks.push(slice);
          size += slice.length;
          if (size >= 32) stop();
        });
        res.on("error", () => finish(size ? Buffer.concat(chunks).subarray(0, 32) : null));
        res.on("close", () => {
          if (res.statusCode !== 200 && res.statusCode !== 206) {
            finish(null);
            return;
          }
          finish(size ? Buffer.concat(chunks).subarray(0, 32) : null);
        });
      },
    );
    req.on("error", () => finish(null));
    req.setTimeout(15000, () => {
      req.destroy();
      finish(null);
    });
    req.end();
  });
}

export async function queryUpload(uploadUrl, total) {
  try {
    const response = await googleFetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Length": "0",
        "Content-Range": `bytes */${total}`,
      },
    });
    return readUploadResult(response, 0);
  } catch {
    console.error("drive_upload_failed");
    return { status: "rejected" };
  }
}

export async function forwardChunk({ uploadUrl, mime, contentRange, body }) {
  try {
    const response = await googleFetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": mime,
        "Content-Range": contentRange,
        "Content-Length": String(body.length),
      },
      body,
    });
    return readUploadResult(response, 0);
  } catch {
    console.error("drive_upload_failed");
    return { status: "rejected" };
  }
}

async function readUploadResult(response, fallbackOffset) {
  if (response.status === 404 || response.status === 410) {
    await discard(response);
    return { status: "expired" };
  }
  if (response.status === 308) {
    const range = response.headers.get("range");
    const match = range ? /bytes=0-(\d+)/i.exec(range) : null;
    await discard(response);
    return { status: "continue", offset: match ? Number(match[1]) + 1 : fallbackOffset };
  }
  if (response.status === 200 || response.status === 201) {
    const data = await response.json().catch(() => ({}));
    if (!data.id) return { status: "rejected" };
    return { status: "done", driveFileId: data.id };
  }
  console.error("drive_upload_status", response.status);
  await discard(response);
  return { status: "rejected" };
}

export async function deleteDriveFile({ accessToken, fileId }) {
  const response = await googleFetch(
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  await discard(response);
}
