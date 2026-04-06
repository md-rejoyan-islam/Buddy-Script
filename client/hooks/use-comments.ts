"use client";

import { clientFetch } from "@/lib/client-api";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { Post } from "./use-feed";

export type Reply = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
  _count: { likes: number };
  likes: { id: string; reaction: string }[];
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
  _count: {
    replies: number;
    likes: number;
  };
  likes: { id: string; reaction: string }[];
};

type CommentsPage = {
  comments: Comment[];
  nextCursor: string | null;
};

export function useComments(postId: string) {
  return useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ limit: "10" });
      if (pageParam) params.set("cursor", pageParam);

      const res = await clientFetch<CommentsPage>(
        `/comments/post/${postId}?${params.toString()}`,
      );
      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to fetch comments");
      }
      return res.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!postId,
  });
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const res = await clientFetch(`/comments/post/${postId}`, {
        method: "POST",
        body: { content },
      });
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
    },
  });
}

export function useLikeComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      reaction = "like",
    }: {
      commentId: string;
      reaction?: string;
    }) => {
      const res = await clientFetch(`/likes/comment/${commentId}`, {
        method: "POST",
        body: { reaction },
      });
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onMutate: async ({ commentId, reaction = "like" }) => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      const previous = queryClient.getQueryData(["comments", postId]);

      queryClient.setQueryData(["comments", postId], (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        const data = old as {
          pages: { comments: Comment[]; nextCursor: string | null }[];
          pageParams: unknown[];
        };
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            comments: page.comments.map((c) => {
              if (c.id !== commentId) return c;
              const isLiked = c.likes.length > 0;
              const sameReaction = isLiked && c.likes[0]?.reaction === reaction;
              return {
                ...c,
                likes: sameReaction ? [] : [{ id: "optimistic", reaction }],
                _count: {
                  ...c._count,
                  likes: sameReaction
                    ? c._count.likes - 1
                    : isLiked
                      ? c._count.likes
                      : c._count.likes + 1,
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
        queryClient.setQueryData(["comments", postId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const res = await clientFetch(`/comments/${commentId}`, {
        method: "DELETE",
      });
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onMutate: async (commentId) => {
      // Optimistically remove from comments list
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });
      queryClient.setQueryData(["comments", postId], (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        const data = old as {
          pages: { comments: Comment[]; nextCursor: string | null }[];
          pageParams: unknown[];
        };
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            comments: page.comments.filter((c) => c.id !== commentId),
          })),
        };
      });

      // Optimistically decrement comment count on the post in the feed
      await queryClient.cancelQueries({ queryKey: ["posts", "feed"] });
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
            posts: page.posts.map((p) =>
              p.id !== postId
                ? p
                : {
                    ...p,
                    _count: {
                      ...p._count,
                      comments: Math.max(0, p._count.comments - 1),
                    },
                  },
            ),
          })),
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts", "feed"] });
    },
  });
}

export function useUpdateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => {
      const res = await clientFetch(`/comments/${commentId}`, {
        method: "PATCH",
        body: { content },
      });
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}

export function useReplies(commentId: string, enabled: boolean) {
  return useQuery({
    queryKey: ["replies", commentId],
    queryFn: async () => {
      const res = await clientFetch<Reply[]>(`/replies/comment/${commentId}`);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Failed to fetch replies");
      }
      return res.data;
    },
    enabled: enabled && !!commentId,
  });
}

export function useCreateReply(commentId: string, postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const res = await clientFetch(`/replies/comment/${commentId}`, {
        method: "POST",
        body: { content },
      });
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", commentId] });
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}

export function useDeleteReply(commentId: string, postId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (replyId: string) => {
      const res = await clientFetch(`/replies/${replyId}`, {
        method: "DELETE",
      });
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", commentId] });
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
  });
}

export function useUpdateReply(commentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      replyId,
      content,
    }: {
      replyId: string;
      content: string;
    }) => {
      const res = await clientFetch(`/replies/${replyId}`, {
        method: "PATCH",
        body: { content },
      });
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", commentId] });
    },
  });
}

export function useLikeReply(commentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      replyId,
      reaction = "like",
    }: {
      replyId: string;
      reaction?: string;
    }) => {
      const res = await clientFetch(`/likes/reply/${replyId}`, {
        method: "POST",
        body: { reaction },
      });
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onMutate: async ({ replyId, reaction = "like" }) => {
      await queryClient.cancelQueries({ queryKey: ["replies", commentId] });
      const previous = queryClient.getQueryData<Reply[]>([
        "replies",
        commentId,
      ]);

      queryClient.setQueryData<Reply[]>(["replies", commentId], (old) =>
        old?.map((r) => {
          if (r.id !== replyId) return r;
          const isLiked = r.likes.length > 0;
          const sameReaction = isLiked && r.likes[0]?.reaction === reaction;
          return {
            ...r,
            likes: sameReaction ? [] : [{ id: "optimistic", reaction }],
            _count: {
              ...r._count,
              likes: sameReaction
                ? r._count.likes - 1
                : isLiked
                  ? r._count.likes
                  : r._count.likes + 1,
            },
          };
        }),
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["replies", commentId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", commentId] });
    },
  });
}
