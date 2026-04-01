import { prisma } from '../../lib/prisma';

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

    return { alreadyShared: false };
  },

  async getShareUsers(postId: string) {
    return prisma.share.findMany({
      where: { postId },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, image: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },
};
