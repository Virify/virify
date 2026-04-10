/**
 * Tracks who is currently typing per conversation.
 * Updated by the global WebSocket plugin when typing frames arrive.
 */

import { createSharedComposable } from "@vueuse/core";

const typingUserByConversation = ref<Record<number, number | null>>({});
// Module-level timers to auto-clear stale typing state (in case the stop event is missed)
const clearTimers: Record<number, ReturnType<typeof setTimeout>> = {};

export const useTypingIndicator = createSharedComposable(() => {
  function setTyping(conversationId: number, userId: number | null) {
    typingUserByConversation.value = { ...typingUserByConversation.value, [conversationId]: userId };

    if (clearTimers[conversationId]) clearTimeout(clearTimers[conversationId]);
    if (userId !== null) {
      // Auto-clear after 5s if the stop event never arrives
      clearTimers[conversationId] = setTimeout(() => {
        typingUserByConversation.value = { ...typingUserByConversation.value, [conversationId]: null };
      }, 5000);
    }
  }

  function getTypingUser(conversationId: number | null | undefined): number | null {
    if (!conversationId) return null;
    return typingUserByConversation.value[conversationId] ?? null;
  }

  return { setTyping, getTypingUser };
});
