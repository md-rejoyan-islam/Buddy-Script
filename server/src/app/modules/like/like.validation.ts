import { z } from 'zod';

const reactionEnum = z.enum(["like", "love", "haha", "sad", "wow", "angry"]).default("like");

export const likePostSchema = z.object({
  params: z.object({
    postId: z.string(),
  }),
  body: z.object({
    reaction: reactionEnum,
  }).optional(),
});

export const likeCommentSchema = z.object({
  params: z.object({
    commentId: z.string(),
  }),
  body: z.object({
    reaction: reactionEnum,
  }).optional(),
});

export const likeReplySchema = z.object({
  params: z.object({
    replyId: z.string(),
  }),
  body: z.object({
    reaction: reactionEnum,
  }).optional(),
});

export const getLikesSchema = z.object({
  params: z.object({
    type: z.enum(['post', 'comment', 'reply']),
    id: z.string(),
  }),
});
