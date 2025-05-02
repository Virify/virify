/*
  Warnings:

  - Made the column `propertyId` on table `Listing` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Listing_propertyId_key";

-- AlterTable
ALTER TABLE "Listing" ALTER COLUMN "propertyId" SET NOT NULL;
