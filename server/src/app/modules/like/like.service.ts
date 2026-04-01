import { prisma } from '../../lib/prisma';
import { LikeableType } from '../../../generated/prisma/enums';

export const likeService = {
  async togglePostLike(userId: string, postId: string, reaction: string = "like") {
    const existing = await prisma.like.findUnique({
      where: { userId_likeableType_postId: { userId, likeableType: 'POST', postId } },
    });

    if (existing) {
      // If same reaction, unlike. If different reaction, update it.
      if (existing.reaction === reaction) {
        await prisma.like.delete({ where: { id: existing.id } });
        return { liked: false, reaction: null };
      }
      const updated = await prisma.like.update({
        where: { id: existing.id },
        data: { reaction },
      });
      return { liked: true, reaction: updated.reaction };
    }

    const like = await prisma.like.create({
      data: { userId, postId, likeableType: 'POST', reaction },
    });
    return { liked: true, reaction: like.reaction };
  },

  async toggleCommentLike(userId: string, commentId: string, reaction: string = "like") {
    const existing = await prisma.like.findUnique({
      where: { userId_likeableType_commentId: { userId, likeableType: 'COMMENT', commentId } },
    });

    if (existing) {
      if (existing.reaction === reaction) {
        await prisma.like.delete({ where: { id: existing.id } });
        return { liked: false, reaction: null };
      }
      const updated = await prisma.like.update({
        where: { id: existing.id },
        data: { reaction },
      });
      return { liked: true, reaction: updated.reaction };
    }

    const like = await prisma.like.create({
      data: { userId, commentId, likeableType: 'COMMENT', reaction },
    });
    return { liked: true, reaction: like.reaction };
  },

  async toggleReplyLike(userId: string, replyId: string, reaction: string = "like") {
    const existing = await prisma.like.findUnique({
      where: { userId_likeableType_replyId: { userId, likeableType: 'REPLY', replyId } },
    });

    if (existing) {
      if (existing.reaction === reaction) {
        await prisma.like.delete({ where: { id: existing.id } });
        return { liked: false, reaction: null };
      }
      const updated = await prisma.like.update({
        where: { id: existing.id },
        data: { reaction },
      });
      return { liked: true, reaction: updated.reaction };
    }

    const like = await prisma.like.create({
      data: { userId, replyId, likeableType: 'REPLY', reaction },
    });
    return { liked: true, reaction: like.reaction };
  },

  async getLikeUsers(type: string, id: string) {
    const where: Record<string, unknown> = {
      likeableType: type.toUpperCase() as LikeableType,
    };

    if (type === 'post') where.postId = id;
    else if (type === 'comment') where.commentId = id;
    else if (type === 'reply') where.replyId = id;

    return prisma.like.findMany({
      where,
      include: {
        user: { select: { id: true, firstName: true, lastName: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};
