import { prisma } from "../../lib/prisma";
import { cache } from "../../utils";
import { LikeableType } from "../../../generated/prisma/enums";

const LIKES_TTL = 120; // 2 minutes

export const likeService = {
  async togglePostLike(
    userId: string,
    postId: string,
    reaction: string = "like",
  ) {
    const existing = await prisma.like.findUnique({
      where: {
        userId_likeableType_postId: {
          userId,
          likeableType: "POST",
          postId,
        },
      },
    });

    let result;
    if (existing) {
      if (existing.reaction === reaction) {
        await prisma.like.delete({ where: { id: existing.id } });
        result = { liked: false, reaction: null };
      } else {
        const updated = await prisma.like.update({
          where: { id: existing.id },
          data: { reaction },
        });
        result = { liked: true, reaction: updated.reaction };
      }
    } else {
      const like = await prisma.like.create({
        data: { userId, postId, likeableType: "POST", reaction },
      });
      result = { liked: true, reaction: like.reaction };
    }

    // Invalidate feed (like count + recentLikers) + likes list
    await Promise.all([
      cache.delByPattern("feed:*"),
      cache.delByPattern(`post:${postId}:*`),
      cache.del(`likes:post:${postId}`),
    ]);

    return result;
  },

  async toggleCommentLike(
    userId: string,
    commentId: string,
    reaction: string = "like",
  ) {
    const existing = await prisma.like.findUnique({
      where: {
        userId_likeableType_commentId: {
          userId,
          likeableType: "COMMENT",
          commentId,
        },
      },
    });

    let result;
    if (existing) {
      if (existing.reaction === reaction) {
        await prisma.like.delete({ where: { id: existing.id } });
        result = { liked: false, reaction: null };
      } else {
        const updated = await prisma.like.update({
          where: { id: existing.id },
          data: { reaction },
        });
        result = { liked: true, reaction: updated.reaction };
      }
    } else {
      const like = await prisma.like.create({
        data: { userId, commentId, likeableType: "COMMENT", reaction },
      });
      result = { liked: true, reaction: like.reaction };
    }

    // Invalidate comments cache + likes list
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { postId: true },
    });
    await Promise.all([
      comment ? cache.delByPattern(`comments:${comment.postId}:*`) : Promise.resolve(),
      cache.del(`likes:comment:${commentId}`),
    ]);

    return result;
  },

  async toggleReplyLike(
    userId: string,
    replyId: string,
    reaction: string = "like",
  ) {
    const existing = await prisma.like.findUnique({
      where: {
        userId_likeableType_replyId: {
          userId,
          likeableType: "REPLY",
          replyId,
        },
      },
    });

    let result;
    if (existing) {
      if (existing.reaction === reaction) {
        await prisma.like.delete({ where: { id: existing.id } });
        result = { liked: false, reaction: null };
      } else {
        const updated = await prisma.like.update({
          where: { id: existing.id },
          data: { reaction },
        });
        result = { liked: true, reaction: updated.reaction };
      }
    } else {
      const like = await prisma.like.create({
        data: { userId, replyId, likeableType: "REPLY", reaction },
      });
      result = { liked: true, reaction: like.reaction };
    }

    // Invalidate replies cache + likes list
    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
      select: { commentId: true },
    });
    await Promise.all([
      reply ? cache.delByPattern(`replies:${reply.commentId}:*`) : Promise.resolve(),
      cache.del(`likes:reply:${replyId}`),
    ]);

    return result;
  },

  async getLikeUsers(type: string, id: string) {
    const cacheKey = `likes:${type}:${id}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const where: Record<string, unknown> = {
      likeableType: type.toUpperCase() as LikeableType,
    };

    if (type === "post") where.postId = id;
    else if (type === "comment") where.commentId = id;
    else if (type === "reply") where.replyId = id;

    const likes = await prisma.like.findMany({
      where,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    await cache.set(cacheKey, likes, LIKES_TTL);

    return likes;
  },
};
