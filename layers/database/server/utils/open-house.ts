import { prisma } from "./prisma-client";
import type { OpenHouseSession } from "~~/shared/types/open-house";

const openHouseSessionSelect = {
  id: true,
  listingId: true,
  date: true,
  startTime: true,
  endTime: true,
  slotMins: true,
  createdAt: true,
  updatedAt: true,
  bookings: {
    where: { status: { in: ["ACCEPTED", "PENDING"] } },
    select: { preferredTimes: true },
  },
} as const;

function serialize(
  s: Awaited<ReturnType<typeof prisma.openHouseSession.findMany>>[number] & {
    bookings: { preferredTimes: string[] }[];
  },
): OpenHouseSession {
  return {
    id: s.id,
    listingId: s.listingId,
    date: s.date.toISOString(),
    startTime: s.startTime,
    endTime: s.endTime,
    slotMins: s.slotMins,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    bookedSlots: s.bookings.flatMap((b) => b.preferredTimes),
  };
}

/** Get all upcoming open house sessions for a listing, sorted by date asc */
export async function getListingOpenHouseSessions(
  listingId: number,
): Promise<OpenHouseSession[]> {
  const sessions = await prisma.openHouseSession.findMany({
    where: { listingId, date: { gte: new Date() } },
    orderBy: { date: "asc" },
    select: openHouseSessionSelect,
  });
  return sessions.map(serialize);
}

export async function createOpenHouseSession(
  listingId: number,
  date: Date,
  startTime: string,
  endTime: string,
  slotMins: number,
): Promise<OpenHouseSession> {
  const s = await prisma.openHouseSession.create({
    data: { listingId, date, startTime, endTime, slotMins },
    select: openHouseSessionSelect,
  });
  return serialize(s);
}

/**
 * Delete an open house session, verifying it belongs to a listing owned by ownerId.
 * Returns false if not found or unauthorized.
 */
export async function deleteOpenHouseSession(
  id: number,
  ownerId: number,
): Promise<boolean> {
  const session = await prisma.openHouseSession.findFirst({
    where: { id, listing: { userId: ownerId } },
    select: { id: true },
  });
  if (!session) return false;
  await prisma.openHouseSession.delete({ where: { id } });
  return true;
}
