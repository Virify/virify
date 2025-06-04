/**
 * GET /api/websocket/connections
 * Get active WebSocket connections count
 */
export default defineEventHandler(async (event) => {
  // Ensure user is authenticated
  const { user } = await requireUserSession(event);

  const { peers } = await import("../../../utils/websocket-broadcaster");
  
  return {
    totalConnections: peers.size,
    userConnections: peers.get(user.id!)?.size || 0,
  };
});
