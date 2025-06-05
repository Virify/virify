/**
 * GET /api/websocket/status
 * Get WebSocket service status
 */
export default defineEventHandler(async (event) => {
  // Ensure user is authenticated
  await requireUserSession(event);

  // For now, return basic status - we could enhance this later
  return {
    status: "active",
    activeUsers: 0, // Could implement this in the composable if needed
    timestamp: new Date().toISOString(),
  };
});
