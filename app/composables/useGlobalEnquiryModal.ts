export const useGlobalEnquiryModal = () => {
  const isModalOpen = useState<boolean>("globalEnquiryModalOpen", () => false);
  const modalConversation = useState<ConversationWithMinimalListing | null>(
    "globalEnquiryModalConversation",
    () => null,
  );
  const newEnquiryData = useState<{
    listingId: number;
    receiverId: number;
    listingType: "sale" | "rent";
    listingTitle?: string;
  } | null>("globalEnquiryNewData", () => null);

  /**
   * Opens a conversation in the global modal
   * @param conversation - The conversation object or ID to open
   */
  async function openConversation(conversation: ConversationWithMinimalListing | number) {
    const { openEnquiry } = useEnquiries();
    newEnquiryData.value = null;
    if (typeof conversation === "number") {
      // Open modal immediately with null data (shows loading state)
      isModalOpen.value = true;
      modalConversation.value = null;

      // Allow modal to render before fetching
      await nextTick();

      try {
        const data = await useRequestFetch()<ConversationWithMinimalListing>(
          `/api/conversation/${conversation}`,
        );
        modalConversation.value = data;
        openEnquiry(data);
      } catch (error) {
        console.error("Failed to fetch conversation", error);
        // Close modal on error
        isModalOpen.value = false;
      }
    } else {
      modalConversation.value = conversation;
      openEnquiry(conversation);
      isModalOpen.value = true;
    }
  }

  /**
   * Opens the modal in compose mode to start a new enquiry.
   * If the user has already contacted this listing, opens the existing conversation instead.
   * Waits for contactedListings hydration before deciding which mode to show — avoids flashing compose then immediately switching.
   */
  async function openNewEnquiry(
    listingId: number,
    receiverId: number,
    listingType: "sale" | "rent",
    listingTitle?: string,
  ) {
    const { hasContactedListing, enquiries, contactedListingsLoading, openEnquiry } =
      useEnquiries();

    // Wait for hydration so we make the right decision first time, no flicker
    if (contactedListingsLoading.value) {
      await new Promise<void>((resolve) => {
        const stop = watch(contactedListingsLoading, (loading) => {
          if (!loading) {
            stop();
            resolve();
          }
        });
      });
    }

    if (hasContactedListing(listingId)) {
      // Find the existing conversation in already-loaded enquiries first
      const existing = enquiries.value.find((c) => c.listingId === listingId);
      if (existing) {
        await openConversation(existing);
      } else {
        // Not loaded yet — fetch by listing so we get the right one
        isModalOpen.value = true;
        modalConversation.value = null;
        await nextTick();
        try {
          const data = await useRequestFetch()<ConversationWithMinimalListing[]>(
            `/api/conversation?listingId=${listingId}&direction=sent&limit=1`,
          );
          const found = Array.isArray(data) ? data[0] : (data as any)?.conversations?.[0];
          if (found) {
            modalConversation.value = found;
            openEnquiry(found);
          } else {
            isModalOpen.value = false;
          }
        } catch {
          isModalOpen.value = false;
        }
      }
      return;
    }

    newEnquiryData.value = { listingId, receiverId, listingType, listingTitle };
    modalConversation.value = null;
    isModalOpen.value = true;
  }

  /**
   * Closes the global modal
   */
  function closeConversation() {
    const { closeEnquiry } = useEnquiries();
    isModalOpen.value = false;
    modalConversation.value = null;
    newEnquiryData.value = null;
    closeEnquiry();
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
    newEnquiryData,
    openConversation,
    openNewEnquiry,
    closeConversation,
    syncConversationIfOpen,
  };
};
