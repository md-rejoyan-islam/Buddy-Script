import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutBucketPolicyCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { logger } from "../app/utils";
import secret from "./secret";

export const s3Client = new S3Client({
  endpoint: secret.s3_endpoint,
  region: secret.s3_region,
  credentials: {
    accessKeyId: secret.s3_access_key,
    secretAccessKey: secret.s3_secret_key,
  },
  forcePathStyle: true, // required for MinIO, works with S3 too
});

export const S3_BUCKET = secret.s3_bucket;

export async function ensureBucket() {
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: S3_BUCKET }));
    logger.info(`S3 bucket "${S3_BUCKET}" already exists`);
  } catch {
    await s3Client.send(new CreateBucketCommand({ Bucket: S3_BUCKET }));
    logger.info(`S3 bucket "${S3_BUCKET}" created`);
  }

  // Always apply public read policy so images are accessible
  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${S3_BUCKET}/*`],
      },
    ],
  };

  await s3Client.send(
    new PutBucketPolicyCommand({
      Bucket: S3_BUCKET,
      Policy: JSON.stringify(policy),
    }),
  );
  logger.info(`S3 bucket "${S3_BUCKET}" public read policy applied`);
}
