import * as z from "zod";
import sendOwnershipReview from "~~/layers/ownership/server/email/send-ownership-review";

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
  const existing = await prisma.ownershipVerification.findUnique({
    where: { draftListingId },
    select: { status: true },
  });

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

  const record = await prisma.ownershipVerification.upsert({
    where: { draftListingId },
    update: {
      docOneKey,
      docOneName,
      docTwoKey,
      docTwoName,
      status: "PENDING",
      reviewedAt: null,
    },
    create: {
      draftListingId,
      userId: user.id,
      docOneKey,
      docOneName,
      docTwoKey,
      docTwoName,
    },
  });

  const baseUrl =
    (config.public as any).siteUrl ??
    (config.public as any).EMAIL_BASE_URL ??
    "https://virify.co.uk";
  const r2Url = config.public.CF_R2_URL as string;
  const adminEmail = (config.ADMIN_EMAIL as string) || "all@virify.co.uk";

  await sendOwnershipReview({
    to: adminEmail,
    firstName: user.firstName ?? null,
    lastName: user.lastName ?? null,
    userEmail: user.email ?? "",
    draftListingId,
    docOneUrl: `${r2Url}/${docOneKey}`,
    docOneName,
    docTwoUrl: `${r2Url}/${docTwoKey}`,
    docTwoName,
    approveUrl: `${baseUrl}/ownership/review/${record.reviewToken}?action=approve`,
    denyUrl: `${baseUrl}/ownership/review/${record.reviewToken}?action=deny`,
  });

  return { success: true };
});
