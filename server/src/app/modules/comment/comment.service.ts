import { prisma } from '../../lib/prisma';
import { CreateCommentInput, UpdateCommentInput } from './comment.validation';

export const commentService = {
  async create(postId: string, authorId: string, data: CreateCommentInput) {
    return prisma.comment.create({
      data: {
        ...data,
        postId,
        authorId,
      },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, image: true } },
        _count: { select: { likes: true, replies: true } },
      },
    });
  },

  async getByPostId(postId: string, currentUserId: string) {
    return prisma.comment.findMany({
      where: { postId, isDeleted: false },
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, image: true } },
        _count: { select: { likes: true, replies: true } },
        likes: {
          where: { userId: currentUserId, likeableType: 'COMMENT' },
          select: { id: true, reaction: true },
        },
      },
    });
  },

  async update(commentId: string, authorId: string, data: UpdateCommentInput) {
    return prisma.comment.update({
      where: { id: commentId, authorId },
      data,
      include: {
        author: { select: { id: true, firstName: true, lastName: true, image: true } },
        _count: { select: { likes: true, replies: true } },
      },
    });
  },

  async delete(commentId: string, authorId: string) {
    return prisma.comment.update({
      where: { id: commentId, authorId },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  },
};
