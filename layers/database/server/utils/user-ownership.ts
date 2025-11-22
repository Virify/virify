import type { UserOwnership } from "../database/prisma/generated/client";

/**
 * 
 * @param userId User ID
 * @param pendingDocuments Array of object keys
 * @returns 
 */
export async function createUserOwnershipRecord(userId: number, pendingDocuments: string[]): Promise<UserOwnership> {
  return prisma.userOwnership.create({
    data: {
      pendingOwnershipDocuments: [
        ...pendingDocuments
      ],
      verification: {
        connectOrCreate: {
          where: { userId },
          create: { userId },
        },
      },
    },
    include: {
      verification: true,
    },
  });
}
