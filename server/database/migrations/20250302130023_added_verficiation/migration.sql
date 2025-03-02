/*
  Warnings:

  - You are about to drop the column `verified` on the `Owner` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Reviewed" AS ENUM ('PENDING', 'YES', 'NO');

-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "verified";

-- CreateTable
CREATE TABLE "Verification" (
    "id" SERIAL NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" INTEGER NOT NULL,
    "identity" BOOLEAN,
    "address" BOOLEAN,
    "bank" BOOLEAN,
    "payslip" BOOLEAN,
    "business" BOOLEAN,
    "reviewed" "Reviewed" NOT NULL DEFAULT 'PENDING',
    "reviewToken" TEXT,
    "reviewTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Verification_ownerId_key" ON "Verification"("ownerId");

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
