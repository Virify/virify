/*
  Warnings:

  - Added the required column `defaultSelected` to the `PropertyType` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PropertyType" ADD COLUMN     "defaultSelected" BOOLEAN NOT NULL;
