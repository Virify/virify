/*
  Warnings:

  - You are about to drop the `TrackLocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrackQuery` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TrackLocation";

-- DropTable
DROP TABLE "TrackQuery";

-- CreateTable
CREATE TABLE "TrackSearch" (
    "id" SERIAL NOT NULL,
    "locationPlaceName" TEXT NOT NULL,
    "locationText" TEXT NOT NULL,
    "locationLat" DOUBLE PRECISION NOT NULL,
    "locationLon" DOUBLE PRECISION NOT NULL,
    "radius" INTEGER NOT NULL,
    "query" TEXT NOT NULL,
    "resultCount" INTEGER NOT NULL DEFAULT 0,
    "userIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackSearch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TrackSearch_locationPlaceName_idx" ON "TrackSearch"("locationPlaceName");

-- CreateIndex
CREATE INDEX "TrackSearch_query_idx" ON "TrackSearch"("query");

-- CreateIndex
CREATE INDEX "TrackSearch_createdAt_idx" ON "TrackSearch"("createdAt");

-- CreateIndex
CREATE INDEX "TrackSearch_resultCount_idx" ON "TrackSearch"("resultCount");

-- CreateIndex
CREATE UNIQUE INDEX "TrackSearch_locationPlaceName_radius_query_key" ON "TrackSearch"("locationPlaceName", "radius", "query");
