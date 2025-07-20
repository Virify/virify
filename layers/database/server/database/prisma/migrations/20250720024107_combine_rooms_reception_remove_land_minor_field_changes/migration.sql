/*
  Warnings:

  - The values [BUNK] on the enum `BedSizeType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `cableTv` on the `AdditionalFeatures` table. All the data in the column will be lost.
  - You are about to drop the column `homeOffice` on the `AdditionalFeatures` table. All the data in the column will be lost.
  - You are about to drop the column `laundry` on the `AdditionalFeatures` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `AdditionalFeatures` table. All the data in the column will be lost.
  - You are about to drop the column `contactMethod` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `gamesRoom` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `homeCinema` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `pantry` on the `Storage` table. All the data in the column will be lost.
  - You are about to drop the column `appliances` on the `Utility` table. All the data in the column will be lost.
  - You are about to drop the `AdditionalToilet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Diningroom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Land` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LivingArea` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `floor` to the `Bathroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floor` to the `Bedroom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalFloors` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `floor` to the `Reception` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Reception` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Reception` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReceptionType" AS ENUM ('LIVING_ROOM', 'FAMILY_ROOM', 'DINING_ROOM', 'DEN', 'STUDY', 'GAMES_ROOM', 'HOME_CINEMA', 'OFFICE', 'CONSERVATORY');

-- AlterEnum
BEGIN;
CREATE TYPE "BedSizeType_new" AS ENUM ('SINGLE', 'DOUBLE', 'QUEEN', 'KING', 'SUPER_KING');
ALTER TABLE "Bedroom" ALTER COLUMN "bed" TYPE "BedSizeType_new"[] USING ("bed"::text::"BedSizeType_new"[]);
ALTER TYPE "BedSizeType" RENAME TO "BedSizeType_old";
ALTER TYPE "BedSizeType_new" RENAME TO "BedSizeType";
DROP TYPE "BedSizeType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "AdditionalToilet" DROP CONSTRAINT "AdditionalToilet_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Diningroom" DROP CONSTRAINT "Diningroom_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Land" DROP CONSTRAINT "Land_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "LivingArea" DROP CONSTRAINT "LivingArea_propertyId_fkey";

-- AlterTable
ALTER TABLE "AdditionalFeatures" DROP COLUMN "cableTv",
DROP COLUMN "homeOffice",
DROP COLUMN "laundry",
DROP COLUMN "phone";

-- AlterTable
ALTER TABLE "Bathroom" ADD COLUMN     "floor" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "toilet" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Bedroom" ADD COLUMN     "floor" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Kitchen" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "contactMethod";

-- AlterTable
ALTER TABLE "Parking" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "totalFloors" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Reception" DROP COLUMN "gamesRoom",
DROP COLUMN "homeCinema",
ADD COLUMN     "balcony" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "floor" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "openConcept" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "ReceptionType" NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Storage" DROP COLUMN "pantry";

-- AlterTable
ALTER TABLE "Utility" DROP COLUMN "appliances";

-- DropTable
DROP TABLE "AdditionalToilet";

-- DropTable
DROP TABLE "Diningroom";

-- DropTable
DROP TABLE "Land";

-- DropTable
DROP TABLE "LivingArea";

-- DropEnum
DROP TYPE "ContactMethod";

-- DropEnum
DROP TYPE "LandUse";

-- DropEnum
DROP TYPE "PlanningClassification";
