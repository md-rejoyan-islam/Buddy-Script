import { z } from "zod";

export const createPostSchema = z.object({
  body: z.object({
    content: z.string().min(1),
    image: z.string().optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
  }),
});

export const updatePostSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    content: z.string().min(1).optional(),
    image: z.string().nullable().optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
  }),
});

export const postIdParamSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export type CreatePostInput = z.infer<typeof createPostSchema>["body"];
export type UpdatePostInput = z.infer<typeof updatePostSchema>["body"];
