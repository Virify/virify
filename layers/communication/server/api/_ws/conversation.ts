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
  const messageContent = parsedMessage.message;
  // find the recipient peers in the map
  const recipientPeers = findPeers(recipientId);
  if (!recipientPeers) {
    console.log(`No peers found for recipient ${recipientId}`);
    return;
  }
  // get all peers that are connected to the recipient (different tabs/windwow etc)
  console.log(`Sending message to peer ${recipientId}: ${messageContent}`);
  for (const peer of recipientPeers) {
    peer.send(messageContent);
  }
}
