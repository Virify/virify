/*
  Warnings:

  - The values [GREY_WATER] on the enum `RenewableEnergy` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RenewableEnergy_new" AS ENUM ('SOLAR_PV', 'BATTERY_STORAGE', 'SMART_METER', 'EV_CHARGING');
ALTER TABLE "EnergyAndUtilities" ALTER COLUMN "renewables" TYPE "RenewableEnergy_new"[] USING ("renewables"::text::"RenewableEnergy_new"[]);
ALTER TYPE "RenewableEnergy" RENAME TO "RenewableEnergy_old";
ALTER TYPE "RenewableEnergy_new" RENAME TO "RenewableEnergy";
DROP TYPE "public"."RenewableEnergy_old";
COMMIT;
