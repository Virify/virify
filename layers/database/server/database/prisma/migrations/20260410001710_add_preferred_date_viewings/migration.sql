/*
  Warnings:

  - You are about to drop the column `proposedAt` on the `Viewing` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Viewing_proposedAt_idx";

-- AlterTable
ALTER TABLE "Viewing" DROP COLUMN "proposedAt",
ADD COLUMN     "preferredTimes" TEXT[],
ADD COLUMN     "proposedDates" TIMESTAMP(3)[];
