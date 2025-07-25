/*
  Warnings:

  - The values [DEN,STUDY,OFFICE,CONSERVATORY] on the enum `ReceptionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "OtherRoomType" AS ENUM ('OFFICE', 'STUDY', 'LIBRARY', 'GYM', 'WORKSHOP', 'POOL_ROOM', 'WINE_CELLAR', 'SPA', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "ReceptionType_new" AS ENUM ('LIVING_ROOM', 'FAMILY_ROOM', 'DINING_ROOM', 'GAMES_ROOM', 'HOME_CINEMA');
ALTER TABLE "Reception" ALTER COLUMN "type" TYPE "ReceptionType_new" USING ("type"::text::"ReceptionType_new");
ALTER TYPE "ReceptionType" RENAME TO "ReceptionType_old";
ALTER TYPE "ReceptionType_new" RENAME TO "ReceptionType";
DROP TYPE "ReceptionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Reception" ADD COLUMN     "accousticPanels" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "barArea" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "bayWindow" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "builtInDesk" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "builtInShelving" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "builtInStorage" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "conservatory" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hardwoodFlooring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hasView" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "patioDoors" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "servingHatch" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "soundProofing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stoneFlooring" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "OtherRoom" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "OtherRoomType" NOT NULL,
    "description" TEXT,
    "size" DOUBLE PRECISION,
    "openPlan" BOOLEAN NOT NULL DEFAULT false,
    "openConcept" BOOLEAN NOT NULL DEFAULT false,
    "fireplace" "FireplaceType",
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "bayWindow" BOOLEAN NOT NULL DEFAULT false,
    "builtInShelving" BOOLEAN NOT NULL DEFAULT false,
    "hasView" BOOLEAN NOT NULL DEFAULT false,
    "patioDoors" BOOLEAN NOT NULL DEFAULT false,
    "builtInStorage" BOOLEAN NOT NULL DEFAULT false,
    "servingHatch" BOOLEAN NOT NULL DEFAULT false,
    "barArea" BOOLEAN NOT NULL DEFAULT false,
    "soundProofing" BOOLEAN NOT NULL DEFAULT false,
    "accousticPanels" BOOLEAN NOT NULL DEFAULT false,
    "stoneFlooring" BOOLEAN NOT NULL DEFAULT false,
    "hardwoodFlooring" BOOLEAN NOT NULL DEFAULT false,
    "builtInDesk" BOOLEAN NOT NULL DEFAULT false,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OtherRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OtherRoom_propertyId_idx" ON "OtherRoom"("propertyId");

-- AddForeignKey
ALTER TABLE "OtherRoom" ADD CONSTRAINT "OtherRoom_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
