import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * POST /api/ownership-verification/upload
 * Upload a single ownership document to R2 (private; no UserMedia DB record).
 * The filename includes the user's name so the admin can identify the owner.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const config = useRuntimeConfig(event);

  const r2 = createR2Client(event);
  const bucket = getR2BucketName(event);

  const parts = await readMultipartFormData(event);
  const filePart = parts?.find((p) => p.name === "file");

  if (!filePart?.data) {
    throw createError({ statusCode: 400, statusMessage: "No file provided" });
  }

  const mimeType = filePart.type ?? "application/octet-stream";
  const originalName = filePart.filename ?? "file";
  const fileBuffer = filePart.data;

  const ext = ALLOWED_MIME_TYPES[mimeType];
  if (!ext) {
    throw createError({
      statusCode: 422,
      statusMessage: `File type "${mimeType}" is not supported. Allowed: images (jpeg, png, webp), PDF, Word documents.`,
    });
  }

  if (fileBuffer.length > MAX_FILE_SIZE) {
    throw createError({ statusCode: 422, statusMessage: "File exceeds the 10 MB size limit." });
  }

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join("-") ||
    user.username ||
    `user-${user.id}`;
  const slugName = displayName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const key = `ownership-docs/${user.id}/${slugName}-${randomUUID()}.${ext}`;

  await r2.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
      ContentDisposition: `inline; filename="${originalName.replace(/"/g, "")}"`,
    }),
  );

  return {
    success: true,
    key,
    originalName,
    url: `${config.public.CF_R2_URL}/${key}`,
  };
});
