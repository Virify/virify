import * as z from "zod";
import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";

const replySchema = z.object({
  conversationId: z.coerce.number(),
  message: z.string(),
});

export default defineEventHandler(async (event) => {
  console.log("🔥 API ENDPOINT HIT: /api/conversation/reply");

  const session = await requireUserSession(event);
  console.log("✅ User session retrieved:", session.user.id);

  try {
    const { conversationId, message } = await readValidatedBody(event, replySchema.parse);
    console.log("📝 Request body parsed:", { conversationId, message });

    const senderId = session.user.id;

    if (!senderId) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const newMessage = await replyToConversation(conversationId, message, senderId);
    console.log("💾 Message saved to DB:", newMessage.id);

    // Get WebSocket server instance
    console.log("🔌 Getting WebSocket server instance...");
    const { sendMessage } = useWebSocketServer();
    console.log("✅ WebSocket server instance retrieved");

    // Send the new message to the RECEIVER only (sender already has it from optimistic update)
    const receiverId = newMessage.senderId === senderId ? newMessage.receiverId : newMessage.senderId;
    console.log("🎯 Sender ID:", senderId);
    console.log("📧 Message sender ID:", newMessage.senderId);
    console.log("📧 Message receiver ID:", newMessage.receiverId);
    console.log("🎯 Calculated receiver ID:", receiverId);

    const messageToSend = {
      type: "new_message",
      to: [receiverId],
      from: senderId,
      conversationId: conversationId,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    console.log("🚀 Sending WebSocket message:", messageToSend);
    sendMessage(messageToSend);
    console.log("✅ WebSocket message sent");

    return newMessage;
  } catch (error) {
    console.error("Error replying to conversation:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
