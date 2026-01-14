import { useWebSocket } from "@vueuse/core";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const { loggedIn, user } = useUserSession();

  const ws = useWebSocket(config.public.WS_BASE_URL + "/api/_ws/connection", {
    autoConnect: false,
    immediate: false,
    autoClose: false,
    autoReconnect: {
      retries: 3,
      delay: 1000,
      onFailed() {
        console.warn("Failed to reconnect WebSocket after 3 attempts.");
      },
    },
    heartbeat: {
      message: "ping",
      interval: 30000,
      pongTimeout: 5000,
    },
  });

  if (import.meta.client) {
    // Set up global message handling for aggregate updates
    const { handleAggregateUpdate, createInAppNotification, unreadMessages } = useNotifications();
    const wsComposable = useWebSocketServer();

    const globalWebSocketEvents: WebSocketEvents = {
      onAggregateUpdate: ({ aggregateType, operation }) => {
        handleAggregateUpdate({ 
          type: "aggregate_update",
          aggregateType, 
          operation,
          to: 0, // Not used in handler
          timestamp: new Date().toISOString()
        });
      },
      
      onNewConversation: ({ conversation }) => {
        const conv = conversation as ConversationWithUserAndMessages;
        const currentUserId = user.value?.id;
        
        // Use util to check if we should notify
        if (!shouldNotifyForNewConversation(conv, currentUserId)) {
          return;
        }

        const senderName = getConversationSenderName(conv);
        const latestMessage = getConversationLatestMessage(conv);

        createInAppNotification(
          0,
          "New enquiry from " + senderName,
          latestMessage?.content || `You have a new enquiry from ${senderName}`,
          "unreadMessages",
          { 
            conversationId: conv.id, 
            conversation: conv,
            message: latestMessage || undefined
          }
        );

        // Optimistically add the latest message to unread list
        if (latestMessage && !unreadMessages.value.some(m => m.id === latestMessage.id)) {
          unreadMessages.value.unshift(latestMessage); 
          // New enquiry = +1 unread conversation
          handleAggregateUpdate({
          type: "aggregate_update", 
          aggregateType: "unreadConversations", 
          operation: "add", 
          to: 0, 
          timestamp: new Date().toISOString() 
          });

          // New enquiry = +1 enquiries
          handleAggregateUpdate({
          type: "aggregate_update", 
          aggregateType: "enquiries", 
          operation: "add", 
          to: 0, 
          timestamp: new Date().toISOString() 
          });

          // New enquiry = +1 unread message
          handleAggregateUpdate({
          type: "aggregate_update", 
          aggregateType: "unreadMessages", 
          operation: "add", 
          to: 0, 
          timestamp: new Date().toISOString() 
          });
        }
      },
      
      onNewMessage: ({ message, conversation }) => {
        const msg = message as MessageWithUser;
        const conv = conversation as ConversationWithUserAndMessages | undefined;
        const currentUserId = user.value?.id;
        
        // If we sent the message, do not create a notification or add to unread
        // Unless we are the receiver (sending to self)
        if (msg.senderId === currentUserId && msg.receiverId !== currentUserId) {
          return;
        }

        const senderName = msg.sender?.username || 'Someone';

        createInAppNotification(
          0,
          "New message from " + senderName,
          `You have a new message from ${senderName}`,
          "unreadMessages",
          { conversationId: msg.conversationId, conversation: conv, message: msg }
        );
        
        // Check if this is a new unread conversation locally
        const isNewUnreadConversation = !unreadMessages.value.some(m => m.conversationId === msg.conversationId);

        // Optimistically add to the unread list (if not already there)
        if (!unreadMessages.value.some(m => m.id === msg.id)) {
          unreadMessages.value.unshift(msg);
          
          // Manually update aggregate because new message = +1 unread
          handleAggregateUpdate({ 
            type: "aggregate_update", 
            aggregateType: "unreadMessages", 
            operation: "add", 
            to: 0, 
            timestamp: new Date().toISOString() 
          });

          // If this conversation wasn't in our unread list, increment unreadConversations
          if (isNewUnreadConversation) {
            handleAggregateUpdate({ 
              type: "aggregate_update", 
              aggregateType: "unreadConversations", 
              operation: "add", 
              to: 0, 
              timestamp: new Date().toISOString() 
            });
          }
        }
      }
    };

    // Watch for incoming websocket messages and handle them globally
    watchEffect(() => {
      if (ws.data.value && typeof ws.data.value === 'string') {
        wsComposable.handleOutgoingMessages(ws.data.value, globalWebSocketEvents);
      }
    });

    watch(
      () => loggedIn.value,
      (newUser) => {
        if (newUser && ws.status.value === "CLOSED") {
          ws.open();
        }
      },
      { immediate: true }
    );
  }
});
