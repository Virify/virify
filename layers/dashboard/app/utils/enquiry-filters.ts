/**
 * Build API URL for fetching enquiries with filters
 */
export function buildEnquiryUrl(options: EnquiryFetchOptions = {}): string {
  const {
    filter = 'all',
    direction = 'all',
    sort = 'newest',
    page = 1,
    limit = 30,
    listingId,
  } = options;

  let url = `/api/conversation/?filter=${filter}&direction=${direction}&sort=${sort}&page=${page}&limit=${limit}`;
  if (listingId) {
    url += `&listingId=${listingId}`;
  }
  return url;
}

/**
 * Validate user is authenticated before fetching enquiries
 */
export function canFetchEnquiries(loggedIn: boolean, userId: number | null): boolean {
  return loggedIn && !!userId;
}

/**
 * Check if a conversation message is from the user
 */
export function isMessageFromUser(message: any, userId: number): boolean {
  return message?.senderId === userId;
}

/**
 * Check if conversation is being viewed in modal
 */
export function isActiveConversation(conversationId: number | null, activeId: number | null): boolean {
  return conversationId === activeId;
}

/**
 * Check if message already exists in conversation
 */
export function messageExists(messages: any[], messageId: number): boolean {
  return messages?.some(m => m.id === messageId) ?? false;
}

/**
 * Find conversation by ID in list
 */
export function findConversation(conversations: any[], conversationId: number | null): any {
  return conversations?.find(c => c.id === conversationId) ?? null;
}

/**
 * Check if listing has been contacted by user
 */
export function isListingContacted(conversationId: number | null): boolean {
  return conversationId !== null && conversationId > 0;
}
