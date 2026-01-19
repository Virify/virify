/*
  Warnings:

  - The values [UNKNOWN] on the enum `EPCRating` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `business` on the `Verification` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'BUSINESS', 'ADMIN');

-- AlterEnum
BEGIN;
CREATE TYPE "EPCRating_new" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G');
ALTER TABLE "EnergyAndUtilities" ALTER COLUMN "epcRating" TYPE "EPCRating_new" USING ("epcRating"::text::"EPCRating_new");
ALTER TYPE "EPCRating" RENAME TO "EPCRating_old";
ALTER TYPE "EPCRating_new" RENAME TO "EPCRating";
DROP TYPE "public"."EPCRating_old";
COMMIT;

-- AlterTable
ALTER TABLE "Verification" DROP COLUMN "business",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
