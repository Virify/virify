import type { OutgoingWebSocketMessage } from "~~/shared/types/websocket";

/**
 * WebSocket utilities for working with vueuse's useWebSocket
 * Provides helper functions for sending messages and getting connection info
 */
export const useWebSocketUtils = () => {
  
  /**
   * Get WebSocket connection status from server
   */
  const getConnectionStatus = async () => {
    const data = await $fetch("/api/websocket/status");
    return data;
  };

  /**
   * Get active connections count from server
   */
  const getConnectionsCount = async () => {
    const data = await $fetch("/api/websocket/connection");
    return data;
  };

  /**
   * Create a typed message sender for vueuse WebSocket
   */
  const createMessageSender = (send: (data: string | ArrayBuffer | Blob, useBuffer?: boolean) => boolean) => {
    const sendMessage = (message: OutgoingWebSocketMessage) => {
      return send(JSON.stringify(message));
    };

    const sendTypingStatusToServer = (conversationId: number, toUserId: number, isTyping: boolean) => {
      return sendMessage({
        type: "typing",
        conversationId,
        toUserId,
        isTyping,
      });
    };

    const sendMessageReadStatusToServer = (conversationId: number, messageId: number, toUserId: number) => {
      return sendMessage({
        type: "message_read",
        conversationId,
        messageId,
        toUserId,
      });
    };

    return {
      sendMessage,
      sendTypingStatusToServer,
      sendMessageReadStatusToServer,
    };
  };

  return {
    // API methods
    getConnectionStatus,
    getConnectionsCount,
    
    // Helper utilities
    createMessageSender,
  };
};
