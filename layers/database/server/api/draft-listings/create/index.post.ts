import * as z from 'zod';
import { ListingTier } from '../../../database/prisma/generated/enums';

const CreateSchema = z.object({
    tier: z.enum(ListingTier),
  });

export default defineEventHandler(async (event) => {
  const { tier } = await readValidatedBody(event, CreateSchema.parse);
  const { user } = await requireUserSession(event);
  const { errorResponse } = useResponse();

  try {
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const createdListing = await createDraftListing(user.id, tier);
    return createdListing;
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
});