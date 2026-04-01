import { buildHeaders, createFetchWithRefresh } from "./fetch-utils";

let refreshPromise: Promise<Record<string, string> | null> | null = null;

export const clientFetch = createFetchWithRefresh({
  fetchFn: (endpoint, options) => {
    return fetch(`/api/v1${endpoint}`, {
      method: options.method || "GET",
      headers: buildHeaders(options),
      credentials: "include",
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  },

  refreshFn: async () => {
    // Deduplicate concurrent refresh calls
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      try {
        const res = await fetch("/api/v1/auth/refresh", {
          method: "POST",
          credentials: "include",
        });
        return res.ok ? {} : null;
      } catch {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },

  on401: () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
});
