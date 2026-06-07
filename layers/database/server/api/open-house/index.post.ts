import * as z from "zod";
import { createOpenHouseSession } from "~~/layers/database/server/utils/open-house";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const schema = z.object({
  listingId: z.coerce.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  startTime: z.string().regex(timeRegex, "Start time must be HH:mm"),
  endTime: z.string().regex(timeRegex, "End time must be HH:mm"),
  slotMins: z.coerce.number().int().min(5).max(60).default(15),
});

/** Owner-only: create an open house session for one of their published listings */
export default defineEventHandler(async (event) => {
  const { errorResponse } = useResponse();
  const { user } = await requireUserSession(event);

  try {
    if (!user.id) throw createError({ statusCode: 401 });

    const { listingId, date, startTime, endTime, slotMins } =
      await readValidatedBody(event, schema.parse);

    // Verify the listing is published and owned by this user
    const listing = await prisma.listing.findFirst({
      where: {
        id: listingId,
        userId: user.id as number,
        published: true,
        archived: false,
      },
      select: { id: true },
    });
    if (!listing)
      throw createError({
        statusCode: 403,
        statusMessage: "Listing not found or not published",
      });

    // Validate start < end
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    if (sh! * 60 + sm! >= eh! * 60 + em!) {
      throw createError({
        statusCode: 400,
        statusMessage: "Start time must be before end time",
      });
    }

    // Validate date is in the future
    const dateObj = new Date(date + "T12:00:00.000Z");
    if (dateObj < new Date())
      throw createError({
        statusCode: 400,
        statusMessage: "Open house date must be in the future",
      });

    const session = await createOpenHouseSession(
      listingId,
      dateObj,
      startTime,
      endTime,
      slotMins,
    );
    return session;
  } catch (error) {
    return errorResponse(error, event);
  }
});
