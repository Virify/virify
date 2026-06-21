import * as z from "zod";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createNotification } from "~~/layers/database/server/utils/notification";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";
import {
  getVerificationByToken,
  applyOwnershipReview,
} from "~~/layers/database/server/utils/ownership-verification";
import { sendOwnershipResultEmail } from "~~/layers/ownership/server/email/send-ownership-result";

const querySchema = z.object({
  token: z.string().min(1),
  action: z.enum(["approve", "deny"]),
});

/**
 * GET /api/ownership-verification/review?token=...&action=approve|deny
 * Admin-only. Returns JSON — the page at /ownership/review/[token] is responsible
 * for rendering the result and firing this endpoint after confirming with the user.
 */
export default defineEventHandler(async (event) => {
  // Must be logged in and be an ADMIN
  const { user } = await requireUserSession(event);
  if (user.role !== "ADMIN") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

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

  const record = await getVerificationByToken(token);

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

  await applyOwnershipReview({
    id: record.id,
    draftListingId: record.draftListingId,
    userId: record.userId,
    action,
  });

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

  // Notify the listing owner about the review outcome.
  // - Online: send WS event only (toast + badge refresh). No DB record — avoids panel clutter.
  // - Offline: persist a DB notification AND send an email so they don't miss the result.
  if (record.userId) {
    const approved = action === "approve";
    const title = approved ? "Ownership verified" : "Ownership denied";
    const message =
      approved ?
        "Your ownership documents have been approved. Your listing is now fully verified."
      : "Your ownership documents could not be verified. Please re-submit with valid documents.";

    const { sendMessage, createOwnershipVerificationResultMessage, isUserOnline } =
      useWebSocketServer();

    if (isUserOnline(record.userId)) {
      // User is online — WS toast is enough, skip the DB record
      sendMessage(
        createOwnershipVerificationResultMessage(
          {
            title,
            message,
            type: approved ? "OWNERSHIP_VERIFIED" : "OWNERSHIP_DENIED",
            listingId: record.draftListingId,
          } as any,
          record.draftListingId,
          approved,
          record.userId,
        ),
      );
    } else {
      // User is offline — persist for the panel and send an email
      const config = useRuntimeConfig(event);
      const baseUrl =
        (config.public as any).siteUrl ??
        (config.public as any).EMAIL_BASE_URL ??
        "https://virify.co.uk";

      const owner = await prisma.user.findUnique({
        where: { id: record.userId },
        select: { email: true },
      });

      await Promise.all([
        createNotification({
          userId: record.userId,
          type: approved ? "OWNERSHIP_VERIFIED" : "OWNERSHIP_DENIED",
          title,
          message,
          listingId: record.draftListingId,
        }),
        owner?.email ?
          sendOwnershipResultEmail({
            to: owner.email,
            approved,
            draftListingId: record.draftListingId,
            baseUrl,
          })
        : Promise.resolve(),
      ]);
    }
  }

  return {
    action,
    draftListingId: record.draftListingId,
    deletionWarning: deletionErrors.length > 0,
  };
});
