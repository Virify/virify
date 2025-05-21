type Peer = {
  id: string;
  send: (message: string | Record<string, any>) => void;
  [key: string]: any;
};

const peers = new Map<string, Peer>();
const peerIdToName = new Map<string, string>();

interface ParsedMessage {
  recipientName: string;
  textToSend: string;
}

/**
 * WebSocket handler for managing peer connections and message routing.
 * Handles registration, message parsing, and cleanup on disconnect.
 */
export default defineWebSocketHandler({
  /**
  * Connection Hook
  */
  open(peer: Peer) {
    console.log(`[ws] open: Peer ${peer.id} connected.`);
  },

  /**
   * Message Hook
   */
  message(currentPeer: Peer, rawMessage) {
    const msgText = rawMessage.text();
    const currentPeerId = currentPeer.id;
    const registeredName = peerIdToName.get(currentPeerId);

    if (!registeredName) {
      handleRegistration(currentPeer, msgText);
      return;
    }

    const parsed = parseMessage(msgText, registeredName, currentPeerId);

    if (!parsed) {
      return;
    }

    const { recipientName, textToSend } = parsed;

    if (recipientName === registeredName) {
      console.warn(`[ws] User ${registeredName} (ID: ${currentPeerId}) tried to send a message to themselves.`);
      return;
    }

    const targetPeer = peers.get(recipientName);

    if (!targetPeer) {
      console.warn(`[ws] User ${registeredName} (ID: ${currentPeerId}) tried to send to non-existent user \"${recipientName}\".`);
      return;
    }

    try {
      const messagePayload = {
        type: "message",
        from: registeredName,
        content: textToSend,
      };
      const payloadString = messagePayload.from + ": " + messagePayload.content;
      targetPeer.send(payloadString);
    } catch (e) {
      console.error(`[ws] Error sending message from ${registeredName} to ${recipientName} (target peer ${targetPeer.id}):`, e);
    }
  },

  /**
   * Close Hook
   */
  close(peer: Peer, event: any) {
    cleanup(peer, event, undefined);
  },

  /**
   * Error hook
   */
  error(peer: Peer, error) {
    cleanup(peer, undefined, error);
  },
});

/**
 * Handles the registration of a new peer.
 *
 * @param currentPeer Peer
 * @param potentialName string name to register
 * @returns Boolean indicating success or failure of registration
 */
function handleRegistration(currentPeer: Peer, potentialName: string): boolean {
  const currentPeerId = currentPeer.id;
  const nameToRegister = potentialName.trim();

  if (!nameToRegister) {
    console.error(`[ws] Registration failed for ${currentPeerId}: Name cannot be empty.`);
    return false;
  }
  if (peers.has(nameToRegister)) {
    console.error(`[ws] Registration failed for ${nameToRegister} (ID: ${currentPeerId}): Name is already taken.`);
    return false;
  }

  peers.set(nameToRegister, currentPeer);
  peerIdToName.set(currentPeerId, nameToRegister);
  console.log(`[ws] register: User \"${nameToRegister}\" (ID: ${currentPeerId}) registered.`);
  return true;
}

/**
 * Parses a message string to extract the recipient's name and the text to send.
 *
 * @param msgText string message text
 * @param registeredName string name of the peer sending the message
 * @param currentPeerId string ID of the current peer
 * @returns ParsedMessage | null
 */
function parseMessage(msgText: string, registeredName: string, currentPeerId: string): ParsedMessage | null {
  const separatorIndex = msgText.indexOf(":");
  if (separatorIndex <= 0) {
    console.error(`[ws] Invalid message format from ${registeredName} (ID: ${currentPeerId}): \"${msgText}\"`);
    return null;
  }

  const recipientName = msgText.slice(0, separatorIndex).trim();
  const textToSend = msgText.slice(separatorIndex + 1).trim();

  if (!textToSend) {
    console.error(`[ws] Empty message content from ${registeredName} (ID: ${currentPeerId}) to ${recipientName}.`);
    return null;
  }

  return { recipientName, textToSend };
}

/**
 * Cleans up the peer connection on close or error.
 *
 * @param peer Peer
 * @param event CloseEvent
 * @returns void
 */
function cleanup(peer: Peer, event?: CloseEvent, error?: Error) {
  const peerId = peer.id;
  const name = peerIdToName.get(peerId);

  if (event) {
    console.log(`[ws] close: Peer ${peerId} (Name: ${name || "N/A"}) disconnected. Event: code=${event?.code}, reason=${event?.reason}`);
  }

  if (error) {
    console.error(`[ws] error: Peer ${peerId} (Name: ${name || "N/A"}). Error:`, error);
  }

  if (name) {
    peers.delete(name);
    peerIdToName.delete(peerId);
    console.log(`[ws] unregister: User \"${name}\" (ID: ${peerId}) removed.`);
  }
}
