import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import secret from "../../config/secret";
import { UserStatus } from "../../generated/prisma/enums";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: secret.better_auth_secret,
  baseURL: secret.better_auth_url,
  user: {
    additionalFields: {
      status: {
        type: "string",
        required: false,
        enum: UserStatus,
        default: UserStatus.ACTIVE,
      },
      firstName: {
        type: "string",
        required: false,
        default: "",
      },
      lastName: {
        type: "string",
        required: false,
        default: "",
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Auto-fill firstName/lastName from name for social logins
          if (user.name && (!user.firstName || !user.lastName)) {
            const parts = user.name.split(" ");
            return {
              data: {
                ...user,
                firstName: user.firstName || parts[0] || "",
                lastName: user.lastName || parts.slice(1).join(" ") || "",
              },
            };
          }
          return { data: user };
        },
      },
    },
  },
  socialProviders: {
    google: {
      clientId: secret.google_client_id,
      clientSecret: secret.google_client_secret,
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh if older than 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // cache for 5 minutes
    },
  },
  trustedOrigins: ["http://localhost:3000", "http://localhost:5173"],
});
