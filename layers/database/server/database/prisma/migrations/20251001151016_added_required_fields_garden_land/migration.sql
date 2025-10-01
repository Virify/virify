/*
  Warnings:

  - You are about to drop the column `driveway` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `separateParcel` on the `OutdoorSpace` table. All the data in the column will be lost.
  - Made the column `name` on table `Garden` required. This step will fail if there are existing NULL values in that column.
  - Made the column `facing` on table `Garden` required. This step will fail if there are existing NULL values in that column.
  - Made the column `position` on table `Garden` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `Land` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Garden" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "facing" SET NOT NULL,
ALTER COLUMN "position" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."Land" DROP COLUMN "driveway",
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."OutdoorSpace" DROP COLUMN "separateParcel";
