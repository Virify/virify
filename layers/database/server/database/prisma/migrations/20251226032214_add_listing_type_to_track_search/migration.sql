/*
  Warnings:

  - A unique constraint covering the columns `[listingType,locationPlaceName,radius,query]` on the table `TrackSearch` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `listingType` to the `TrackSearch` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('SALE', 'RENT', 'ALL');

-- DropIndex
DROP INDEX "TrackSearch_locationPlaceName_radius_query_key";

-- AlterTable
ALTER TABLE "TrackSearch" ADD COLUMN     "listingType" "ListingType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TrackSearch_listingType_locationPlaceName_radius_query_key" ON "TrackSearch"("listingType", "locationPlaceName", "radius", "query");
