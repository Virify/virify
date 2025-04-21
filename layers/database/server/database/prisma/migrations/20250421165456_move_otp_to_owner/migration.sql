/*
  Warnings:

  - You are about to drop the column `otpCode` on the `Verification` table. All the data in the column will be lost.
  - You are about to drop the column `otpCodeExpiry` on the `Verification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Owner" ADD COLUMN     "otpCode" TEXT,
ADD COLUMN     "otpCodeExpiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Verification" DROP COLUMN "otpCode",
DROP COLUMN "otpCodeExpiry";
