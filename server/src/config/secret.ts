import { z } from "zod";

const envSchema = z.object({
  // App
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Better Auth
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.url("BETTER_AUTH_URL must be a valid URL"),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),

  // S3 / MinIO
  S3_ENDPOINT: z.string().min(1, "S3_ENDPOINT is required"),
  S3_REGION: z.string().min(1, "S3_REGION is required"),
  S3_ACCESS_KEY: z.string().min(1, "S3_ACCESS_KEY is required"),
  S3_SECRET_KEY: z.string().min(1, "S3_SECRET_KEY is required"),
  S3_BUCKET: z.string().min(1, "S3_BUCKET is required"),

  // CORS
  CLIENT_WHITE_LIST: z.string().min(1, "CLIENT_WHITE_LIST is required"),
  CLIENT_URL: z
    .url("CLIENT_URL must be a valid URL")
    .default("http://localhost:3000"),

  // Redis
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues
    .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
    .join("\n");

  console.error(`\n❌ Missing or invalid environment variables:\n${missing}\n`);
  process.exit(1);
}

const env = parsed.data;

const secret = {
  port: env.PORT,
  node_env: env.NODE_ENV,

  // Token config
  access_token_expiry: "15m" as const,
  access_token_max_age: 15 * 60 * 1000, // 15 min
  refresh_token_expiry: "7d" as const,
  refresh_token_max_age: 7 * 24 * 60 * 60 * 1000, // 7 days
  session_token_max_age: 7 * 24 * 60 * 60 * 1000, // 7 days
  database_url: env.DATABASE_URL,
  better_auth_secret: env.BETTER_AUTH_SECRET,
  better_auth_url: env.BETTER_AUTH_URL,
  google_client_id: env.GOOGLE_CLIENT_ID,
  google_client_secret: env.GOOGLE_CLIENT_SECRET,
  s3_endpoint: env.S3_ENDPOINT,
  s3_region: env.S3_REGION,
  s3_access_key: env.S3_ACCESS_KEY,
  s3_secret_key: env.S3_SECRET_KEY,
  s3_bucket: env.S3_BUCKET,
  clientWhiteList: env.CLIENT_WHITE_LIST.split(",").map((url) => url.trim()),
  redis_url: env.REDIS_URL,
  client_url: env.CLIENT_URL,
} as const;

export default secret;
