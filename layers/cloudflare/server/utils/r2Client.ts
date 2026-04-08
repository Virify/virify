// TODO: Remove debug logging once R2 staging credentials are confirmed working
import { S3Client } from "@aws-sdk/client-s3";
import type { H3Event } from "h3";

/**
 * Returns just the bucket name from CF_R2_BUCKET, which may be a full URL
 * (e.g. "https://…cloudflarestorage.com/bucket-name") or a plain name.
 */
export function getR2BucketName(event: H3Event): string {
  const raw = useRuntimeConfig(event).CF_R2_BUCKET as string;

  if (!raw) {
    console.error("[r2Client] Missing required env var: CF_R2_BUCKET");
    throw createError({
      statusCode: 500,
      message: "R2 configuration incomplete. Missing env var: CF_R2_BUCKET",
    });
  }

  try {
    // If it's a valid URL, take the last non-empty path segment as the bucket name
    const bucket = new URL(raw).pathname.split("/").filter(Boolean).at(-1) ?? raw;
    console.info("[r2Client] CF_R2_BUCKET resolved as URL, using bucket name:", bucket);
    return bucket;
  } catch {
    console.info("[r2Client] CF_R2_BUCKET resolved as plain name:", raw);
    return raw;
  }
}

/**
 * Create an S3Client configured for Cloudflare R2.
 * Call this inside an event handler where useRuntimeConfig() is available.
 */
export function createR2Client(event: H3Event): S3Client {
  const { CF_ACCOUNT_ID, CF_ACCESS_KEY, CF_SECRET_ACCESS_KEY } = useRuntimeConfig(event);

  // Log which R2 config vars are missing (never log values - only presence)
  const missing = (
    [
      ["CF_ACCOUNT_ID", CF_ACCOUNT_ID],
      ["CF_ACCESS_KEY", CF_ACCESS_KEY],
      ["CF_SECRET_ACCESS_KEY", CF_SECRET_ACCESS_KEY],
    ] as [string, unknown][]
  )
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (missing.length) {
    console.error("[r2Client] Missing required env vars:", missing.join(", "));
    throw createError({
      statusCode: 500,
      message: `R2 configuration incomplete. Missing env vars: ${missing.join(", ")}`,
    });
  }

  console.info("[r2Client] Creating S3Client with endpoint: https://<CF_ACCOUNT_ID>.r2.cloudflarestorage.com, all credentials present");

  return new S3Client({
    region: "auto",
    endpoint: `https://${CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: CF_ACCESS_KEY as string,
      secretAccessKey: CF_SECRET_ACCESS_KEY as string,
    },
  });
}
