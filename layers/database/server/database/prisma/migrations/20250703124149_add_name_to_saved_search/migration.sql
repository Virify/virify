/*
  Warnings:

  - Added the required column `name` to the `TrackSearch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TrackSearch" ADD COLUMN     "name" TEXT NOT NULL;
