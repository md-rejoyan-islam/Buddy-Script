import { Request, Response } from "express";
import secret from "../../../config/secret";
import {
  asyncHandler,
  createToken,
  getCookie,
  removeCookie,
  sendSuccessResponse,
  setCookie,
} from "../../utils";
import { authService } from "./auth.service";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.register(req.body);
    sendSuccessResponse(res, {
      statusCode: 201,
      message: "User registered successfully",
      data: user,
    });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, sessionToken, accessToken, refreshToken } =
      await authService.login(req.body);

    setCookie(res, "better_auth.session_token", sessionToken, {
      maxAge: secret.session_token_max_age,
    });
    setCookie(res, "access_token", accessToken, {
      maxAge: secret.access_token_max_age,
    });
    setCookie(res, "refresh_token", refreshToken, {
      maxAge: secret.refresh_token_max_age,
    });

    sendSuccessResponse(res, {
      message: "Login successful",
      data: {
        user,
        accessToken,
        refreshToken,
        sessionToken,
        expiresIn: {
          accessToken: secret.access_token_max_age,
          refreshToken: secret.refresh_token_max_age,
          sessionToken: secret.session_token_max_age,
        },
      },
    });
  }),

  getMe: asyncHandler(async (req: Request, res: Response) => {
    // const sessionToken =
    //   req.cookies?.["better-auth.session_token"] ||
    //   req.headers.authorization?.replace("Bearer ", "");

    // if (!sessionToken) {
    //   res.status(401).json({ success: false, message: "Unauthorized" });
    //   return;
    // }

    // const session = await authService.getSession(sessionToken);

    const session = req.user;
    const user = await authService.findById(session?.id!);

    console.log("Session in getMe:", session);

    sendSuccessResponse(res, {
      message: "User fetched successfully",
      data: { ...user },
    });
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const token = getCookie(req, "refresh_token");

    if (!token) {
      res.status(401).json({ success: false, message: "No refresh token" });
      return;
    }

    try {
      const { user, accessToken, refreshToken } =
        await authService.refreshToken(token);

      setCookie(res, "access_token", accessToken, {
        maxAge: secret.access_token_max_age,
      });
      setCookie(res, "refresh_token", refreshToken, {
        maxAge: secret.refresh_token_max_age,
      });

      sendSuccessResponse(res, {
        message: "Token refreshed",
        data: {
          user,
          accessToken,
          refreshToken,
          expiresIn: {
            accessToken: secret.access_token_max_age,
            refreshToken: secret.refresh_token_max_age,
          },
        },
      });
    } catch {
      removeCookie(res, "access_token");
      removeCookie(res, "refresh_token");
      removeCookie(res, "better_auth.session_token");
      res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }
  }),

  googleRedirect: asyncHandler(async (req: Request, res: Response) => {
    const callbackURL = `${secret.better_auth_url}/api/v1/auth/google/callback`;

    const response = await fetch(
      `${secret.better_auth_url}/api/auth/sign-in/social`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "google", callbackURL }),
        redirect: "manual",
      },
    );

    // better-auth returns JSON with { url, redirect: true }
    if (response.ok) {
      const data = await response.json();
      if (data.url) {
        // Forward the state cookie from better-auth to the browser
        const setCookies = response.headers.getSetCookie?.() || [];
        for (const cookie of setCookies) {
          res.setHeader("Set-Cookie", cookie);
        }
        res.redirect(data.url);
        return;
      }
    }

    const clientUrl = secret.clientWhiteList[0] || "http://localhost:3000";
    res.redirect(`${clientUrl}/login?error=google_init_failed`);
  }),

  googleCallback: asyncHandler(async (req: Request, res: Response) => {
    // After better-auth handles Google OAuth, the session cookie is set.
    // Try all possible cookie names better-auth might use.
    const sessionToken =
      getCookie(req, "better-auth.session_token") ||
      getCookie(req, "better_auth.session_token") ||
      getCookie(req, "__Secure-better-auth.session_token") ||
      req.cookies?.["better-auth.session_token"] ||
      req.cookies?.["better_auth.session_token"];

    const clientUrl = secret.client_url;

    if (!sessionToken) {
      console.log(
        "Google callback - No session token found. Cookies:",
        req.cookies,
      );
      res.redirect(`${clientUrl}/login?error=google_auth_failed`);
      return;
    }

    // Use better-auth API directly with all raw cookies from the request
    const { auth } = await import("../../lib/auth");
    const allCookies = req.headers.cookie || "";

    const betterAuthSession = await auth.api.getSession({
      headers: new Headers({ cookie: allCookies }),
    });

    if (!betterAuthSession?.user) {
      console.log(
        "Google callback - better-auth getSession failed. Cookie header:",
        allCookies,
      );
      res.redirect(`${clientUrl}/login?error=session_invalid`);
      return;
    }

    const session = {
      ...betterAuthSession.session,
      user: betterAuthSession.user,
    };
    const user = session.user;
    const tokenPayload = { userId: user.id, email: user.email };

    const accessToken = createToken(tokenPayload, secret.access_token_expiry);
    const refreshToken = createToken(tokenPayload, secret.refresh_token_expiry);

    setCookie(res, "better_auth.session_token", sessionToken, {
      maxAge: secret.session_token_max_age,
    });
    setCookie(res, "access_token", accessToken, {
      maxAge: secret.access_token_max_age,
    });
    setCookie(res, "refresh_token", refreshToken, {
      maxAge: secret.refresh_token_max_age,
    });

    res.redirect(`${clientUrl}/auth/google/callback?success=true`);
  }),
};
