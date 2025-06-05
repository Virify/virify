import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";

/**
 * POST /api/websocket/connection
 * Manually trigger WebSocket connection (useful for admin/debugging)
 */
export default defineEventHandler(async (event) => {
  // Ensure user is authenticated
  const { user } = await requireUserSession(event);

  const { isUserOnline } = useWebSocketServer();

  // This would typically be handled by the WebSocket connection itself,
  // but this endpoint can be useful for testing or admin purposes
  return {
    message: "WebSocket connection endpoint ready",
    userId: user.id,
    isOnline: isUserOnline(user.id!),
    timestamp: new Date().toISOString(),
  };
});
