/*
  Warnings:

  - You are about to drop the column `floorPlans` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `Media` table. All the data in the column will be lost.
  - You are about to drop the column `propertyClassificationId` on the `Property` table. All the data in the column will be lost.
  - Made the column `propertyId` on table `Address` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `Listing` required. This step will fail if there are existing NULL values in that column.
  - Made the column `priceType` on table `Listing` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_propertyClassificationId_fkey";

-- AlterTable
ALTER TABLE "Address" ALTER COLUMN "propertyId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Listing" ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "priceType" SET NOT NULL;

-- AlterTable
ALTER TABLE "Media" DROP COLUMN "floorPlans",
DROP COLUMN "images",
ADD COLUMN     "floorPlan" TEXT,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "propertyClassificationId";

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
