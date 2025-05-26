export type Peer = {
  send: (message: string) => void;
  close: () => void;
};

const peers = new Map<number, Set<Peer>>();

export default defineWebSocketHandler({
  /**
   * Upgade the connection to a secure one
   * @param request request
   */
  async upgrade(request) {
    await requireUserSession(request);
  },

  /**
   * Open a new WebSocket connection
   *
   * @param peer WebSocket
   */
  async open(peer) {
    const { user } = await requireUserSession(peer);
    // track a peer connection for the user
    addPeer(user.id!, peer);
  },

  /**
   * Message event handler
   *
   * @param peer WebSocket
   * @param message string
   */
  async message(peer, message) {
    const { user } = await requireUserSession(peer);
    // ignore the heartbeat ping messages
    if (String(message) === "ping") {
      return;
    }
    console.log(`Received message from user ${user.id}: ${message}`);
    // Handle typing event
    try {
      const parsed = JSON.parse(String(message));
      if (parsed.type === "typing" && parsed.to) {
        sendTypingEventToPeer(user.id!, parsed.to);
        return;
      }
      if (parsed.type === "read" && parsed.to && parsed.messageId) {
        sendReadReceiptToPeer(user.id!, parsed.to, parsed.messageId);
        return;
      }
    } catch (e) {
      // Not JSON or not a typing/read event, continue
    }
    sendMessageToPeer(message);
  },
});

/**
 * Adds a peer WebSocket to the user's set of active connections.
 * If the user has no peers yet, a new Set is created.
 *
 * @param userId number
 * @param peer WebSocket
 */
function addPeer(userId: number, peer: Peer) {
  if (!peers.has(userId)) {
    peers.set(userId, new Set());
  }
  peers.get(userId)!.add(peer);
}

/**
 * Find a peer WebSocket by user ID.
 *
 * @param userId User ID
 * @returns Peer
 */
function findPeers(userId: number): Set<Peer> | undefined {
  return peers.get(userId);
}

/**
 * Send a message to a specific peer.
 *
 * @param message
 */
function sendMessageToPeer(message: any) {
  const parsedMessage = JSON.parse(message);
  const recipientId = parsedMessage.to;
  
  // find the recipient peers in the map
  const recipientPeers = findPeers(recipientId);
  if (!recipientPeers) {
    console.log(`No peers found for recipient ${recipientId}`);
    return;
  }
  
  // Send the complete message object instead of just the content
  console.log(`Sending message to peer ${recipientId}:`, parsedMessage);
  for (const peer of recipientPeers) {
    peer.send(JSON.stringify(parsedMessage));
  }
}

/**
 * Send a typing event to a specific peer.
 *
 * @param fromUserId Sender's user ID
 * @param recipientId Recipient's user ID
 */
function sendTypingEventToPeer(fromUserId: number, recipientId: number) {
  const recipientPeers = findPeers(recipientId);
  if (!recipientPeers) {
    console.log(`No peers found for recipient ${recipientId}`);
    return;
  }
  const typingPayload = JSON.stringify({ type: "typing", from: fromUserId });
  for (const peer of recipientPeers) {
    peer.send(typingPayload);
  }
}

/**
 * Send a read receipt to a specific peer.
 *
 * @param fromUserId Sender's user ID
 * @param recipientId Recipient's user ID
 * @param messageId The ID of the message that was read
 */
function sendReadReceiptToPeer(fromUserId: number, recipientId: number, messageId: string) {
  const recipientPeers = findPeers(recipientId);
  if (!recipientPeers) {
    console.log(`No peers found for recipient ${recipientId}`);
    return;
  }
  const readPayload = JSON.stringify({ type: "read", from: fromUserId, messageId });
  for (const peer of recipientPeers) {
    peer.send(readPayload);
  }
}
