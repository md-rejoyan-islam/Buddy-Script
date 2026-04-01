import { NextFunction, Request, Response } from "express";
import { AppError, getCookie, verifyToken } from "../utils";

const checkAuth =
  (...AuthRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    // Primary auth: JWT access token
    const accessToken = getCookie(req, "access_token");
    if (!accessToken) {
      throw AppError.unauthorized("No access token provided.");
    }

    try {
      const payload = verifyToken(accessToken);
      req.user = {
        id: payload.userId,
        email: payload.email,
      };
    } catch {
      throw AppError.unauthorized("Invalid or expired access token.");
    }

    // Optional: check session expiry for warning headers
    const sessionCookie =
      getCookie(req, "better_auth.session_token") ||
      getCookie(req, "better-auth.session_token") ||
      getCookie(req, "__Secure-better-auth.session_token");

    if (sessionCookie) {
      try {
        const { auth } = await import("../lib/auth");
        const session = await auth.api.getSession({
          headers: new Headers({ cookie: req.headers.cookie || "" }),
        });

        if (session?.session) {
          const now = new Date();
          const expiredAt = new Date(session.session.expiresAt);
          const createdAt = new Date(session.session.createdAt);
          const sessionLifeSpan = expiredAt.getTime() - createdAt.getTime();
          const timeLeft = expiredAt.getTime() - now.getTime();
          const timeLeftPercentage = (timeLeft / sessionLifeSpan) * 100;

          if (timeLeftPercentage < 20) {
            res.setHeader("X-Session-Expiring-Soon", "true");
            res.setHeader("X-Session-Expiry-Time", expiredAt.toISOString());
            res.setHeader("X-Session-Time-Remaining", timeLeft.toString());
          }
        }
      } catch {
        // Session check is optional — don't block the request
      }
    }

    next();
  };

export default checkAuth;
