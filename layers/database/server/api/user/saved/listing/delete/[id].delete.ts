import * as zod from "zod";

const deleteSchema = zod.object({
  listingId: zod.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const session = await requireUserSession(event);
  const userId = session?.user?.id;

  try {

    if (!userId) throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
    
    const { listingId } = await readValidatedBody(event, deleteSchema.parse);

    if (!listingId) throw createError({ statusCode: 400, statusMessage: "Bad Request", message: "No listing provided" });

    const result = await deleteFavouriteListing(userId as number, listingId);

    return result;
  } catch (error) {
    console.log(error);
    return errorResponse(error, event);
  }
}
);