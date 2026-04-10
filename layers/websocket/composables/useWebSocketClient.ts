/**
 * Client-side WebSocket send bridge.
 *
 * The actual WebSocket connection lives in the plugin (websocket.client.ts).
 * This module-level singleton lets any composable send raw WS frames without
 * needing access to the plugin's `ws` instance.
 *
 * Usage:
 *   // In the plugin — register once after the ws object is created:
 *   const { registerSend } = useWebSocketClient();
 *   registerSend((data) => ws.send(data));
 *
 *   // Anywhere else:
 *   const { sendRaw } = useWebSocketClient();
 *   sendRaw(JSON.stringify({ type: 'typing', ... }));
 */

let _sendFn: ((data: string) => void) | null = null;

export function useWebSocketClient() {
  function registerSend(fn: (data: string) => void) {
    _sendFn = fn;
  }

  function sendRaw(data: string) {
    _sendFn?.(data);
  }

  return { registerSend, sendRaw };
}
