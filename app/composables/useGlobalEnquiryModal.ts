import type { ConversationWithMinimalListing } from "~~/shared/types/conversation";

export const useGlobalEnquiryModal = () => {
  const isModalOpen = useState<boolean>('globalEnquiryModalOpen', () => false);
  const modalConversation = useState<ConversationWithMinimalListing | null>('globalEnquiryModalConversation', () => null);

  /**
   * Opens a conversation in the global modal
   * @param conversation - The conversation object or ID to open
   */
  async function openConversation(conversation: ConversationWithMinimalListing | number) {
    if (typeof conversation === 'number') {
      try {
        const data = await $fetch<ConversationWithMinimalListing>(`/api/conversation/${conversation}`);
        modalConversation.value = data;
        isModalOpen.value = true;
      } catch (error) {
        console.error("Failed to fetch conversation", error);
      }
    } else {
      modalConversation.value = conversation;
      isModalOpen.value = true;
    }
  }

  /**
   * Closes the global modal
   */
  function closeConversation() {
    isModalOpen.value = false;
    modalConversation.value = null;
  }

  /**
   * Updates the modal conversation if it matches the provided conversation ID (e.g. for real-time updates)
   */
  function syncConversationIfOpen(conversation: ConversationWithMinimalListing) {
    if (isModalOpen.value && modalConversation.value?.id === conversation.id) {
      modalConversation.value = conversation;
      return true;
    }
    return false;
  }

  return {
    isModalOpen,
    modalConversation,
    openConversation,
    closeConversation,
    syncConversationIfOpen
  };
};
