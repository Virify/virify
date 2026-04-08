// Mirrors the Prisma ViewingStatus enum for use on client and server
export type ViewingStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'RESCHEDULED' | 'CANCELLED';

/** Which side of the viewing the current user is on */
export type ViewingRole = 'requester' | 'owner';

/** Minimal user shape used inside viewing records */
export type ViewingUser = {
  id: number;
  username: string | null;
  avatar: string | null;
};

/** Minimal listing shape used inside viewing records */
export type ViewingListing = {
  id: number;
  price: number | null;
  property: {
    address: { fullAddress: string | null } | null;
    media: readonly { image: string | null }[];
  } | null;
};

/** Full viewing record as returned from the API */
export interface ViewingWithDetails {
  id: number;
  listingId: number;
  requesterId: number;
  ownerId: number;
  conversationId: number | null;
  proposedAt: string; // ISO string
  counterProposedAt: string | null;
  status: ViewingStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  listing: ViewingListing | null;
  requester: ViewingUser;
  owner: ViewingUser;
}

/** Payload to create a new viewing request */
export interface CreateViewingPayload {
  listingId: number;
  ownerId: number;
  proposedAt: string; // ISO string
  notes?: string;
  conversationId?: number;
}

/** Payload to respond to a viewing (owner action) */
export interface RespondViewingPayload {
  response: 'accept' | 'reject' | 'reschedule';
  counterProposedAt?: string; // required when response = 'reschedule'
}
