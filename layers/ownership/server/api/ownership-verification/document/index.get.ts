import { GetObjectCommand } from "@aws-sdk/client-s3";
import * as z from "zod";

const querySchema = z.object({
  token: z.string().min(1),
  doc: z.enum(["one", "two"]),
});

/**
 * GET /api/ownership-verification/document?token=...&doc=one|two
 * Admin-only. Streams the requested ownership document directly from R2.
 * Access is gated by session auth — no expiring URLs needed.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (user.role !== "ADMIN") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  let token: string;
  let doc: "one" | "two";
  try {
    ({ token, doc } = await getValidatedQuery(event, querySchema.parse));
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid or missing query parameters.",
    });
  }

  const record = await prisma.ownershipVerification.findUnique({
    where: { reviewToken: token },
    select: {
      status: true,
      reviewTokenExpiry: true,
      docOneKey: true,
      docTwoKey: true,
    },
  });

  if (!record) {
    throw createError({
      statusCode: 404,
      statusMessage: "Verification record not found.",
    });
  }

  if (record.reviewTokenExpiry < new Date()) {
    throw createError({
      statusCode: 410,
      statusMessage: "This review link has expired.",
    });
  }

  if (record.status !== "PENDING") {
    throw createError({
      statusCode: 410,
      statusMessage: "Documents have already been deleted after review.",
    });
  }

  const key = doc === "one" ? record.docOneKey : record.docTwoKey;
  if (!key) {
    throw createError({
      statusCode: 404,
      statusMessage: "Document not found.",
    });
  }

  const r2 = createR2Client(event);
  const bucket = getR2BucketName(event);

  const response = await r2.send(
    new GetObjectCommand({ Bucket: bucket, Key: key }),
  );

  if (!response.Body) {
    throw createError({
      statusCode: 502,
      statusMessage: "Failed to retrieve document from storage.",
    });
  }

  // Forward content type and disposition so the browser opens it inline
  if (response.ContentType) {
    setResponseHeader(event, "Content-Type", response.ContentType);
  }
  if (response.ContentDisposition) {
    setResponseHeader(
      event,
      "Content-Disposition",
      response.ContentDisposition,
    );
  }

  // Read into a buffer and return — avoids stream type incompatibilities
  // Files are capped at 10 MB so this is safe
  const buffer = await response.Body.transformToByteArray();
  return Buffer.from(buffer);
});
