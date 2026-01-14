import type { Prisma } from "~~/layers/database/server/database/prisma/generated/client";
import type { ListingCardType } from "./listing";

export type ConversationWithMessages = Prisma.ConversationGetPayload<{
  include: {
    messages: true;
  };
}>;

export type ConversationWithUserAndMessages = {
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
  };
}
& {
  listing?: ListingCardType | null;
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
