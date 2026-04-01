import { Request, Response } from "express";
import secret from "../../config/secret";

const IS_PRODUCTION = secret.node_env === "production";
const DEFAULT_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

type CookieOptions = {
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  path?: string;
};

/**
 * Set a cookie on the response
 */
export function setCookie(
  res: Response,
  name: string,
  value: string,
  options: CookieOptions = {},
) {
  res.cookie(name, value, {
    httpOnly: options.httpOnly ?? true,
    secure: options.secure ?? IS_PRODUCTION,
    sameSite: options.sameSite ?? "lax",
    maxAge: options.maxAge ?? DEFAULT_MAX_AGE,
    path: options.path ?? "/",
  });
}

/**
 * Get a cookie value from the request
 */
export function getCookie(req: Request, name: string): string | undefined {
  return req.cookies?.[name];
}

/**
 * Remove a cookie from the response
 */
export function removeCookie(res: Response, name: string) {
  res.clearCookie(name, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "none",
    path: "/",
  });
}
