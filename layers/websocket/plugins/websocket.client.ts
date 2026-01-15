import { useWebSocket } from "@vueuse/core";

/**
 * Global WebSocket plugin
 * 
 * Handles all incoming WebSocket messages and routes them to:
 * 1. useEnquiries - Updates conversation/message state
 * 2. useNotifications - Updates aggregates and shows toasts
 * 
 * This is the SINGLE source of truth for all real-time updates.
 */
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
    const { handleAggregateUpdate, showToast, addNotification, fetchUserItemsAggregates, aggregatesLoading, fetchNotificationCounts } = useNotifications();
    const { handleNewConversation, handleNewMessage, handleMessageRead, activeEnquiryId, enquiries } = useEnquiries();
    const { syncConversationIfOpen, isModalOpen, modalConversation } = useGlobalEnquiryModal();
    const wsComposable = useWebSocketServer();

    const globalWebSocketEvents: WebSocketEvents = {
      /**
       * Handle aggregate count updates (favourites, notes, enquiries, etc.)
       */
      onAggregateUpdate: ({ aggregateType, operation }) => {
        handleAggregateUpdate({ 
          type: "aggregate_update",
          aggregateType, 
          operation,
          to: 0,
          timestamp: new Date().toISOString()
        });
      },
      
      /**
       * Handle new conversation/enquiry
       * - Updates enquiries state
       * - Shows toast notification
       * - Updates aggregate counts
       */
      onNewConversation: ({ conversation }) => {
        const conv = conversation as ConversationWithMinimalListing;
        const currentUserId = user.value?.id;
        
        // Update enquiries state
        handleNewConversation(conv);
        // Update aggregates
        handleAggregateUpdate({
          type: "aggregate_update", 
          aggregateType: "enquiries", 
          operation: "add", 
          to: 0, 
          timestamp: new Date().toISOString() 
        });
        handleAggregateUpdate({
          type: "aggregate_update", 
          aggregateType: "unreadMessages", 
          operation: "add", 
          to: 0, 
          timestamp: new Date().toISOString() 
        });
        handleAggregateUpdate({ 
          type: "aggregate_update", 
          aggregateType: "unreadConversations", 
          operation: "add", 
          to: 0, 
          timestamp: new Date().toISOString() 
        });

        // Update notification counts so notification panel badge updates immediately
        // Trust optimistic local updates for enquiries badge
        fetchNotificationCounts().catch(e => console.error("Failed to fetch notification counts", e));
      },
      
      /**
       * Handle new message in existing conversation
       * - Updates enquiries state
       * - Shows toast notification (if not from current user, and conversation not open)
       * - Updates aggregate counts
       */
      onNewMessage: ({ conversationId, message, conversation }) => {
        const msg = message as MessageWithUser;
        const conv = conversation as ConversationWithMinimalListing | undefined;
        const isFromCurrentUser = msg.senderId === user.value?.id;
        
        // Update enquiries state
        handleNewMessage(conversationId, msg, conv);
        
        // Keep global enquiry modal in sync if it's open on this conversation
        const updatedConv = conv || enquiries.value.find(c => c.id === conversationId);
        if (updatedConv) {
          syncConversationIfOpen(updatedConv);
        }
        
        // Only adjust unread counts if message is from someone else
        if (!isFromCurrentUser) {
          handleAggregateUpdate({ 
            type: "aggregate_update", 
            aggregateType: "unreadMessages", 
            operation: "add", 
            to: 0, 
            timestamp: new Date().toISOString() 
          });
          handleAggregateUpdate({ 
            type: "aggregate_update", 
            aggregateType: "unreadConversations", 
            operation: "add", 
            to: 0, 
            timestamp: new Date().toISOString() 
          });

          // Update notification counts so notification panel badge displays immediately
          // Don't refetch aggregates - trust the optimistic local update to avoid flicker
          fetchNotificationCounts().catch(e => console.error("Failed to fetch notification counts", e));
        }
      },

      /**
       * Handle notification_new - add to list and trigger toast
       */
      onNotificationNew: ({ notification }) => {
        // Add to notifications store
        addNotification(notification);

        // Build a minimal in-app toast payload and delegate suppression
        showToast({
          id: notification.id,
          title: notification.title,
          description: notification.message,
          conversationId: notification.conversationId ?? undefined,
          listingId: notification.listingId ?? undefined,
          senderUsername: notification.senderUsername ?? undefined,
          senderAvatar: notification.senderAvatar ?? undefined,
        });
      },
      
      /**
       * Handle message read confirmation
       * Updates the read status in enquiries state
       */
      onMessageRead: ({ conversationId, messageId }) => {
        handleMessageRead(conversationId, messageId);
      },
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

    // Send conversation presence updates to server when modal opens/closes
    if (import.meta.client) {
      let lastSentConvId: number | null = null;
      watch(
        () => ({ open: isModalOpen.value, convId: modalConversation.value?.id ?? null }),
        ({ open, convId }) => {
          if (ws.status.value !== "OPEN") return;
          // Notify server about current state
          ws.send(
            JSON.stringify({
              type: "conversation_presence",
              conversationId: convId ?? lastSentConvId,
              open: !!open && !!convId,
            })
          );
          lastSentConvId = !!open ? convId ?? null : null;
        },
        { immediate: true }
      );
    }
  }
});
