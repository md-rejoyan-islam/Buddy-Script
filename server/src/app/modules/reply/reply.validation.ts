import { z } from 'zod';

export const createReplySchema = z.object({
  params: z.object({
    commentId: z.string(),
  }),
  body: z.object({
    content: z.string().min(1),
  }),
});

export const updateReplySchema = z.object({
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    content: z.string().min(1),
  }),
});

export const replyIdParamSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const repliesByCommentSchema = z.object({
  params: z.object({
    commentId: z.string(),
  }),
});

export type CreateReplyInput = z.infer<typeof createReplySchema>['body'];
export type UpdateReplyInput = z.infer<typeof updateReplySchema>['body'];
