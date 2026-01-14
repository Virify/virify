import type { Prisma } from "~~/layers/database/server/database/prisma/generated/client";
import type { ListingCardType, ListingConversationCardType, ListingMinimalType } from "./listing";

/**
 * Filter and sort options for enquiries
 */
export type EnquiryFilter = 'all' | 'unread';
export type EnquiryDirection = 'all' | 'sent' | 'received';
export type EnquirySort = 'newest' | 'oldest' | 'listing';

/**
 * Options for fetching enquiries with filters
 */
export interface EnquiryFetchOptions {
  filter?: EnquiryFilter;
  direction?: EnquiryDirection;
  sort?: EnquirySort;
  page?: number;
  limit?: number;
  listingId?: number;
}

export type ConversationWithMessages = Prisma.ConversationGetPayload<{
  include: {
    messages: true;
  };
}>;

/**
 * Minimal listing data for conversation list items
 * Used in conversation modal subtitles and secondary displays
 */
export type ConversationListingMinimal = {
  id: number;
  price: number | null;
  rentalListing: { id: number } | null;
  saleListing: { id: number } | null;
  property: {
    media: { image: string }[];
    address: {
      fullAddress: string | null;
      city: string | null;
      postcode: string | null;
    } | null;
    type: { name: string } | null;
    numberBedrooms: number | null;
    numberBathrooms: number | null;
    numberReceptions: number | null;
    numberOtherRooms: number | null;
  } | null;
};

/**
 * Base conversation structure without listing
 */
export type ConversationBase = {
  id: number;
  listingId: number | null;
  createdAt: Date;
  updatedAt: Date;
  messages: {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    isRead: boolean;
    conversationId: number;
    sender: {
      id: number;
      username: string | null;
      avatar: string | null;
    };
    receiver: {
      id: number;
      avatar: string | null;
      username: string | null;
    };
  }[];
  sender: {
    id: number;
    avatar: string | null;
    username: string | null;
  };
  receiver: {
    id: number;
    username: string | null;
    avatar: string | null;
  };
};

/**
 * Conversation with minimal listing data - used for conversation lists
 */
export type ConversationWithMinimalListing = ConversationBase & {
  listing?: ConversationListingMinimal | null;
};

export type MessageWithUser = {
  id: number;
  conversationId: number;
  senderId: number;
  receiverId: number;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: number;
    avatar: string | null;
    username: string | null;
  };
  receiver: {
    id: number;
    username: string | null;
    avatar: string | null;
  };
};
