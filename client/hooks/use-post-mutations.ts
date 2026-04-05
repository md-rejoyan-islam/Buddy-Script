"use client";

import { clientFetch } from "@/lib/client-api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Post } from "./use-feed";

export function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      reaction = "like",
    }: {
      postId: string;
      reaction?: string;
    }) => {
      const res = await clientFetch(`/likes/post/${postId}`, {
        method: "POST",
        body: { reaction },
      });
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onMutate: async ({ postId, reaction = "like" }) => {
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
            posts: page.posts.map((post) => {
              if (post.id !== postId) return post;
              const isLiked = post.likes.length > 0;
              const sameReaction =
                isLiked && post.likes[0]?.reaction === reaction;
              return {
                ...post,
                likes: sameReaction ? [] : [{ id: "optimistic", reaction }],
                _count: {
                  ...post._count,
                  likes: sameReaction
                    ? post._count.likes - 1
                    : isLiked
                      ? post._count.likes
                      : post._count.likes + 1,
                },
              };
            }),
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

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch("/api/v1/posts", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to create post");
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
    },
  });
}

export function useUpdateVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      visibility,
    }: {
      postId: string;
      visibility: "PUBLIC" | "PRIVATE";
    }) => {
      const res = await clientFetch(`/posts/${postId}`, {
        method: "PATCH",
        body: { visibility },
      });
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onMutate: async ({ postId, visibility }) => {
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
              post.id !== postId ? post : { ...post, visibility },
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

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const res = await clientFetch(`/posts/${postId}`, { method: "DELETE" });
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
    },
  });
}
