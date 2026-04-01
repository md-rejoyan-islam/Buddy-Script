import app from "./app";
import { logger } from "./app/utils";
import { ensureBucket } from "./config/s3";
import secret from "./config/secret";

app.listen(secret.port, () => {
  logger.info(`Server is running on port ${secret.port}`);
});

// Initialize S3 bucket in background — don't block server startup
ensureBucket();
