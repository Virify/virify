/*
  Warnings:

  - You are about to drop the column `chainFree` on the `AdditionalFeatures` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AdditionalFeatures" DROP COLUMN "chainFree";

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "chainFree" BOOLEAN NOT NULL DEFAULT false;
