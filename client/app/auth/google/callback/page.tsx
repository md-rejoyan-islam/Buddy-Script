"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { saveGoogleTokens } from "@/app/actions/auth";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const sessionToken = searchParams.get("sessionToken");
    const accessTokenMaxAge = searchParams.get("accessTokenMaxAge");
    const refreshTokenMaxAge = searchParams.get("refreshTokenMaxAge");
    const sessionTokenMaxAge = searchParams.get("sessionTokenMaxAge");

    if (success === "true" && accessToken && refreshToken && sessionToken) {
      saveGoogleTokens({
        accessToken,
        refreshToken,
        sessionToken,
        expiresIn: {
          accessToken: Number(accessTokenMaxAge) || 900000,
          refreshToken: Number(refreshTokenMaxAge) || 604800000,
          sessionToken: Number(sessionTokenMaxAge) || 604800000,
        },
      }).then((result) => {
        if (result.success) {
          toast.success("Logged in with Google successfully!");
          router.replace("/");
        } else {
          toast.error("Failed to save session");
          router.replace("/login");
        }
      });
    } else if (error) {
      toast.error("Google login failed. Please try again.");
      router.replace("/login");
    } else {
      router.replace("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="text-center">
      <div className="w-8 h-8 border-2 border-(--color5) border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-(--color7)">Completing login...</p>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <div className="min-h-screen bg-(--bg1) flex items-center justify-center">
      <Suspense
        fallback={
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-(--color5) border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-(--color7)">Loading...</p>
          </div>
        }
      >
        <GoogleCallbackContent />
      </Suspense>
    </div>
  );
}
