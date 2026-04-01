import Redis from "ioredis";
import { logger } from "../app/utils";
import secret from "./secret";

export const redis = new Redis({
  host: secret.redis_host,
  port: secret.redis_port,
  password: secret.redis_password,
  db: secret.redis_db,
  maxRetriesPerRequest: 3,
});

redis.on("error", (err) => {
  logger.error(`Redis connection error: ${err.message}`);
});

redis.on("connect", () => {
  logger.info("Redis connected");
});
