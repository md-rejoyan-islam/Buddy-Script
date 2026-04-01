import { prisma } from '../../lib/prisma';
import { CreateReplyInput, UpdateReplyInput } from './reply.validation';

export const replyService = {
  async create(commentId: string, authorId: string, data: CreateReplyInput) {
    return prisma.reply.create({
      data: {
        ...data,
        commentId,
        authorId,
      },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, image: true } },
        _count: { select: { likes: true } },
      },
    });
  },

  async getByCommentId(commentId: string, currentUserId: string) {
    return prisma.reply.findMany({
      where: { commentId, isDeleted: false },
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, image: true } },
        _count: { select: { likes: true } },
        likes: {
          where: { userId: currentUserId, likeableType: 'REPLY' },
          select: { id: true, reaction: true },
        },
      },
    });
  },

  async update(replyId: string, authorId: string, data: UpdateReplyInput) {
    return prisma.reply.update({
      where: { id: replyId, authorId },
      data,
      include: {
        author: { select: { id: true, firstName: true, lastName: true, image: true } },
        _count: { select: { likes: true } },
      },
    });
  },

  async delete(replyId: string, authorId: string) {
    return prisma.reply.update({
      where: { id: replyId, authorId },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  },
};
