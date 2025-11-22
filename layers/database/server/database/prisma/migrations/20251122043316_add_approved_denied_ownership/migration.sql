/*
  Warnings:

  - You are about to drop the column `ownershipDocument` on the `UserOwnership` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserOwnership" DROP COLUMN "ownershipDocument",
ADD COLUMN     "approvedOwnershipDocuments" TEXT[],
ADD COLUMN     "deniedOwnershipDocuments" TEXT[],
ADD COLUMN     "pendingOwnershipDocuments" TEXT[];
