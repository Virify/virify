/*
  Warnings:

  - Added the required column `classificationId` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "classificationId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "PropertyClassification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
