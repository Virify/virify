import type {
  Address,
  Prisma,
  User,
} from "~~/layers/database/server/database/prisma/generated/client";
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

export type UserWithVerification = Prisma.UserGetPayload<{
  include: { verification: true };
}>;

export type SharedUser = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatar: string | null;
};
export type UserWithVerificationAndMembership = Prisma.UserGetPayload<{
  include: { verification: true; membership: true };
}>;
export type UserWithMembership = Prisma.UserGetPayload<{
  include: { membership: true };
}>;
export type UserWithAddress = Prisma.UserGetPayload<{
  include: { address: true };
}>;
export type UserSecurity = { id: number; email: string };

export type { User };
