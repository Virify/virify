import { addPeer, removePeer, sendTypingNotification, sendMessageReadNotification } from "~~/layers/communication/server/utils/websocket-broadcaster";
import type { OutgoingWebSocketMessage } from "~~/shared/types/websocket";

export type Peer = {
  send: (message: string) => void;
  close: () => void;
};

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
      // User session expired or invalid
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

    try {
      const parsed: OutgoingWebSocketMessage = JSON.parse(String(message));

      switch (parsed.type) {
        case "typing":
          sendTypingNotification(parsed.conversationId, user.id!, parsed.toUserId, parsed.isTyping);
          break;

        case "message_read":
          sendMessageReadNotification(parsed.conversationId, parsed.messageId, user.id!, parsed.toUserId);
          break;

        default:
          console.warn(`Unknown WebSocket message type from user ${user.id}:`, parsed);
      }
    } catch (error) {
      console.error(`Error parsing WebSocket message from user ${user.id}:`, error);
    }
  },
});
