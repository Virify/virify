/*
  Warnings:

  - You are about to drop the column `latitude` on the `Address` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Address` table. All the data in the column will be lost.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis" WITH VERSION "3.4.2";

-- AlterTable
ALTER TABLE "Address" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "location" geometry(Point, 4326),
ADD COLUMN     "number" TEXT,
ALTER COLUMN "street" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "postcode" DROP NOT NULL,
ALTER COLUMN "country" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "address_location_idx" ON "Address" USING GIST ("location");

-- CreateIndex
CREATE INDEX "address_postcode_idx" ON "Address"("postcode");

-- CreateIndex
CREATE INDEX "address_city_idx" ON "Address"("city");

-- CreateIndex
CREATE INDEX "address_street_idx" ON "Address"("street");
