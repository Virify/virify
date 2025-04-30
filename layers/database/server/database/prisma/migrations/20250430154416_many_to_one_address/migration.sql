/*
  Warnings:

  - You are about to drop the column `propertyId` on the `Address` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Address" DROP CONSTRAINT "Address_propertyId_fkey";

-- DropIndex
DROP INDEX "Address_propertyId_idx";

-- DropIndex
DROP INDEX "Address_propertyId_key";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "propertyId";

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "addressId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
