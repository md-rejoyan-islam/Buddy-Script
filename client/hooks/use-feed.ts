"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { clientFetch } from "@/lib/client-api";

export type PostAuthor = {
  id: string;
  firstName: string;
  lastName: string;
  image: string | null;
};

export type Post = {
  id: string;
  content: string;
  image: string | null;
  visibility: "PUBLIC" | "PRIVATE";
  createdAt: string;
  updatedAt: string;
  author: PostAuthor;
  _count: {
    likes: number;
    comments: number;
    shares: number;
  };
  likes: { id: string; reaction: string }[];
  recentLikers: { id: string; firstName: string; lastName: string; image: string | null }[];
};

type FeedResponse = {
  posts: Post[];
  nextCursor: string | null;
};

export function useFeed() {
  return useInfiniteQuery({
    queryKey: ["posts", "feed"],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ limit: "10" });
      if (pageParam) params.set("cursor", pageParam);

      const res = await clientFetch<FeedResponse>(
        `/posts?${params.toString()}`,
      );

      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to fetch feed");
      }

      return res.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
