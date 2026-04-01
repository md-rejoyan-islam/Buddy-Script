import Redis from "ioredis";
import { logger } from "../app/utils";
import secret from "./secret";

export const redis = new Redis(secret.redis_url, {
  maxRetriesPerRequest: 3,
});

redis.on("error", (err) => {
  logger.error(`Redis connection error: ${err.message}`);
});

redis.on("connect", () => {
  logger.info("Redis connected");
});
