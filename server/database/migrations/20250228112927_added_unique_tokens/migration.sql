/*
  Warnings:

  - A unique constraint covering the columns `[activationToken]` on the table `Agent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[activationToken]` on the table `Owner` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Agent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Owner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Umbrella` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agent" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Owner" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Umbrella" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Agent_activationToken_key" ON "Agent"("activationToken");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_activationToken_key" ON "Owner"("activationToken");
