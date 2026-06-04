/*
  Warnings:

  - A unique constraint covering the columns `[draftListingId]` on the table `OwnershipVerification` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `draftListingId` to the `OwnershipVerification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OwnershipVerification" DROP CONSTRAINT "OwnershipVerification_userId_fkey";

-- DropIndex
DROP INDEX "OwnershipVerification_userId_key";

-- AlterTable
ALTER TABLE "OwnershipVerification" ADD COLUMN     "draftListingId" INTEGER NOT NULL,
ALTER COLUMN "docOneKey" DROP NOT NULL,
ALTER COLUMN "docOneName" DROP NOT NULL,
ALTER COLUMN "docTwoKey" DROP NOT NULL,
ALTER COLUMN "docTwoName" DROP NOT NULL,
ALTER COLUMN "reviewTokenExpiry" SET DEFAULT NOW() + INTERVAL '30 days';

-- CreateIndex
CREATE UNIQUE INDEX "OwnershipVerification_draftListingId_key" ON "OwnershipVerification"("draftListingId");

-- CreateIndex
CREATE INDEX "OwnershipVerification_draftListingId_idx" ON "OwnershipVerification"("draftListingId");

-- AddForeignKey
ALTER TABLE "OwnershipVerification" ADD CONSTRAINT "OwnershipVerification_draftListingId_fkey" FOREIGN KEY ("draftListingId") REFERENCES "DraftListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
