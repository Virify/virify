/*
  Warnings:

  - The `rentalLength` column on the `RentalListing` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."RentalLengthType" AS ENUM ('SHORT_TERM', 'LONG_TERM');

-- AlterTable
ALTER TABLE "public"."RentalListing" DROP COLUMN "rentalLength",
ADD COLUMN     "rentalLength" "public"."RentalLengthType";
