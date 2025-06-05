import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";
import type { WebSocketMessage } from "~~/shared/types/websocket";

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
    console.log("🚀 WebSocket connection opened");
    const { user } = await requireUserSession(peer);
    console.log("👤 User connected:", user.id);
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
      // User session expired or invalid - ignore
      console.warn("Failed to remove peer on close:", error);
    }
  },

  /**
   * Handle incoming WebSocket messages
   */
  async message(peer, message) {
    const { user } = await requireUserSession(peer);

    // Ignore heartbeat ping messages
    if (String(message) === "ping") {
      return;
    }

    // Process the message through the unified handler
    handleIncomingMessages(String(message), user.id!);
  },
});
