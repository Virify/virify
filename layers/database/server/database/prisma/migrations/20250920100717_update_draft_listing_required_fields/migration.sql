/*
  Warnings:

  - Made the column `userId` on table `DraftListing` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "DraftListing" DROP CONSTRAINT "DraftListing_userId_fkey";

-- AlterTable
ALTER TABLE "DraftListing" ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "userId" SET NOT NULL,
ALTER COLUMN "propertyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "DraftListing" ADD CONSTRAINT "DraftListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
