/*
  Warnings:

  - The values [FOR_LONG_TERM_LET] on the enum `ListingType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `deposit` on the `ListingCosts` table. All the data in the column will be lost.
  - Added the required column `listingCategory` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ListingCategory" AS ENUM ('SALE', 'RENTAL');

-- CreateEnum
CREATE TYPE "ContactMethod" AS ENUM ('CALL', 'EMAIL', 'WHATSAPP', 'LIVE_CHAT');

-- CreateEnum
CREATE TYPE "VerificationLevel" AS ENUM ('UNVERIFIED', 'BASIC', 'VERIFIED', 'FULLY_VERIFIED');

-- AlterEnum
BEGIN;
CREATE TYPE "ListingType_new" AS ENUM ('FOR_SALE', 'RENT_SHORT', 'RENT_LONG', 'RENT_TO_BUY', 'SHORT_TERM_LET', 'AUCTION');
ALTER TABLE "Listing" ALTER COLUMN "listingType" TYPE "ListingType_new" USING ("listingType"::text::"ListingType_new");
ALTER TYPE "ListingType" RENAME TO "ListingType_old";
ALTER TYPE "ListingType_new" RENAME TO "ListingType";
DROP TYPE "ListingType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "PriceType" ADD VALUE 'ASKING_PRICE';

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "contactMethod" "ContactMethod"[],
ADD COLUMN     "listingCategory" "ListingCategory" NOT NULL,
ADD COLUMN     "listingEndDate" TIMESTAMP(3),
ADD COLUMN     "listingStartDate" TIMESTAMP(3),
ADD COLUMN     "moveInDate" TIMESTAMP(3),
ADD COLUMN     "verificationLevel" "VerificationLevel",
ADD COLUMN     "viewingOptions" TEXT,
ALTER COLUMN "priceType" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ListingCosts" DROP COLUMN "deposit",
ADD COLUMN     "holdingDeposit" DOUBLE PRECISION,
ADD COLUMN     "tenancyDeposit" DOUBLE PRECISION,
ALTER COLUMN "upfrontCosts" DROP NOT NULL;
