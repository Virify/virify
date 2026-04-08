import { prisma } from "./prisma-client";
import type { ViewingStatus } from "~~/shared/types/viewing";

/** Select shape reused across viewing queries */
const viewingWithDetailsSelect = {
  id: true,
  listingId: true,
  requesterId: true,
  ownerId: true,
  conversationId: true,
  proposedAt: true,
  counterProposedAt: true,
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
  proposedAt: Date,
  notes?: string,
  conversationId?: number,
) {
  return prisma.viewing.create({
    data: { requesterId, ownerId, listingId, proposedAt, notes, conversationId },
    select: viewingWithDetailsSelect,
  });
}

export async function getUserViewings(
  userId: number,
  role: "requester" | "owner" | "all" = "all",
  status?: ViewingStatus,
) {
  const where = {
    ...(role === "requester" ? { requesterId: userId } : role === "owner" ? { ownerId: userId } : { OR: [{ requesterId: userId }, { ownerId: userId }] }),
    ...(status ? { status } : {}),
  };
  return prisma.viewing.findMany({
    where,
    orderBy: { proposedAt: "asc" },
    select: viewingWithDetailsSelect,
  });
}

export async function updateViewingStatus(
  id: number,
  ownerId: number,
  status: ViewingStatus,
  counterProposedAt?: Date,
) {
  return prisma.viewing.update({
    where: { id, ownerId },
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
