"use client";

import { clientFetch } from "@/lib/client-api";
import { useQuery } from "@tanstack/react-query";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string | null;
};

export function useCurrentUser() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const res = await clientFetch<User>("/auth/me");
      if (!res.success || !res.data) {
        throw new Error(res.message || "Not authenticated");
      }
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });
}
