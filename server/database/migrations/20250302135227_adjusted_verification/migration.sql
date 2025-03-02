/*
  Warnings:

  - You are about to drop the column `activationToken` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `tokenExpiry` on the `Owner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reviewToken]` on the table `Verification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activationToken]` on the table `Verification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Owner_activationToken_key";

-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "activationToken",
DROP COLUMN "tokenExpiry",
ADD COLUMN     "passwordResetTokenExpiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Verification" ADD COLUMN     "activated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "activationToken" TEXT,
ADD COLUMN     "activationTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Verification_reviewToken_key" ON "Verification"("reviewToken");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_activationToken_key" ON "Verification"("activationToken");
