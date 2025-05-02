/*
  Warnings:

  - The values [FOR_SALE,RENT_SHORT,RENT_LONG,RENT_TO_BUY,SHORT_TERM_LET] on the enum `ListingType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ListingType_new" AS ENUM ('SALE', 'LET', 'LET_LONG', 'LET_TO_BUY', 'LET_SHORT', 'AUCTION');
ALTER TABLE "Listing" ALTER COLUMN "listingType" TYPE "ListingType_new" USING ("listingType"::text::"ListingType_new");
ALTER TYPE "ListingType" RENAME TO "ListingType_old";
ALTER TYPE "ListingType_new" RENAME TO "ListingType";
DROP TYPE "ListingType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "furnishingStatus" DROP NOT NULL;
