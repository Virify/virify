/*
  Warnings:

  - A unique constraint covering the columns `[number,street,city,postcode,country]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Address_street_city_postcode_country_key";

-- CreateIndex
CREATE UNIQUE INDEX "Address_number_street_city_postcode_country_key" ON "Address"("number", "street", "city", "postcode", "country");
