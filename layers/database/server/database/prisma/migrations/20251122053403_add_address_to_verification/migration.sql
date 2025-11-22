/*
  Warnings:

  - A unique constraint covering the columns `[addressId]` on the table `UserOwnership` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserOwnership" ADD COLUMN     "addressId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "UserOwnership_addressId_key" ON "UserOwnership"("addressId");

-- AddForeignKey
ALTER TABLE "UserOwnership" ADD CONSTRAINT "UserOwnership_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;
