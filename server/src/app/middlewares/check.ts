import { NextFunction, Request, Response } from "express";
import { authService } from "../modules/auth/auth.service";
import { AppError, getCookie, verifyToken } from "../utils";

const checkAuth =
  (...AuthRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const sesstionCookies = getCookie(req, "better_auth.session_token");

    if (!sesstionCookies) {
      throw AppError.unauthorized("No session token provided.");
    }

    if (sesstionCookies) {
      const sessionExist = await authService.getSession(sesstionCookies);
      const now = new Date();
      const expiredAt = new Date(sessionExist.expiresAt);
      const createdAt = new Date(sessionExist.createdAt);
      const sessionLifeSpan = expiredAt.getTime() - createdAt.getTime();
      const timeLeft = expiredAt.getTime() - now.getTime();
      const timeLeftPercentage = (timeLeft / sessionLifeSpan) * 100;
      if (timeLeftPercentage < 20) {
        res.setHeader("X-Session-Expiring-Soon", "true");
        res.setHeader("X-Session-Expiry-Time", expiredAt.toISOString());
        res.setHeader("X-Session-Time-Remaining", timeLeft.toString());
      }
    }

    const accessToken = getCookie(req, "access_token");
    if (!accessToken) {
      throw AppError.unauthorized("No access token provided.");
    }

    try {
      const verify = verifyToken(accessToken);
      req.user = {
        id: verify.userId,
        email: verify.email,
      };
    } catch (error) {
      throw AppError.unauthorized("Invalid or expired access token.");
    }

    next();
  };

export default checkAuth;
