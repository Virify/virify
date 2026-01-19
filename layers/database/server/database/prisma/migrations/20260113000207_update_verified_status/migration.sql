/*
  Warnings:

  - The `activated` column on the `Verification` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ActivationStatus" AS ENUM ('PENDING', 'UNVERIFIED', 'ACTIVATED', 'EXPIRED', 'DENIED');

-- AlterTable
ALTER TABLE "Verification" DROP COLUMN "activated",
ADD COLUMN     "activated" "ActivationStatus" NOT NULL DEFAULT 'PENDING';
