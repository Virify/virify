/**
 * GET /api/websocket/status
 * Get WebSocket service status
 */
export default defineEventHandler(async (event) => {
  // Ensure user is authenticated
  await requireUserSession(event);

  const { peers } = await import("../../../utils/websocket-broadcaster");
  
  return {
    status: "active",
    activeUsers: peers.size,
    timestamp: new Date().toISOString(),
  };
});
