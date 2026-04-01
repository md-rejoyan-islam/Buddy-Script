import { cookies } from "next/headers";
import {
  COOKIE_KEYS,
  buildHeaders,
  createFetchWithRefresh,
} from "./fetch-utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const IS_PRODUCTION = process.env.NODE_ENV === "production";

const cookieOpts = {
  httpOnly: true,
  secure: IS_PRODUCTION,
  sameSite: "lax" as const,
  path: "/",
};

// ─── Cookie helpers ────────────────────────────────

export async function setAuthCookies(tokens: {
  sessionToken: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: {
    accessToken: number;
    refreshToken: number;
    sessionToken: number;
  };
}) {
  const c = await cookies();
  // maxAge from server is in ms, cookies().set expects seconds
  c.set(COOKIE_KEYS.session, tokens.sessionToken, { ...cookieOpts, maxAge: Math.floor(tokens.expiresIn.sessionToken / 1000) });
  c.set(COOKIE_KEYS.access, tokens.accessToken, { ...cookieOpts, maxAge: Math.floor(tokens.expiresIn.accessToken / 1000) });
  c.set(COOKIE_KEYS.refresh, tokens.refreshToken, { ...cookieOpts, maxAge: Math.floor(tokens.expiresIn.refreshToken / 1000) });
}

export const getSessionToken = async () => (await cookies()).get(COOKIE_KEYS.session)?.value;
export const getAccessToken = async () => (await cookies()).get(COOKIE_KEYS.access)?.value;
export const getRefreshToken = async () => (await cookies()).get(COOKIE_KEYS.refresh)?.value;

export async function deleteAuthCookies() {
  const c = await cookies();
  c.delete(COOKIE_KEYS.session);
  c.delete(COOKIE_KEYS.access);
  c.delete(COOKIE_KEYS.refresh);
}

// ─── Build cookie header with optional overrides ───

async function cookieHeader(overrides?: Record<string, string>): Promise<string> {
  const map = new Map<string, string>();
  for (const c of (await cookies()).getAll()) map.set(c.name, c.value);
  if (overrides) for (const [k, v] of Object.entries(overrides)) map.set(k, v);
  return [...map.entries()].map(([k, v]) => `${k}=${v}`).join("; ");
}

// ─── Server-side API proxy ─────────────────────────

export const apiProxy = createFetchWithRefresh({
  fetchFn: async (endpoint, options, extraHeaders) => {
    const cookie = await cookieHeader(extraHeaders);
    return fetch(`${API_URL}${endpoint}`, {
      method: options.method || "GET",
      headers: buildHeaders(options, { Cookie: cookie }),
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: "include",
    });
  },

  refreshFn: async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return null;

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `${COOKIE_KEYS.refresh}=${refreshToken}`,
        },
      });

      if (!res.ok) return null;

      const { data } = await res.json();
      if (!data?.accessToken) return null;

      // Save new tokens for future requests — use expiresIn from server (ms → seconds)
      const c = await cookies();
      const accessMaxAge = data.expiresIn?.accessToken ? Math.floor(data.expiresIn.accessToken / 1000) : 60 * 15;
      const refreshMaxAge = data.expiresIn?.refreshToken ? Math.floor(data.expiresIn.refreshToken / 1000) : 60 * 60 * 24 * 7;

      c.set(COOKIE_KEYS.access, data.accessToken, { ...cookieOpts, maxAge: accessMaxAge });
      if (data.refreshToken) {
        c.set(COOKIE_KEYS.refresh, data.refreshToken, { ...cookieOpts, maxAge: refreshMaxAge });
      }

      // Return overrides for the retry fetch
      return {
        [COOKIE_KEYS.access]: data.accessToken,
        ...(data.refreshToken && { [COOKIE_KEYS.refresh]: data.refreshToken }),
      };
    } catch {
      return null;
    }
  },
});
