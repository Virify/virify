/*
  Warnings:

  - You are about to drop the column `totalGardenSize` on the `OutdoorSpace` table. All the data in the column will be lost.
  - You are about to drop the column `totalLandSize` on the `OutdoorSpace` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Media" ADD COLUMN     "yardId" INTEGER;

-- AlterTable
ALTER TABLE "public"."OutdoorSpace" DROP COLUMN "totalGardenSize",
DROP COLUMN "totalLandSize",
ADD COLUMN     "balcony" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "gardenOffice" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "patio" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pool" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "separateParcel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "summerHouse" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sunTerrace" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "terrace" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totalArea" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "public"."Yard" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "name" TEXT NOT NULL,
    "facing" "public"."GardenFacing" NOT NULL,
    "position" "public"."GardenPosition" NOT NULL,
    "sunTerrace" BOOLEAN NOT NULL DEFAULT false,
    "terrace" BOOLEAN NOT NULL DEFAULT false,
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "patio" BOOLEAN NOT NULL DEFAULT false,
    "separateParcel" BOOLEAN NOT NULL DEFAULT false,
    "shed" BOOLEAN NOT NULL DEFAULT false,
    "summerHouse" BOOLEAN NOT NULL DEFAULT false,
    "gardenOffice" BOOLEAN NOT NULL DEFAULT false,
    "pool" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "outdoorSpaceId" INTEGER,

    CONSTRAINT "Yard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Yard_outdoorSpaceId_idx" ON "public"."Yard"("outdoorSpaceId");

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_yardId_fkey" FOREIGN KEY ("yardId") REFERENCES "public"."Yard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Yard" ADD CONSTRAINT "Yard_outdoorSpaceId_fkey" FOREIGN KEY ("outdoorSpaceId") REFERENCES "public"."OutdoorSpace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
