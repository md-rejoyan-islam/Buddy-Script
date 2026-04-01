"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const success = searchParams.get("success");
    const error = searchParams.get("error");

    if (success === "true") {
      toast.success("Logged in with Google successfully!");
      router.replace("/");
    } else if (error) {
      toast.error("Google login failed. Please try again.");
      router.replace("/login");
    } else {
      router.replace("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-(--bg1) flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-(--color5) border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-(--color7)">Completing login...</p>
      </div>
    </div>
  );
}
