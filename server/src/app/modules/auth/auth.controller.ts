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
      res.status(401).json({ success: false, message: "Invalid refresh token" });
    }
  }),

  googleCallback: asyncHandler(async (req: Request, res: Response) => {
    // After better-auth handles Google OAuth, the session cookie is set.
    // Read it and create our custom JWT tokens.
    const sessionToken = getCookie(req, "better-auth.session_token");

    if (!sessionToken) {
      res.redirect(`${process.env.CLIENT_WHITE_LIST?.split(",")[0] || "http://localhost:3000"}/login?error=google_auth_failed`);
      return;
    }

    const session = await authService.getSession(sessionToken);
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

    const clientUrl = process.env.CLIENT_WHITE_LIST?.split(",")[0] || "http://localhost:3000";
    res.redirect(`${clientUrl}/auth/google/callback?success=true`);
  }),
};
