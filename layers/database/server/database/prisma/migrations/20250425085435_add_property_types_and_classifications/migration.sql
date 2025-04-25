/*
  Warnings:

  - You are about to drop the column `classification` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `roofConstruction` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Property` table. All the data in the column will be lost.
  - Added the required column `propertyClassificationId` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `propertyTypeId` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Tenure" ADD VALUE 'SHARED_OWNERSHIP';

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "classification",
DROP COLUMN "roofConstruction",
DROP COLUMN "type",
ADD COLUMN     "propertyClassificationId" INTEGER NOT NULL,
ADD COLUMN     "propertyTypeId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "PropertyClassification";

-- DropEnum
DROP TYPE "PropertyType";

-- DropEnum
DROP TYPE "RoofConstruction";

-- CreateTable
CREATE TABLE "PropertyClassification" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "PropertyClassification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PropertyType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PropertyType_name_key" ON "PropertyType"("name");

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_propertyTypeId_fkey" FOREIGN KEY ("propertyTypeId") REFERENCES "PropertyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_propertyClassificationId_fkey" FOREIGN KEY ("propertyClassificationId") REFERENCES "PropertyClassification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyClassification" ADD CONSTRAINT "PropertyClassification_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PropertyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
