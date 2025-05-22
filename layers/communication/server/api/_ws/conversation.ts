export type Peer = {
  send: (message: string) => void;
  close: () => void;
};

const peers = new Map<number, Set<Peer>>();

export default defineWebSocketHandler({
  async upgrade(request) {
    await requireUserSession(request);
  },
  async open(peer) {
    const { user } = await requireUserSession(peer);
    // track a peer connection for the user
    addPeer(user.id!, peer);
    peer.send(`You are now connected to your conversation!`);
  },
  message(peer, message) {
    const msg = String(message);
    if (msg === "ping") return;
    peer.send(msg);
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
