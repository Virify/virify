-- CreateTable
CREATE TABLE "price_paid" (
    "transaction_id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "transfer_date" TIMESTAMP(3) NOT NULL,
    "postcode" TEXT,
    "property_type" TEXT,
    "old_new" TEXT,
    "duration" TEXT,
    "paon" TEXT,
    "saon" TEXT,
    "street" TEXT,
    "locality" TEXT,
    "town_city" TEXT,
    "district" TEXT,
    "county" TEXT,
    "ppd_category" TEXT,
    "record_status" TEXT,

    CONSTRAINT "price_paid_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateIndex
CREATE INDEX "price_paid_postcode_idx" ON "price_paid"("postcode");

-- CreateIndex
CREATE INDEX "price_paid_transfer_date_idx" ON "price_paid"("transfer_date");

-- CreateIndex
CREATE INDEX "price_paid_price_idx" ON "price_paid"("price");
