import { writable, get } from "svelte/store";

const clientID = "6018520211999359850";

interface SuccessResponse<T> {
  success: true;
  result: T;
}

interface ErrorResponse {
  success: false;
  error: string;
}

export type ResponseType<T> = SuccessResponse<T> | ErrorResponse;
export const token = writable<string | null>(null);
export const userID = writable<number | null>(null);

const refreshToken = localStorage.getItem("tpt2-refresh_token");
if (refreshToken) {
  refreshAccessToken(refreshToken).then((success) => {
    if (!success) {
      localStorage.removeItem("tpt2-refresh_token");
    }
  });
}

async function generatePKCEPair() {
  const NUM_OF_BYTES = 32; // Total of 44 characters (1 Bytes = 2 char) (standard states that: 43 chars <= verifier <= 128 chars)
  const HASH_ALG = "SHA-256";
  const randomVerifier = crypto.getRandomValues(new Uint8Array(NUM_OF_BYTES));
  const base64Verifier = btoa(String.fromCharCode(...randomVerifier))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const encoder = new TextEncoder();
  const data = encoder.encode(base64Verifier);
  const hashBuffer = await crypto.subtle.digest(HASH_ALG, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const base64Challenge = btoa(String.fromCharCode(...hashArray))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return { verifier: base64Verifier, challenge: base64Challenge };
}

export default async function authenticate() {
  const url = "https://apis.roblox.com/oauth/v1/authorize";
  const { verifier, challenge } = await generatePKCEPair();
  const params = new URLSearchParams({
    client_id: clientID,
    redirect_uri: (location.origin + location.pathname).replace(/\/$/, ""),
    scope: "asset:read asset:write",
    response_type: "code",
    code_challenge: challenge,
    code_challenge_method: "S256",
    state: verifier,
  });

  location.href = `${url}?${params.toString()}`;
}

export async function refresh(params: URLSearchParams): Promise<boolean> {
  const url = "https://apis.roblox.com/oauth/v1/token";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  const json = await response.json();
  if (response.ok) {
    token.set(json.access_token);
    if (json.refresh_token) {
      localStorage.setItem("tpt2-refresh_token", json.refresh_token);
    }
    await getUserID();
    return true;
  } else {
    if (json.error === "invalid_grant") {
      localStorage.removeItem("tpt2-refresh_token");
      token.set(null);
    }
    return false;
  }
}

export async function verifyCode(
  code: string,
  state: string
): Promise<boolean> {
  return await refresh(
    new URLSearchParams({
      client_id: clientID,
      grant_type: "authorization_code",
      code: code,
      code_verifier: state,
    })
  );
}

export async function refreshAccessToken(refreshToken?: string) {
  if (!refreshToken) {
    refreshToken = localStorage.getItem("tpt2-refresh_token") ?? undefined;
    if (!refreshToken) return false;
  }
  return await refresh(
    new URLSearchParams({
      client_id: clientID,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    })
  );
}

export async function getUserID() {
  if (get(userID) !== null) return get(userID);

  const t = get(token);
  if (t === null) return null;
  const URL = "https://apis.roblox.com/oauth/v1/token/resources";
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${t}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ client_id: clientID, token: t }).toString(),
  });
  const json = await response.json();

  if (
    response.ok &&
    json.resource_infos?.length > 0 &&
    json.resource_infos[0].owner
  ) {
    const id: number = json.resource_infos[0].owner.id;
    userID.set(id);
    return id;
  }
}
