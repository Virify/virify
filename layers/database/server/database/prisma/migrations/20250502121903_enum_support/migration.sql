/*
  Warnings:

  - The `rentalLength` column on the `RentalListing` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `ListingCosts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ListingCosts" DROP CONSTRAINT "ListingCosts_listingId_fkey";

-- AlterTable
ALTER TABLE "RentalListing" DROP COLUMN "rentalLength",
ADD COLUMN     "rentalLength" INTEGER;

-- DropTable
DROP TABLE "ListingCosts";
