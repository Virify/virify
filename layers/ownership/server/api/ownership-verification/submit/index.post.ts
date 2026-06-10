import * as z from "zod";
import sendOwnershipReview from "~~/layers/ownership/server/email/send-ownership-review";
import {
  getVerificationByDraftId,
  upsertOwnershipSubmission,
} from "~~/layers/database/server/utils/ownership-verification";

const submitSchema = z.object({
  draftListingId: z.number().int().positive(),
  docOneKey: z.string().min(1),
  docOneName: z.string().min(1),
  docTwoKey: z.string().min(1),
  docTwoName: z.string().min(1),
});

/**
 * POST /api/ownership-verification/submit
 * Record the uploaded doc keys for a specific draft listing and send a review email to the admin.
 * Upserts so re-submissions overwrite the previous attempt.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const config = useRuntimeConfig(event);

  const { draftListingId, docOneKey, docOneName, docTwoKey, docTwoName } =
    await readValidatedBody(event, submitSchema.parse);

  // Ensure the draft belongs to this user
  const draft = await prisma.draftListing.findUnique({
    where: { id: draftListingId, userId: user.id },
    select: { id: true },
  });

  if (!draft) {
    throw createError({
      statusCode: 404,
      statusMessage: "Draft listing not found",
    });
  }

  // Block re-submission if already PENDING or APPROVED
  const existing = await getVerificationByDraftId(draftListingId);

  if (existing?.status === "PENDING") {
    throw createError({
      statusCode: 409,
      statusMessage:
        "Your documents are already under review. Please wait for a decision before re-submitting.",
    });
  }
  if (existing?.status === "APPROVED") {
    throw createError({
      statusCode: 409,
      statusMessage: "Ownership for this listing is already verified.",
    });
  }

  const record = await upsertOwnershipSubmission({
    draftListingId,
    userId: user.id,
    docOneKey,
    docOneName,
    docTwoKey,
    docTwoName,
  });

  const baseUrl =
    (config.public as any).siteUrl ??
    (config.public as any).EMAIL_BASE_URL ??
    "https://virify.co.uk";
  const adminEmail = (config.ADMIN_EMAIL as string) || "all@virify.co.uk";

  await sendOwnershipReview({
    to: adminEmail,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    userEmail: user.email ?? "",
    draftListingId,
    reviewUrl: `${baseUrl}/ownership/review/${record.reviewToken}`,
  });

  return { success: true };
});
