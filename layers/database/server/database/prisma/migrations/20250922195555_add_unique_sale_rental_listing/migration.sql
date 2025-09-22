/*
  Warnings:

  - You are about to drop the column `rentalListingId` on the `DraftListing` table. All the data in the column will be lost.
  - You are about to drop the column `saleListingId` on the `DraftListing` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[listingId]` on the table `RentalListing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[draftListingId]` on the table `RentalListing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[listingId]` on the table `SaleListing` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[draftListingId]` on the table `SaleListing` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "DraftListing" DROP CONSTRAINT "DraftListing_rentalListingId_fkey";

-- DropForeignKey
ALTER TABLE "DraftListing" DROP CONSTRAINT "DraftListing_saleListingId_fkey";

-- DropForeignKey
ALTER TABLE "RentalListing" DROP CONSTRAINT "RentalListing_id_fkey";

-- DropForeignKey
ALTER TABLE "SaleListing" DROP CONSTRAINT "SaleListing_id_fkey";

-- DropIndex
DROP INDEX "RentalListing_id_idx";

-- DropIndex
DROP INDEX "SaleListing_id_idx";

-- AlterTable
ALTER TABLE "DraftListing" DROP COLUMN "rentalListingId",
DROP COLUMN "saleListingId";

-- AlterTable
CREATE SEQUENCE rentallisting_id_seq;
ALTER TABLE "RentalListing" ADD COLUMN     "draftListingId" INTEGER,
ADD COLUMN     "listingId" INTEGER,
ALTER COLUMN "id" SET DEFAULT nextval('rentallisting_id_seq'),
ALTER COLUMN "rentFrequency" DROP NOT NULL;
ALTER SEQUENCE rentallisting_id_seq OWNED BY "RentalListing"."id";

-- AlterTable
CREATE SEQUENCE salelisting_id_seq;
ALTER TABLE "SaleListing" ADD COLUMN     "draftListingId" INTEGER,
ADD COLUMN     "listingId" INTEGER,
ALTER COLUMN "id" SET DEFAULT nextval('salelisting_id_seq'),
ALTER COLUMN "priceType" DROP NOT NULL;
ALTER SEQUENCE salelisting_id_seq OWNED BY "SaleListing"."id";

-- CreateIndex
CREATE UNIQUE INDEX "RentalListing_listingId_key" ON "RentalListing"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "RentalListing_draftListingId_key" ON "RentalListing"("draftListingId");

-- CreateIndex
CREATE INDEX "RentalListing_listingId_idx" ON "RentalListing"("listingId");

-- CreateIndex
CREATE INDEX "RentalListing_draftListingId_idx" ON "RentalListing"("draftListingId");

-- CreateIndex
CREATE UNIQUE INDEX "SaleListing_listingId_key" ON "SaleListing"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "SaleListing_draftListingId_key" ON "SaleListing"("draftListingId");

-- CreateIndex
CREATE INDEX "SaleListing_listingId_idx" ON "SaleListing"("listingId");

-- CreateIndex
CREATE INDEX "SaleListing_draftListingId_idx" ON "SaleListing"("draftListingId");

-- AddForeignKey
ALTER TABLE "RentalListing" ADD CONSTRAINT "RentalListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalListing" ADD CONSTRAINT "RentalListing_draftListingId_fkey" FOREIGN KEY ("draftListingId") REFERENCES "DraftListing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleListing" ADD CONSTRAINT "SaleListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleListing" ADD CONSTRAINT "SaleListing_draftListingId_fkey" FOREIGN KEY ("draftListingId") REFERENCES "DraftListing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
