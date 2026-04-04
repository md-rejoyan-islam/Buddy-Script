import { prisma } from "../../lib/prisma";
import { cache } from "../../utils";
import { CreateReplyInput, UpdateReplyInput } from "./reply.validation";

const REPLIES_TTL = 120; // 2 minutes

export const replyService = {
  async create(commentId: string, authorId: string, data: CreateReplyInput) {
    const reply = await prisma.reply.create({
      data: {
        ...data,
        commentId,
        authorId,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, image: true },
        },
        _count: { select: { likes: true } },
      },
    });

    // Invalidate replies + comments cache (reply count changed)
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { postId: true },
    });
    await Promise.all([
      cache.delByPattern(`replies:${commentId}:*`),
      comment ? cache.delByPattern(`comments:${comment.postId}:*`) : Promise.resolve(),
    ]);

    return reply;
  },

  async getByCommentId(commentId: string, currentUserId: string) {
    const cacheKey = `replies:${commentId}:${currentUserId}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const replies = await prisma.reply.findMany({
      where: { commentId, isDeleted: false },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, image: true },
        },
        _count: { select: { likes: true } },
        likes: {
          where: { userId: currentUserId, likeableType: "REPLY" },
          select: { id: true, reaction: true },
        },
      },
    });

    await cache.set(cacheKey, replies, REPLIES_TTL);

    return replies;
  },

  async update(replyId: string, authorId: string, data: UpdateReplyInput) {
    const reply = await prisma.reply.update({
      where: { id: replyId, authorId },
      data,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, image: true },
        },
        _count: { select: { likes: true } },
      },
    });

    const full = await prisma.reply.findUnique({
      where: { id: replyId },
      select: { commentId: true },
    });
    if (full) {
      await cache.delByPattern(`replies:${full.commentId}:*`);
    }

    return reply;
  },

  async delete(replyId: string, authorId: string) {
    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
      select: { commentId: true },
    });

    const result = await prisma.reply.update({
      where: { id: replyId, authorId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    if (reply) {
      const comment = await prisma.comment.findUnique({
        where: { id: reply.commentId },
        select: { postId: true },
      });
      await Promise.all([
        cache.delByPattern(`replies:${reply.commentId}:*`),
        comment ? cache.delByPattern(`comments:${comment.postId}:*`) : Promise.resolve(),
      ]);
    }

    return result;
  },
};
