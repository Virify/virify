import { prisma } from "./prisma-client";
import type { ViewingStatus } from "~~/shared/types/viewing";

/** Select shape reused across viewing queries */
const viewingWithDetailsSelect = {
  id: true,
  listingId: true,
  requesterId: true,
  ownerId: true,
  conversationId: true,
  proposedDates: true,
  preferredTimes: true,
  counterProposedAt: true,
  lastProposedBy: true,
  status: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  listing: {
    select: {
      id: true,
      price: true,
      property: {
        select: {
          address: { select: { fullAddress: true } },
          media: { select: { image: true }, take: 1 },
        },
      },
    },
  },
  requester: {
    select: { id: true, username: true, avatar: true },
  },
  owner: {
    select: { id: true, username: true, avatar: true },
  },
} as const;

export async function createViewing(
  requesterId: number,
  ownerId: number,
  listingId: number,
  proposedDates: Date[],
  preferredTimes: string[],
  notes?: string,
  conversationId?: number,
) {
  return prisma.viewing.create({
    data: { requesterId, ownerId, listingId, proposedDates, preferredTimes, notes, conversationId, lastProposedBy: 'requester' },
    select: viewingWithDetailsSelect,
  });
}

export async function getUserViewings(
  userId: number,
  role: "requester" | "owner" | "all" = "all",
  status?: ViewingStatus,
  sort: "newest" | "oldest" = "newest",
) {
  const where = {
    ...(role === "requester" ? { requesterId: userId } : role === "owner" ? { ownerId: userId } : { OR: [{ requesterId: userId }, { ownerId: userId }] }),
    ...(status ? { status } : {}),
  };
  return prisma.viewing.findMany({
    where,
    orderBy: { createdAt: sort === "oldest" ? "asc" : "desc" },
    select: viewingWithDetailsSelect,
  });
}

export async function updateViewingStatus(
  id: number,
  userId: number,
  role: 'owner' | 'requester',
  status: ViewingStatus,
  counterProposedAt?: Date,
) {
  const where = role === 'owner' ? { id, ownerId: userId } : { id, requesterId: userId };
  return prisma.viewing.update({
    where,
    data: { status, counterProposedAt: counterProposedAt ?? undefined },
    select: viewingWithDetailsSelect,
  });
}

export async function cancelViewing(id: number, userId: number) {
  // Either party can cancel
  return prisma.viewing.update({
    where: { id, OR: [{ requesterId: userId }, { ownerId: userId }] },
    data: { status: "CANCELLED" },
    select: viewingWithDetailsSelect,
  });
}

/**
 * Either party updates proposed dates/times.
 * - Requester (buyer/tenant): resets counterProposedAt, sets status PENDING
 * - Owner (landlord/seller): clears proposedDates back to these new ones, sets status RESCHEDULED
 */
export async function updateViewingProposal(
  id: number,
  userId: number,
  role: 'requester' | 'owner',
  proposedDates: Date[],
  preferredTimes: string[],
  notes?: string,
) {
  const status = 'RESCHEDULED';
  const where = role === 'owner' ? { id, ownerId: userId } : { id, requesterId: userId };
  return prisma.viewing.update({
    where,
    data: { proposedDates, preferredTimes, notes: notes ?? undefined, status, counterProposedAt: null, lastProposedBy: role },
    select: viewingWithDetailsSelect,
  });
}
