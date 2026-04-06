import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";
import path from "path";
import { S3_BUCKET, s3Client } from "../../config/s3";
import secret from "../../config/secret";

export async function uploadImage(
  file: Express.Multer.File,
  folder: string = "posts",
): Promise<string> {
  const ext = path.extname(file.originalname);
  const key = `${folder}/${crypto.randomUUID()}${ext}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    }),
  );

  return `${secret.s3_public_url}/${S3_BUCKET}/${key}`;
}

export async function deleteImage(imageUrl: string): Promise<void> {
  const bucketPrefix = `/${S3_BUCKET}/`;
  const idx = imageUrl.indexOf(bucketPrefix);
  if (idx === -1) return;

  const key = imageUrl.substring(idx + bucketPrefix.length);
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
    }),
  );
}
