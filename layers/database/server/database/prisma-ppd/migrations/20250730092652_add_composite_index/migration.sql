-- CreateIndex
CREATE INDEX "price_paid_postcode_paon_street_town_city_county_idx" ON "price_paid"("postcode", "paon", "street", "town_city", "county");
