import { prisma } from "../../lib/prisma";
import { AppError, cache } from "../../utils";
import { CreatePostInput, UpdatePostInput } from "./post.validation";

const FEED_TTL = 60; // 1 minute
const POST_TTL = 120; // 2 minutes

export const postService = {
  async create(authorId: string, data: CreatePostInput) {
    const post = await prisma.post.create({
      data: {
        ...data,
        authorId,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, image: true },
        },
        _count: { select: { likes: true, comments: { where: { isDeleted: false } }, shares: true } },
      },
    });

    // Invalidate all feed caches
    await cache.delByPattern("feed:*");

    return post;
  },

  async getFeed(
    currentUserId: string,
    { cursor, limit = 10 }: { cursor?: string; limit?: number },
  ) {
    const cacheKey = `feed:${currentUserId}:${cursor || "first"}:${limit}`;
    const cached = await cache.get<{
      data: unknown[];
      nextCursor: string | null;
    }>(cacheKey);
    if (cached) return cached;

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
        _count: { select: { likes: true, comments: { where: { isDeleted: false } }, shares: true } },
        likes: {
          where: { userId: currentUserId, likeableType: "POST" },
          select: { id: true, reaction: true },
        },
      },
    });

    const hasMore = posts.length > limit;
    const sliced = hasMore ? posts.slice(0, limit) : posts;
    const nextCursor = hasMore ? sliced[sliced.length - 1].id : null;

    // Fetch recent likers (up to 5) for each post
    const postIds = sliced.map((p) => p.id);
    const recentLikes = await prisma.like.findMany({
      where: { postId: { in: postIds }, likeableType: "POST" },
      select: {
        postId: true,
        user: {
          select: { id: true, firstName: true, lastName: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group by postId and take first 5 per post
    const likersByPost = new Map<string, typeof recentLikes>();
    for (const like of recentLikes) {
      if (!like.postId) continue;
      const arr = likersByPost.get(like.postId) || [];
      if (arr.length < 5) arr.push(like);
      likersByPost.set(like.postId, arr);
    }

    const data = sliced.map((post) => ({
      ...post,
      recentLikers: (likersByPost.get(post.id) || []).map((l) => l.user),
    }));

    const result = { data, nextCursor };
    await cache.set(cacheKey, result, FEED_TTL);

    return result;
  },

  async getById(postId: string, currentUserId: string) {
    const cacheKey = `post:${postId}:${currentUserId}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const post = await prisma.post.findFirst({
      where: {
        id: postId,
        isDeleted: false,
        OR: [{ visibility: "PUBLIC" }, { authorId: currentUserId }],
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, image: true },
        },
        _count: { select: { likes: true, comments: { where: { isDeleted: false } }, shares: true } },
        likes: {
          where: { userId: currentUserId, likeableType: "POST" },
          select: { id: true, reaction: true },
        },
      },
    });

    if (!post) return null;

    // Fetch recent likers (up to 5)
    const recentLikes = await prisma.like.findMany({
      where: { postId, likeableType: "POST" },
      select: {
        user: {
          select: { id: true, firstName: true, lastName: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const result = {
      ...post,
      recentLikers: recentLikes.map((l) => l.user),
    };

    await cache.set(cacheKey, result, POST_TTL);

    return result;
  },

  async update(postId: string, authorId: string, data: UpdatePostInput) {
    const post = await prisma.post.update({
      where: { id: postId, authorId },
      data,
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, image: true },
        },
        _count: { select: { likes: true, comments: { where: { isDeleted: false } }, shares: true } },
      },
    });

    // Invalidate feed + post caches
    await Promise.all([
      cache.delByPattern("feed:*"),
      cache.delByPattern(`post:${postId}:*`),
    ]);

    return post;
  },

  async delete(postId: string, authorId: string) {
    const post = await prisma.post.findFirst({
      where: { id: postId, authorId, isDeleted: false },
    });

    if (!post) {
      throw AppError.notFound("Post not found or you are not the author");
    }

    const result = await prisma.post.update({
      where: { id: postId },
      data: { isDeleted: true, deletedAt: new Date() },
    });

    // Invalidate feed + post caches
    await Promise.all([
      cache.delByPattern("feed:*"),
      cache.delByPattern(`post:${postId}:*`),
    ]);

    return result;
  },
};
