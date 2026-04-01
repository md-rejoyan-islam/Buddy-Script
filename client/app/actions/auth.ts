"use server";

import {
  apiProxy,
  deleteAuthCookies,
  getAccessToken,
  setAuthCookies,
} from "@/lib/api";
import type { LoginFormData, RegisterFormData } from "@/lib/validations/auth";

type ActionResult = {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
};

export async function loginAction(
  formData: LoginFormData,
): Promise<ActionResult> {
  const result = await apiProxy<{
    data: {
      user: Record<string, unknown>;
      accessToken: string;
      refreshToken: string;
      sessionToken: string;
    };
  }>("/api/v1/auth/login", {
    method: "POST",
    body: formData,
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Invalid email or password",
    };
  }

  const data = result.data as Record<string, unknown>;
  const nested = (data?.data || data) as Record<string, unknown>;

  const sessionToken = nested?.sessionToken as string | undefined;
  const accessToken = nested?.accessToken as string | undefined;
  const refreshToken = nested?.refreshToken as string | undefined;
  const expiresIn = nested?.expiresIn as {
    accessToken: number;
    refreshToken: number;
    sessionToken: number;
  } | undefined;

  if (sessionToken && accessToken && refreshToken && expiresIn) {
    await setAuthCookies({ sessionToken, accessToken, refreshToken, expiresIn });
  }

  return {
    success: true,
    message: "Login successful",
    data,
  };
}

export async function registerAction(
  formData: RegisterFormData,
): Promise<ActionResult> {
  const { confirmPassword: _, terms: __, ...body } = formData;

  const result = await apiProxy("/api/v1/auth/register", {
    method: "POST",
    body,
  });

  if (!result.success) {
    return {
      success: false,
      message: result.message || "Registration failed",
    };
  }

  return {
    success: true,
    message: "Account created successfully",
    data: result.data as Record<string, unknown>,
  };
}

export async function saveGoogleTokens(tokens: {
  accessToken: string;
  refreshToken: string;
  sessionToken: string;
  expiresIn: {
    accessToken: number;
    refreshToken: number;
    sessionToken: number;
  };
}): Promise<ActionResult> {
  await setAuthCookies(tokens);
  return { success: true, message: "Tokens saved" };
}

export async function logoutAction(): Promise<ActionResult> {
  await deleteAuthCookies();
  return { success: true, message: "Logged out successfully" };
}

export async function getMe(): Promise<ActionResult> {
  const token = await getAccessToken();
  if (!token) {
    return { success: false, message: "Not authenticated" };
  }

  const result = await apiProxy<{
    user: Record<string, unknown>;
    session: Record<string, unknown>;
  }>("/api/v1/auth/me");

  if (!result.success) {
    return { success: false, message: "Session expired" };
  }

  return {
    success: true,
    message: "User fetched",
    data: result.data as Record<string, unknown>,
  };
}
