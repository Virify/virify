import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";

/**
 * GET /api/websocket/connections
 * Get active WebSocket connections count
 */
export default defineEventHandler(async (event) => {
  // Ensure user is authenticated
  const { user } = await requireUserSession(event);

  const { isUserOnline } = useWebSocketServer();

  return {
    totalConnections: 0, // Could implement peer count in composable if needed
    userConnections: isUserOnline(user.id!) ? 1 : 0,
  };
});
