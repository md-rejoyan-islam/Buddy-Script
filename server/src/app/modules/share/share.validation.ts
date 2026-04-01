import { z } from "zod";

export const sharePostSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
});

export const getSharesSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
});
