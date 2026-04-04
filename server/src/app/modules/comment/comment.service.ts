import { prisma } from "../../lib/prisma";
import { cache } from "../../utils";
import { CreateCommentInput, UpdateCommentInput } from "./comment.validation";

const COMMENTS_TTL = 120; // 2 minutes

export const commentService = {
  async create(postId: string, authorId: string, data: CreateCommentInput) {
    const comment = await prisma.comment.create({
      data: {
        ...data,
        postId,
        authorId,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, image: true },
        },
        _count: { select: { likes: true, replies: true } },
      },
    });

    // Invalidate feed (comment count changed) + comments cache
    await Promise.all([
      cache.delByPattern("feed:*"),
      cache.delByPattern(`comments:${postId}:*`),
    ]);

    return comment;
  },

  async getByPostId(postId: string, currentUserId: string) {
    const cacheKey = `comments:${postId}:${currentUserId}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const comments = await prisma.comment.findMany({
      where: { postId, isDeleted: false },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, image: true },
        },
        _count: { select: { likes: true, replies: true } },
        likes: {
          where: { userId: currentUserId, likeableType: "COMMENT" },
          select: { id: true, reaction: true },
        },
      },
    });

    await cache.set(cacheKey, comments, COMMENTS_TTL);

    return comments;
  },

  async update(commentId: string, authorId: string, data: UpdateCommentInput) {
    const comment = await prisma.comment.update({
      where: { id: commentId, authorId },
      data,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, image: true },
        },
        _count: { select: { likes: true, replies: true } },
      },
    });

    // Find the postId for cache invalidation
    const full = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { postId: true },
    });
    if (full) {
      await cache.delByPattern(`comments:${full.postId}:*`);
    }

    return comment;
  },

  async delete(commentId: string, authorId: string) {
    // Get postId before deleting
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { postId: true },
    });

    const result = await prisma.comment.update({
      where: { id: commentId, authorId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    // Invalidate feed (count changed) + comments cache
    if (comment) {
      await Promise.all([
        cache.delByPattern("feed:*"),
        cache.delByPattern(`comments:${comment.postId}:*`),
      ]);
    }

    return result;
  },
};
