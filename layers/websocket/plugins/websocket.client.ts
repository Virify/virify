/**
 * @fileoverview Global client-side WebSocket listener and event dispatcher.
 * 
 * **Purpose:**
 * Establishes the singular client-side WebSocket connection for the logged-in user 
 * and routes incoming real-time events to the appropriate shared composables 
 * (e.g., `useNotifications`, `useEnquiries`).
 * 
 * **State Management & UI UX:**
 * - Acts as the strict single source of truth for processing real-time updates.
 * - Automatically triggers secondary side-effects (like calling `fetchViewings()`) to keep 
 *   unrelated UI components in sync without requiring a page reload.
 * 
 * **WebSocket Race Condition & Flicker Prevention:**
 * - Prioritizes optimistic local state updates (e.g., manually incrementing badges) 
 *   over immediate API refetches. Because database replication/transactions can have lag, 
 *   an immediate HTTP fetch after a WS message might return "stale" DB data, causing 
 *   badges to flicker. Relying on the optimistic WebSockets payload avoids this perfectly.
 */
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
  const { loggedIn, user, clear: clearSession, fetch: fetchSession } = useUserSession();

  // Listen for login/logout events from other tabs (BroadcastChannel)
  if (import.meta.client) {
    try {
      const authChannel = new BroadcastChannel('virify:auth');
      authChannel.addEventListener('message', async (event) => {
        if (event.data?.type === 'logout' && loggedIn.value) {
          await clearSession();
          navigateTo('/');
        } else if (event.data?.type === 'login' && !loggedIn.value) {
          await fetchSession();
        }
      });
    } catch {}
  }

  const ws = useWebSocket(config.public.WS_BASE_URL + "/api/_ws/connection", {
    autoConnect: false,
    immediate: false,
    autoClose: false,
    autoReconnect: {
      retries: (retried) => loggedIn.value && retried < 3,
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
    const { canDesktop } = useNotificationPreferences();
    const wsComposable = useWebSocketServer();
    const { fetchViewings } = useViewings();
    const { registerSend } = useWebSocketClient();
    const { setTyping } = useTypingIndicator();

    // Register ws.send so composables can send frames without accessing the plugin directly
    registerSend((data) => { if (ws.status.value === 'OPEN') ws.send(data); });

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
        // When a viewings aggregate update arrives, also refresh the shared viewings ref
        if (aggregateType === "viewings") {
          fetchViewings().catch((e) => console.error("Failed to refresh viewings on aggregate update:", e));
        }
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
        
        // Keep global enquiry modal in sync if it's open on this conversation.
        // Fall back to activeEnquiry when the conversation isn't in the list
        // (e.g. modal opened from search/listing page without fetchEnquiries being called).
        const { activeEnquiry } = useEnquiries();
        const updatedConv = enquiries.value.find(c => c.id === conversationId)
          ?? (activeEnquiry.value?.id === conversationId ? activeEnquiry.value : undefined);
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
        const isViewingNotification = (notification.type as string).startsWith("VIEWING_");

        // Add to notifications store
        addNotification(notification);

        // Build a minimal in-app toast payload and delegate suppression
        showToast({
          id: notification.id,
          title: notification.title,
          description: notification.message,
          type: notification.type as any,
          conversationId: notification.conversationId ?? undefined,
          listingId: notification.listingId ?? undefined,
          senderUsername: notification.senderUsername ?? undefined,
          senderAvatar: notification.senderAvatar ?? undefined,
        });

        // For viewing notifications: refresh the shared viewings ref and aggregates
        // so sidebar badges and the viewings page update without a hard refresh
        if (isViewingNotification) {
          fetchViewings().catch((e) => console.error("Failed to refresh viewings on notification:", e));
          fetchUserItemsAggregates(true).catch((e) => console.error("Failed to refresh aggregates on viewing notification:", e));
        }

        // Trigger browser desktop notification if the user has enabled it
        // Suppress if the page is currently focused (in-app toast already shown)
        if (canDesktop.value && 'Notification' in window && Notification.permission === 'granted' && document.visibilityState === 'hidden') {
          const body = [
            notification.message,
            notification.listingAddress ? notification.listingAddress : null,
          ].filter(Boolean).join('\n');

          new Notification(notification.title, {
            body,
            icon: notification.senderAvatar || '/favicon.ico',
            tag: `notification-${notification.id}`,
          });
        }
      },
      
      /**
       * Handle message read confirmation
       * Updates the read status in enquiries state
       */
      onMessageRead: ({ conversationId, messageId }) => {
        handleMessageRead(conversationId, messageId);
      },

      /**
       * Handle typing indicator from the other participant
       */
      onTyping: ({ from, conversationId, isTyping }) => {
        setTyping(conversationId, isTyping ? from : null);
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
      (isLoggedIn) => {
        if (isLoggedIn && ws.status.value === "CLOSED") {
          ws.open();
        } else if (!isLoggedIn && ws.status.value !== "CLOSED") {
          ws.close();
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
