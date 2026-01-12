import type { Address } from "~~/layers/database/server/database/prisma/generated/client";
import type { UserIntent } from "~~/layers/database/server/database/prisma/generated/enums";
import type { ListingWithFullProperty } from "./listing";

export type FullUser = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  phoneNumber: string;
  intents: UserIntent[];
  interests: string[];
  listings: ListingWithFullProperty[];
  address: Address;
  lastLogin: Date | null;
};