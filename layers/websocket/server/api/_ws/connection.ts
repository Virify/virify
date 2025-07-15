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

    // Handle heartbeat ping messages with pong response

    // Process the message through the unified handler
    handleIncomingMessages(String(message), user.id!);
  },
});
