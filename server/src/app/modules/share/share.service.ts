import { prisma } from "../../lib/prisma";
import { cache } from "../../utils";

const SHARES_TTL = 120; // 2 minutes

export const shareService = {
  async sharePost(userId: string, postId: string) {
    const existing = await prisma.share.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    if (existing) {
      return { alreadyShared: true };
    }

    await prisma.$transaction([
      prisma.share.create({
        data: { userId, postId },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { shareCount: { increment: 1 } },
      }),
    ]);

    // Invalidate feed (share count) + shares list + post cache
    await Promise.all([
      cache.delByPattern("feed:*"),
      cache.del(`shares:${postId}`),
      cache.delByPattern(`post:${postId}:*`),
    ]);

    return { alreadyShared: false };
  },

  async getShareUsers(postId: string) {
    const cacheKey = `shares:${postId}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const shares = await prisma.share.findMany({
      where: { postId },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    await cache.set(cacheKey, shares, SHARES_TTL);

    return shares;
  },
};
