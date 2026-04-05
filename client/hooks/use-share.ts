"use client";

import { clientFetch } from "@/lib/client-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Post } from "./use-feed";

export type ShareUser = {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
};

export function useShareUsers(postId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["shares", postId],
    queryFn: async () => {
      const res = await clientFetch<ShareUser[]>(`/shares/${postId}`);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to fetch shares");
      }
      return res.data;
    },
    enabled,
  });
}

export function useSharePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await clientFetch(`/shares/${postId}`, { method: "POST" });
      if (!res.success) throw new Error(res.message);
      return res.data as { alreadyShared?: boolean };
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts", "feed"] });
      const previous = queryClient.getQueryData(["posts", "feed"]);

      queryClient.setQueryData(["posts", "feed"], (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        const data = old as {
          pages: { posts: Post[]; nextCursor: string | null }[];
          pageParams: unknown[];
        };
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            posts: page.posts.map((post) =>
              post.id !== postId
                ? post
                : {
                    ...post,
                    _count: {
                      ...post._count,
                      shares: post._count.shares + 1,
                    },
                  },
            ),
          })),
        };
      });

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["posts", "feed"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
    },
  });
}
