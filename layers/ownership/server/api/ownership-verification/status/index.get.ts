import * as z from "zod";
import { getVerificationByDraftId } from "~~/layers/database/server/utils/ownership-verification";

const querySchema = z.object({
  draftId: z.coerce.number().int().positive(),
});

/**
 * GET /api/ownership-verification/status?draftId=X
 * Returns the ownership verification record for a specific draft listing.
 */
export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { draftId } = await getValidatedQuery(event, querySchema.parse);

  // Ensure the draft belongs to this user
  const draft = await prisma.draftListing.findUnique({
    where: { id: draftId, userId: user.id },
    select: { id: true },
  });

  if (!draft) {
    throw createError({
      statusCode: 404,
      statusMessage: "Draft listing not found",
    });
  }

  const record = await getVerificationByDraftId(draftId);

  return { record };
});
