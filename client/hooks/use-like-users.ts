"use client";

import { clientFetch } from "@/lib/client-api";
import { useQuery } from "@tanstack/react-query";

export type LikeUser = {
  id: string;
  reaction: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
};

export function useLikeUsers(type: string, id: string, enabled: boolean) {
  return useQuery({
    queryKey: ["likes", type, id],
    queryFn: async () => {
      const res = await clientFetch<LikeUser[]>(`/likes/${type}/${id}`);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to fetch likes");
      }
      return res.data;
    },
    enabled,
  });
}
