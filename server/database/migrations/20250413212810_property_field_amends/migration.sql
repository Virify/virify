/*
  Warnings:

  - You are about to drop the column `accessibilityFeatures` on the `AdditionalFeatures` table. All the data in the column will be lost.
  - You are about to drop the `AmenitiesFeature` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BathroomFeatures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BedroomFeatures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DiningroomFeatures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KitchenFeatures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LivingAreaFeatures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SecurityFeatures` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StorageFeatures` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `petPolicy` on the `AdditionalFeatures` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
ALTER TYPE "BedSizeType" ADD VALUE 'BUNK';

-- DropForeignKey
ALTER TABLE "AmenitiesFeature" DROP CONSTRAINT "AmenitiesFeature_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "BathroomFeatures" DROP CONSTRAINT "BathroomFeatures_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "BedroomFeatures" DROP CONSTRAINT "BedroomFeatures_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "DiningroomFeatures" DROP CONSTRAINT "DiningroomFeatures_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "KitchenFeatures" DROP CONSTRAINT "KitchenFeatures_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "LivingAreaFeatures" DROP CONSTRAINT "LivingAreaFeatures_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "SecurityFeatures" DROP CONSTRAINT "SecurityFeatures_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "StorageFeatures" DROP CONSTRAINT "StorageFeatures_propertyId_fkey";

-- AlterTable
ALTER TABLE "AdditionalFeatures" DROP COLUMN "accessibilityFeatures",
DROP COLUMN "petPolicy",
ADD COLUMN     "petPolicy" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "flat" TEXT;

-- AlterTable
ALTER TABLE "Media" ALTER COLUMN "images" DROP NOT NULL,
ALTER COLUMN "videoTour" DROP NOT NULL,
ALTER COLUMN "floorPlans" DROP NOT NULL;

-- DropTable
DROP TABLE "AmenitiesFeature";

-- DropTable
DROP TABLE "BathroomFeatures";

-- DropTable
DROP TABLE "BedroomFeatures";

-- DropTable
DROP TABLE "DiningroomFeatures";

-- DropTable
DROP TABLE "KitchenFeatures";

-- DropTable
DROP TABLE "LivingAreaFeatures";

-- DropTable
DROP TABLE "SecurityFeatures";

-- DropTable
DROP TABLE "StorageFeatures";

-- DropEnum
DROP TYPE "PetPolicyType";

-- CreateTable
CREATE TABLE "Amenities" (
    "id" SERIAL NOT NULL,
    "transportLinks" TEXT,
    "schools" TEXT,
    "hospitals" TEXT,
    "shopping" TEXT,
    "greenSpaces" TEXT,
    "description" TEXT,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bathroom" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL DEFAULT 1,
    "enSuite" BOOLEAN NOT NULL,
    "bathtub" BOOLEAN NOT NULL,
    "walkInShower" BOOLEAN NOT NULL,
    "downstairs" BOOLEAN NOT NULL,
    "upstairs" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "size" DOUBLE PRECISION,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bathroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bedroom" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL,
    "bed" "BedSizeType"[],
    "description" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "size" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bedroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diningroom" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL DEFAULT 1,
    "openConcept" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "size" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diningroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kitchen" (
    "id" SERIAL NOT NULL,
    "modern" BOOLEAN NOT NULL,
    "openPlan" BOOLEAN NOT NULL,
    "appliancesIncluded" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "size" DOUBLE PRECISION,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kitchen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LivingArea" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL DEFAULT 1,
    "fireplace" BOOLEAN NOT NULL,
    "balcony" BOOLEAN NOT NULL,
    "openConcept" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "size" DOUBLE PRECISION,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LivingArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Security" (
    "id" SERIAL NOT NULL,
    "gatedCommunity" BOOLEAN NOT NULL,
    "cctv" BOOLEAN NOT NULL,
    "alarmSystem" BOOLEAN NOT NULL,
    "neighborhoodWatch" BOOLEAN NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Security_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Storage" (
    "id" SERIAL NOT NULL,
    "closets" BOOLEAN NOT NULL,
    "attic" BOOLEAN NOT NULL,
    "basement" BOOLEAN NOT NULL,
    "walkInWardrobe" BOOLEAN NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Storage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Kitchen_propertyId_key" ON "Kitchen"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Security_propertyId_key" ON "Security"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Storage_propertyId_key" ON "Storage"("propertyId");

-- AddForeignKey
ALTER TABLE "Amenities" ADD CONSTRAINT "Amenities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bathroom" ADD CONSTRAINT "Bathroom_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bedroom" ADD CONSTRAINT "Bedroom_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diningroom" ADD CONSTRAINT "Diningroom_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kitchen" ADD CONSTRAINT "Kitchen_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LivingArea" ADD CONSTRAINT "LivingArea_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Security" ADD CONSTRAINT "Security_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Storage" ADD CONSTRAINT "Storage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
