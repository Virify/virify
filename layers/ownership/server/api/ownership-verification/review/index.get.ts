import * as z from "zod";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const querySchema = z.object({
  token: z.string().min(1),
  action: z.enum(["approve", "deny"]),
});

/**
 * GET /api/ownership-verification/review?token=...&action=approve|deny
 * Token-based admin review endpoint. Returns JSON — the page at
 * /ownership/review/[token] is responsible for rendering the result.
 */
export default defineEventHandler(async (event) => {
  let action: "approve" | "deny";
  let token: string;

  try {
    ({ token, action } = await getValidatedQuery(event, querySchema.parse));
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request — missing or malformed token/action.",
    });
  }

  const record = await prisma.ownershipVerification.findUnique({
    where: { reviewToken: token },
    select: {
      id: true,
      draftListingId: true,
      userId: true,
      status: true,
      reviewTokenExpiry: true,
      docOneKey: true,
      docTwoKey: true,
    },
  });

  if (!record) {
    throw createError({
      statusCode: 404,
      statusMessage:
        "Verification record not found. The link may have expired or already been used.",
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
      statusCode: 409,
      statusMessage: `This verification has already been ${record.status === "APPROVED" ? "approved" : "denied"}.`,
    });
  }

  const newStatus = action === "approve" ? "APPROVED" : "DENIED";
  const newVerificationLevel =
    action === "approve" ? "FULLY_VERIFIED" : "UNVERIFIED";

  // Update verification status and draft listing in one transaction.
  // On approval, also mark name + identity as confirmed on the user's Verification record.
  await prisma.$transaction([
    prisma.ownershipVerification.update({
      where: { id: record.id },
      data: {
        status: newStatus,
        reviewedAt: new Date(),
        // Clear keys — documents will be deleted from R2 below
        docOneKey: null,
        docOneName: null,
        docTwoKey: null,
        docTwoName: null,
      },
    }),
    prisma.draftListing.update({
      where: { id: record.draftListingId },
      data: { verificationLevel: newVerificationLevel },
    }),
    ...(action === "approve" && record.userId
      ? [
          prisma.verification.upsert({
            where: { userId: record.userId },
            update: { name: true, identity: true },
            create: { userId: record.userId, name: true, identity: true },
          }),
        ]
      : []),
  ]);

  // Delete both documents from R2 after DB is committed.
  // Both approve and deny paths must delete — documents must never be retained post-review.
  const r2 = createR2Client(event);
  const bucket = getR2BucketName(event);
  const deletionErrors: string[] = [];

  const deleteKey = async (key: string | null, label: string) => {
    if (!key) {
      console.warn(
        `[OwnershipReview] Expected ${label} for listing #${record.draftListingId} but key was null — nothing to delete.`,
      );
      return;
    }
    try {
      await r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    } catch (err) {
      const msg = `Failed to delete ${label} (key: ${key}) for listing #${record.draftListingId}`;
      console.error(`[OwnershipReview] ${msg}:`, err);
      deletionErrors.push(msg);
    }
  };

  await Promise.all([
    deleteKey(record.docOneKey, "docOne"),
    deleteKey(record.docTwoKey, "docTwo"),
  ]);

  return {
    action,
    draftListingId: record.draftListingId,
    deletionWarning: deletionErrors.length > 0,
  };
});
