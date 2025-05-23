import type { Prisma } from "@prisma/client";

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
    sender: {
      id: number;
      username: string | null;
      email: string;
    },
    receiver: {
      id: number;
      username: string | null;
      email: string;
    },
  }[];
  sender: {
    id: number;
    username: string | null;
    email: string;
  };
  receiver: {
    id: number;
    username: string | null;
    email: string;
  };  
}