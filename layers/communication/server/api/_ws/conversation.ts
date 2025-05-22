export default defineWebSocketHandler({
  async upgrade(request) {
    await requireUserSession(request);
  },
  async open(peer) {
    const { user } = await requireUserSession(peer);
    peer.send(`Hello, ${user.email}!`);
  },
  message(peer, message) {
    const msg = String(message);
    if (msg === "ping") return;
    peer.send(msg);
  },
});
