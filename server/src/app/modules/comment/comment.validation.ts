import { z } from "zod";

export const createCommentSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
  body: z.object({
    content: z.string().min(1),
  }),
});

export const updateCommentSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    content: z.string().min(1),
  }),
});

export const commentIdParamSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const commentsByPostSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>["body"];
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>["body"];
