export type FetchOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  status: number;
};

export const COOKIE_KEYS = {
  session: "better_auth.session_token",
  access: "access_token",
  refresh: "refresh_token",
} as const;

// ─── Shared helpers ────────────────────────────────

export function buildHeaders(
  options: FetchOptions,
  extra?: Record<string, string>,
): Record<string, string> {
  return {
    "Content-Type": "application/json",
    ...extra,
    ...options.headers,
  };
}

export function parseResponse<T>(
  res: Response,
  json: Record<string, unknown>,
): ApiResponse<T> {
  if (!res.ok) {
    return {
      success: false,
      message: (json.message as string) || "Request failed",
      status: res.status,
    };
  }
  return {
    success: true,
    data: (json.data ?? json) as T,
    message: json.message as string,
    status: res.status,
  };
}

export function errorResponse<T>(
  message = "Unable to connect to server",
): ApiResponse<T> {
  return { success: false, message, status: 500 };
}

// ─── Fetch with auto-refresh ───────────────────────

type FetchFn = (
  endpoint: string,
  options: FetchOptions,
  extraHeaders?: Record<string, string>,
) => Promise<Response>;

type RefreshFn = () => Promise<Record<string, string> | null>;

type On401Fn = () => void;

export function createFetchWithRefresh(config: {
  fetchFn: FetchFn;
  refreshFn: RefreshFn;
  on401?: On401Fn;
}) {
  return async function <T = unknown>(
    endpoint: string,
    options: FetchOptions = {},
  ): Promise<ApiResponse<T>> {
    try {
      let res = await config.fetchFn(endpoint, options);

      if (res.status === 401) {
        const newHeaders = await config.refreshFn();

        if (newHeaders) {
          res = await config.fetchFn(endpoint, options, newHeaders);
        } else {
          config.on401?.();
          return { success: false, message: "Session expired", status: 401 };
        }
      }

      const json = await res.json();
      return parseResponse<T>(res, json);
    } catch {
      return errorResponse<T>();
    }
  };
}
