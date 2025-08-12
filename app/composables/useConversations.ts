import { createSharedComposable } from '@vueuse/core';

/**
 * Main conversations composable that orchestrates all conversation functionality
 * This composable combines state, events, typing, and actions into a unified interface
 */
export const useConversations = createSharedComposable((options?: { limit?: number }) => {
  // Initialize all sub-composables
  const conversationState = useConversationState(options);
  const conversationEvents = useConversationEvents(conversationState);
  const conversationTyping = useConversationTyping(conversationState, conversationEvents);
  const conversationActions = useConversationActions(conversationState);

  // Update the WebSocket events to include typing handling
  if (import.meta.client && conversationEvents.webSocketEvents) {
    conversationEvents.webSocketEvents.onTyping = ({ from, conversationId, isTyping }) => {
      conversationTyping.handleTypingEvent(from, conversationId, isTyping);
    };
  }

  // Return the combined interface
  return {
    // State
    ...conversationState,
    
    // Actions
    ...conversationActions,
    
    // Typing
    ...conversationTyping,
  };
});
