/*
  Warnings:

  - The values [UNKNOWN] on the enum `EPCRating` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EPCRating_new" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G');
ALTER TABLE "EnergyAndUtilities" ALTER COLUMN "epcRating" TYPE "EPCRating_new" USING ("epcRating"::text::"EPCRating_new");
ALTER TYPE "EPCRating" RENAME TO "EPCRating_old";
ALTER TYPE "EPCRating_new" RENAME TO "EPCRating";
DROP TYPE "public"."EPCRating_old";
COMMIT;

-- CreateTable
CREATE TABLE "UserOwnership" (
    "id" SERIAL NOT NULL,
    "verificationId" INTEGER NOT NULL,
    "ownershipDocument" TEXT[],
    "draftListingId" INTEGER,
    "listingId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserOwnership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserOwnership_verificationId_key" ON "UserOwnership"("verificationId");

-- CreateIndex
CREATE UNIQUE INDEX "UserOwnership_draftListingId_key" ON "UserOwnership"("draftListingId");

-- CreateIndex
CREATE UNIQUE INDEX "UserOwnership_listingId_key" ON "UserOwnership"("listingId");

-- AddForeignKey
ALTER TABLE "UserOwnership" ADD CONSTRAINT "UserOwnership_verificationId_fkey" FOREIGN KEY ("verificationId") REFERENCES "Verification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOwnership" ADD CONSTRAINT "UserOwnership_draftListingId_fkey" FOREIGN KEY ("draftListingId") REFERENCES "DraftListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOwnership" ADD CONSTRAINT "UserOwnership_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
