/*
  Warnings:

  - You are about to drop the `OutdoorSpace` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OutdoorSpace" DROP CONSTRAINT "OutdoorSpace_propertyId_fkey";

-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "frontGardenId" INTEGER,
ADD COLUMN     "rearGardenId" INTEGER;

-- DropTable
DROP TABLE "OutdoorSpace";

-- CreateTable
CREATE TABLE "FrontGarden" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "size" DOUBLE PRECISION,
    "sunTerrace" BOOLEAN NOT NULL DEFAULT false,
    "terrace" BOOLEAN NOT NULL DEFAULT false,
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "patio" BOOLEAN NOT NULL DEFAULT false,
    "separateParcel" BOOLEAN NOT NULL DEFAULT false,
    "shed" BOOLEAN NOT NULL DEFAULT false,
    "summerHouse" BOOLEAN NOT NULL DEFAULT false,
    "gardenOffice" BOOLEAN NOT NULL DEFAULT false,
    "pool" BOOLEAN NOT NULL DEFAULT false,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FrontGarden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RearGarden" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "size" DOUBLE PRECISION,
    "sunTerrace" BOOLEAN NOT NULL DEFAULT false,
    "terrace" BOOLEAN NOT NULL DEFAULT false,
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "patio" BOOLEAN NOT NULL DEFAULT false,
    "separateParcel" BOOLEAN NOT NULL DEFAULT false,
    "shed" BOOLEAN NOT NULL DEFAULT false,
    "summerHouse" BOOLEAN NOT NULL DEFAULT false,
    "gardenOffice" BOOLEAN NOT NULL DEFAULT false,
    "pool" BOOLEAN NOT NULL DEFAULT false,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RearGarden_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FrontGarden_propertyId_key" ON "FrontGarden"("propertyId");

-- CreateIndex
CREATE INDEX "FrontGarden_propertyId_idx" ON "FrontGarden"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "RearGarden_propertyId_key" ON "RearGarden"("propertyId");

-- CreateIndex
CREATE INDEX "RearGarden_propertyId_idx" ON "RearGarden"("propertyId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_frontGardenId_fkey" FOREIGN KEY ("frontGardenId") REFERENCES "FrontGarden"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_rearGardenId_fkey" FOREIGN KEY ("rearGardenId") REFERENCES "RearGarden"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FrontGarden" ADD CONSTRAINT "FrontGarden_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RearGarden" ADD CONSTRAINT "RearGarden_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
