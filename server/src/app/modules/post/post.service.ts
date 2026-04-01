import { AppError } from "../../utils";
import { prisma } from "../../lib/prisma";
import { CreatePostInput, UpdatePostInput } from "./post.validation";

export const postService = {
  async create(authorId: string, data: CreatePostInput) {
    return prisma.post.create({
      data: {
        ...data,
        authorId,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, image: true },
        },
        _count: { select: { likes: true, comments: true, shares: true } },
      },
    });
  },

  async getFeed(
    currentUserId: string,
    { cursor, limit = 10 }: { cursor?: string; limit?: number },
  ) {
    const posts = await prisma.post.findMany({
      where: {
        isDeleted: false,
        OR: [{ visibility: "PUBLIC" }, { authorId: currentUserId }],
      },
      orderBy: { createdAt: "desc" },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, image: true },
        },
        _count: { select: { likes: true, comments: true, shares: true } },
        likes: {
          where: { userId: currentUserId, likeableType: "POST" },
          select: { id: true, reaction: true },
        },
      },
    });

    const hasMore = posts.length > limit;
    const data = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    return { data, nextCursor };
  },

  async getById(postId: string, currentUserId: string) {
    return prisma.post.findFirst({
      where: {
        id: postId,
        isDeleted: false,
        OR: [{ visibility: "PUBLIC" }, { authorId: currentUserId }],
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, image: true },
        },
        _count: { select: { likes: true, comments: true, shares: true } },
        likes: {
          where: { userId: currentUserId, likeableType: "POST" },
          select: { id: true, reaction: true },
        },
      },
    });
  },

  async update(postId: string, authorId: string, data: UpdatePostInput) {
    return prisma.post.update({
      where: { id: postId, authorId },
      data,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, image: true },
        },
        _count: { select: { likes: true, comments: true, shares: true } },
      },
    });
  },

  async delete(postId: string, authorId: string) {
    const post = await prisma.post.findFirst({
      where: { id: postId, authorId, isDeleted: false },
    });

    if (!post) {
      throw AppError.notFound("Post not found or you are not the author");
    }

    return prisma.post.update({
      where: { id: postId },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  },
};
