/*
  Warnings:

  - You are about to drop the column `petPolicy` on the `AdditionalFeatures` table. All the data in the column will be lost.
  - Added the required column `homeOffice` to the `AdditionalFeatures` table without a default value. This is not possible if the table is not empty.
  - Added the required column `petFriendly` to the `AdditionalFeatures` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pool` to the `AdditionalFeatures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdditionalFeatures" DROP COLUMN "petPolicy",
ADD COLUMN     "homeOffice" BOOLEAN NOT NULL,
ADD COLUMN     "petFriendly" BOOLEAN NOT NULL,
ADD COLUMN     "pool" BOOLEAN NOT NULL;
