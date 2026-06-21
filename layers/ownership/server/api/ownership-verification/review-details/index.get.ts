import * as z from "zod";
import { getVerificationByToken } from "~~/layers/database/server/utils/ownership-verification";

const querySchema = z.object({
  token: z.string().min(1),
});

/**
 * GET /api/ownership-verification/review-details?token=...
 * Admin-only. Returns verification metadata for the review page.
 * Documents are fetched separately via /api/ownership-verification/document.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  if (user.role !== "ADMIN") {
    throw createError({ statusCode: 403, statusMessage: "Forbidden" });
  }

  let token: string;
  try {
    ({ token } = await getValidatedQuery(event, querySchema.parse));
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid or missing token.",
    });
  }

  const record = await getVerificationByToken(token);

  if (!record) {
    throw createError({
      statusCode: 404,
      statusMessage: "Verification record not found.",
    });
  }

  if (record.reviewTokenExpiry && record.reviewTokenExpiry < new Date()) {
    throw createError({
      statusCode: 410,
      statusMessage: "This review link has expired.",
    });
  }

  if (record.status !== "PENDING") {
    return {
      alreadyReviewed: true,
      status: record.status,
      draftListingId: record.draftListingId,
    };
  }

  const submitter = await prisma.user.findUnique({
    where: { id: record.userId },
    select: { firstName: true, lastName: true, email: true },
  });

  return {
    alreadyReviewed: false,
    draftListingId: record.draftListingId,
    submittedAt: record.createdAt,
    submitter: {
      firstName: submitter?.firstName ?? null,
      lastName: submitter?.lastName ?? null,
      email: submitter?.email ?? null,
    },
    docOne: { name: record.docOneName, hasFile: !!record.docOneKey },
    docTwo: { name: record.docTwoName, hasFile: !!record.docTwoKey },
  };
});
