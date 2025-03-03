/*
  Warnings:

  - You are about to drop the column `isActivated` on the `Owner` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[passwordResetToken]` on the table `Owner` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "isActivated";

-- CreateIndex
CREATE UNIQUE INDEX "Owner_passwordResetToken_key" ON "Owner"("passwordResetToken");
