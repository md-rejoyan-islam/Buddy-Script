import { setAuthCookies } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const success = params.get("success");
  const error = params.get("error");
  const accessToken = params.get("accessToken");
  const refreshToken = params.get("refreshToken");
  const sessionToken = params.get("sessionToken");
  const accessTokenMaxAge = params.get("accessTokenMaxAge");
  const refreshTokenMaxAge = params.get("refreshTokenMaxAge");
  const sessionTokenMaxAge = params.get("sessionTokenMaxAge");

  // In production behind a reverse proxy, req.nextUrl.origin is the internal
  // container host. Prefer forwarded headers, then env, then fall back.
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (forwardedHost
      ? `${forwardedProto}://${forwardedHost}`
      : req.nextUrl.origin);

  if (success === "true" && accessToken && refreshToken && sessionToken) {
    await setAuthCookies({
      accessToken,
      refreshToken,
      sessionToken,
      expiresIn: {
        accessToken: Number(accessTokenMaxAge) || 900000,
        refreshToken: Number(refreshTokenMaxAge) || 604800000,
        sessionToken: Number(sessionTokenMaxAge) || 604800000,
      },
    });

    return NextResponse.redirect(new URL("/", baseUrl));
  }

  if (error) {
    return NextResponse.redirect(
      new URL("/login?error=google_auth_failed", baseUrl),
    );
  }

  return NextResponse.redirect(new URL("/login", baseUrl));
}
