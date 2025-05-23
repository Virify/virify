import * as z from "zod";
import { createConversation } from "~~/layers/database/server/utils/conversation";

const conversationSchema = z.object({
  listingId: z.coerce.number(),
  receiverId: z.coerce.number(),
  message: z.string(),
});
export default defineEventHandler(async (event) => {
  try {
    const session = await requireUserSession(event);
  const { listingId, receiverId, message } = await readValidatedBody(event, conversationSchema.parse);

  const userId = session.user.id;

  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }
  const conversation = await createConversation(listingId, userId, receiverId, message);
  return conversation;
  } catch (error) {
    console.error("Error creating or updating conversation:", error);
  }
});
