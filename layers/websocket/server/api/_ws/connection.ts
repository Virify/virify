import { useWebSocketServer } from "~~/layers/websocket/composables/useWebSocketServer";

// Initialize the WebSocket server composable
const { addPeer, removePeer, handleIncomingMessages } = useWebSocketServer();

// Cache conversation participant lookups per (userId, conversationId) to avoid a DB hit on
// every high-frequency typing / message_read frame. Entries expire after 60 seconds.
const participantCache = new Map<string, { otherParticipantId: number; expiresAt: number }>();
const PARTICIPANT_CACHE_TTL_MS = 60_000;
const PARTICIPANT_CACHE_CLEANUP_INTERVAL_MS = 10_000;
let lastParticipantCacheCleanupAt = 0;

function setCachedParticipant(key: string, value: { otherParticipantId: number; expiresAt: number }) {
  const now = Date.now();
  // Clean up memory periodically instead of on every cache write.
  if (now - lastParticipantCacheCleanupAt >= PARTICIPANT_CACHE_CLEANUP_INTERVAL_MS) {
    lastParticipantCacheCleanupAt = now;
    for (const [k, v] of participantCache) {
      if (v.expiresAt <= now) participantCache.delete(k);
    }
  }
  participantCache.set(key, value);
}

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

        const cacheKey = `${user.id}:${convId}`;
        const now = Date.now();
        let cached = participantCache.get(cacheKey);

        if (!cached || cached.expiresAt <= now) {
          const conversation = await prisma.conversation.findFirst({
            where: { id: convId, OR: [{ senderId: user.id }, { receiverId: user.id }] },
            select: { senderId: true, receiverId: true },
          });
          // Drop if sender is not a participant
          if (!conversation) return;
          const otherParticipantId = conversation.senderId === user.id
            ? conversation.receiverId
            : conversation.senderId;
          cached = { otherParticipantId, expiresAt: now + PARTICIPANT_CACHE_TTL_MS };
          setCachedParticipant(cacheKey, cached);
        }

        // Overwrite the client-supplied `to` field with the real other participant
        // — the client must never decide who receives their typing/read frames
        parsed.to = [cached.otherParticipantId];
      }

      // Forward the sanitized payload — parsed.to has been overwritten for typing/read msgs
      handleIncomingMessages(JSON.stringify(parsed), user.id!);
    } catch {
      // Invalid JSON — drop silently
      return;
    }
  },
});
