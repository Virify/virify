/*
  Warnings:

  - Made the column `street` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `postcode` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `epcRating` on table `EnergyAndUtilities` required. This step will fail if there are existing NULL values in that column.
  - Made the column `addressId` on table `Property` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "HeatingType" ADD VALUE 'NILL';

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_addressId_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "street" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "postcode" SET NOT NULL;

-- AlterTable
ALTER TABLE "EnergyAndUtilities" ALTER COLUMN "epcRating" SET NOT NULL;

-- AlterTable
ALTER TABLE "Parking" ALTER COLUMN "garage" SET DEFAULT false,
ALTER COLUMN "driveway" SET DEFAULT false,
ALTER COLUMN "permitParking" SET DEFAULT false,
ALTER COLUMN "onStreet" SET DEFAULT false,
ALTER COLUMN "noParking" SET DEFAULT false,
ALTER COLUMN "carport" SET DEFAULT false,
ALTER COLUMN "allocatedParking" SET DEFAULT false,
ALTER COLUMN "evCharging" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Property" ALTER COLUMN "yearBuilt" DROP NOT NULL,
ALTER COLUMN "constructionType" DROP NOT NULL,
ALTER COLUMN "addressId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
