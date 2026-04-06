import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";

// Initialize the WebSocket server composable
const { addPeer, removePeer, handleIncomingMessages } = useWebSocketServer();

export default defineWebSocketHandler({
  /**
   * Upgrade the connection to a secure one
   */
  async upgrade(request) {
    await requireUserSession(request);
  },

  /**
   * Open a new WebSocket connection
   */
  async open(peer) {
    const { user } = await requireUserSession(peer);
    addPeer(user.id!, peer);
  },

  /**
   * Handle WebSocket connection close
   */
  async close(peer) {
    try {
      const { user } = await requireUserSession(peer);
      removePeer(user.id!, peer);
    } catch (error) {
      console.warn("Failed to remove peer on close:", error);
    }
  },

  /**
   * Handle incoming WebSocket messages
   */
  async message(peer, message) {

    // manage ping/pong before authentication - we don't want to block the connection
    if (String(message) === "ping") {
      peer.send("pong");
      return;
    }
    const { user } = await requireUserSession(peer);

    // Guard against malicious client-crafted frames before passing to the handler.
    // Real-time message delivery (new_message) is HTTP-only — clients should never
    // send this type over WS. Typing/read-receipt indicators are legitimate but must
    // be scoped to conversations the sender actually participates in.
    try {
      const parsed = JSON.parse(String(message));
      const msgType = parsed?.type;

      if (msgType === "new_message") {
        // Silently drop — messages are created via the HTTP API only
        return;
      }

      if (msgType === "typing" || msgType === "message_read") {
        const convId = Number(parsed?.conversationId);
        if (!convId) return;
        const participant = await prisma.conversation.findFirst({
          where: { id: convId, OR: [{ senderId: user.id }, { receiverId: user.id }] },
          select: { id: true },
        });
        if (!participant) return;
      }
    } catch {
      // Invalid JSON — drop silently
      return;
    }

    // Process the message through the unified handler
    handleIncomingMessages(String(message), user.id!);
  },
});
