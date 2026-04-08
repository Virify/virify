import { S3Client } from "@aws-sdk/client-s3";
import type { H3Event } from "h3";

/**
 * Returns just the bucket name from CF_R2_BUCKET, which may be a full URL
 * (e.g. "https://…cloudflarestorage.com/bucket-name") or a plain name.
 */
export function getR2BucketName(event: H3Event): string {
  const raw = useRuntimeConfig(event).CF_R2_BUCKET as string;
  try {
    // If it's a valid URL, take the last non-empty path segment as the bucket name
    return new URL(raw).pathname.split("/").filter(Boolean).at(-1) ?? raw;
  } catch {
    return raw;
  }
}

/**
 * Create an S3Client configured for Cloudflare R2.
 * Call this inside an event handler where useRuntimeConfig() is available.
 */
export function createR2Client(event: H3Event): S3Client {
  const { CF_ACCOUNT_ID, CF_ACCESS_KEY, CF_SECRET_ACCESS_KEY } = useRuntimeConfig(event);

  return new S3Client({
    region: "auto",
    endpoint: `https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: CF_ACCESS_KEY as string,
      secretAccessKey: CF_SECRET_ACCESS_KEY as string,
    },
  });
}
