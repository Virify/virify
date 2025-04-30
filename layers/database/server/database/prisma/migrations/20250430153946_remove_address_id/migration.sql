/*
  Warnings:

  - You are about to drop the column `addressId` on the `Property` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Property_addressId_key";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "addressId";
