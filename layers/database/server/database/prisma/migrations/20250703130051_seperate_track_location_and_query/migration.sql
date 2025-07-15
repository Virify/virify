/*
  Warnings:

  - You are about to drop the `TrackSearch` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TrackSearch";

-- CreateTable
CREATE TABLE "TrackLocation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "TrackLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackQuery" (
    "id" SERIAL NOT NULL,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "TrackQuery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TrackLocation_location_key" ON "TrackLocation"("location");

-- CreateIndex
CREATE UNIQUE INDEX "TrackQuery_query_key" ON "TrackQuery"("query");
