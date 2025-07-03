/*
  Warnings:

  - A unique constraint covering the columns `[aiQuery,location]` on the table `TrackSearch` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TrackSearch" ADD COLUMN     "count" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "TrackSearch_aiQuery_location_key" ON "TrackSearch"("aiQuery", "location");
