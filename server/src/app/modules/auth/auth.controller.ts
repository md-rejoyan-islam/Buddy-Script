import { Request, Response } from "express";
import secret from "../../../config/secret";
import {
  asyncHandler,
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

  loginWithGoogle: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.loginWithGoogle(req.body);
    sendSuccessResponse(res, {
      message: "Login with Google successful",
      data: user,
    });
  }),
};
