import secret from "../../../config/secret";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { AppError, cache, createToken, verifyToken } from "../../utils";
import randomAvatar from "../../utils/random-avatar";
import { LoginInput, RegisterInput } from "./auth.validation";

export const authService = {
  async register(data: RegisterInput) {
    return await auth.api.signUpEmail({
      body: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        image: randomAvatar(),
        status: "ACTIVE",
      },
    });
  },

  async login(data: LoginInput) {
    const res = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });

    const { token: sessionToken, user } = res;

    const tokenPayload = { userId: user.id, email: user.email };

    const accessToken = createToken(tokenPayload, secret.access_token_expiry);
    const refreshToken = createToken(tokenPayload, secret.refresh_token_expiry);

    return { user, sessionToken, accessToken, refreshToken };
  },

  async getSession(token: string) {
    // Try better-auth's API first (handles hashed tokens)
    try {
      const session = await auth.api.getSession({
        headers: new Headers({
          cookie: `better-auth.session_token=${token}`,
        }),
      });

      if (session?.user && session?.session) {
        return {
          ...session.session,
          user: session.user,
        };
      }
    } catch {
      // Fallback to direct DB lookup (for raw tokens)
    }

    // Fallback: direct DB query (for our own session tokens)
    const dbSession = await prisma.session.findUnique({
      where: {
        token,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: { user: true },
    });

    if (!dbSession) {
      throw AppError.unauthorized("Invalid or expired session");
    }

    return dbSession;
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },
  async findById(id: string) {
    const cacheKey = `user:${id}`;
    const cached = await cache.get(cacheKey);
    if (cached) return cached;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (user) {
      await cache.set(cacheKey, user, 300); // 5 minutes
    }

    return user;
  },

  async refreshToken(refreshToken: string) {
    const payload = verifyToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      throw AppError.notFound("User not found");
    }

    const tokenPayload = { userId: user.id, email: user.email };
    const newAccessToken = createToken(
      tokenPayload,
      secret.access_token_expiry,
    );
    const newRefreshToken = createToken(
      tokenPayload,
      secret.refresh_token_expiry,
    );

    return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
  },
};
