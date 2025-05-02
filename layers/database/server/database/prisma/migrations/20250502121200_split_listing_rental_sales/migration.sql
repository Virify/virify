/*
  Warnings:

  - You are about to drop the column `availabilityStatus` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `listingCategory` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `listingType` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `priceType` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `holdingDeposit` on the `ListingCosts` table. All the data in the column will be lost.
  - You are about to drop the column `tenancyDeposit` on the `ListingCosts` table. All the data in the column will be lost.
  - You are about to drop the column `furnishingStatus` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `leaseTerm` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `tenure` on the `Property` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FurnishedStatus" AS ENUM ('FURNISHED', 'UNFURNISHED', 'PART_FURNISHED');

-- CreateEnum
CREATE TYPE "RentalPriceType" AS ENUM ('WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "RentalAvailabilityStatus" AS ENUM ('AVAILABLE', 'UNDER_OFFER', 'LET_AGREED', 'LET');

-- CreateEnum
CREATE TYPE "TenureType" AS ENUM ('FREEHOLD', 'LEASEHOLD', 'COMMONHOLD', 'SHARE_OF_FREEHOLD');

-- CreateEnum
CREATE TYPE "SalePriceType" AS ENUM ('FIXED', 'AUCTION', 'OFFERS_OVER', 'GUIDE_PRICE', 'PRICE_ON_APPLICATION');

-- CreateEnum
CREATE TYPE "OwnershipType" AS ENUM ('FULL_OWNERSHIP', 'PARTIAL_OWNERSHIP', 'SHARED_OWNERSHIP', 'JOINT_OWNERSHIP');

-- CreateEnum
CREATE TYPE "SaleAvailabilityStatus" AS ENUM ('AVAILABLE', 'UNDER_OFFER', 'SOLD');

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "availabilityStatus",
DROP COLUMN "listingCategory",
DROP COLUMN "listingType",
DROP COLUMN "priceType";

-- AlterTable
ALTER TABLE "ListingCosts" DROP COLUMN "holdingDeposit",
DROP COLUMN "tenancyDeposit";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "furnishingStatus",
DROP COLUMN "leaseTerm",
DROP COLUMN "tenure";

-- DropEnum
DROP TYPE "AvailabilityStatus";

-- DropEnum
DROP TYPE "FurnishingStatus";

-- DropEnum
DROP TYPE "ListingCategory";

-- DropEnum
DROP TYPE "ListingType";

-- DropEnum
DROP TYPE "PriceType";

-- DropEnum
DROP TYPE "Tenure";

-- CreateTable
CREATE TABLE "RentalListing" (
    "id" INTEGER NOT NULL,
    "deposit" DOUBLE PRECISION,
    "holdingDeposit" DOUBLE PRECISION,
    "rentFrequency" "RentalPriceType" NOT NULL,
    "isBillsIncluded" BOOLEAN NOT NULL,
    "rentalLength" TEXT,
    "furnishedStatus" "FurnishedStatus",
    "availabilityStatus" "RentalAvailabilityStatus" NOT NULL,

    CONSTRAINT "RentalListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleListing" (
    "id" INTEGER NOT NULL,
    "tenureType" "TenureType",
    "chain" BOOLEAN NOT NULL,
    "ownershipType" "OwnershipType",
    "priceType" "SalePriceType" NOT NULL,
    "availabilityStatus" "SaleAvailabilityStatus" NOT NULL,

    CONSTRAINT "SaleListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RentalListing_id_idx" ON "RentalListing"("id");

-- CreateIndex
CREATE INDEX "SaleListing_id_idx" ON "SaleListing"("id");

-- AddForeignKey
ALTER TABLE "RentalListing" ADD CONSTRAINT "RentalListing_id_fkey" FOREIGN KEY ("id") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleListing" ADD CONSTRAINT "SaleListing_id_fkey" FOREIGN KEY ("id") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
