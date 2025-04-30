/*
  Warnings:

  - You are about to drop the column `agentId` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `classificationId` on the `Property` table. All the data in the column will be lost.
  - Added the required column `propertyClassificationId` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_classificationId_fkey";

-- DropIndex
DROP INDEX "Property_agentId_idx";

-- DropIndex
DROP INDEX "Property_userId_idx";

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "agentId",
DROP COLUMN "classificationId",
ADD COLUMN     "propertyClassificationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_propertyClassificationId_fkey" FOREIGN KEY ("propertyClassificationId") REFERENCES "PropertyClassification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
