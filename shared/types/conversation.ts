import type { Message, Prisma } from "@prisma/client";

export type ConversationWithMessages = Prisma.ConversationGetPayload<{
  include: {
    messages: true;
  };
}>;

export type ConversationWithUserAndMessages = {
  id: number;
  listingId: number;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
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