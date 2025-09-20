-- CreateTable
CREATE TABLE "DraftListing" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "moveInDate" TIMESTAMP(3),
    "listingTier" "ListingTier" NOT NULL,
    "listingStartDate" TIMESTAMP(3),
    "listingEndDate" TIMESTAMP(3),
    "viewingOptions" TEXT,
    "verificationLevel" "VerificationLevel",
    "userId" INTEGER,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rentalListingId" INTEGER,
    "saleListingId" INTEGER,

    CONSTRAINT "DraftListing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DraftListing_userId_idx" ON "DraftListing"("userId");

-- CreateIndex
CREATE INDEX "DraftListing_propertyId_idx" ON "DraftListing"("propertyId");

-- CreateIndex
CREATE INDEX "DraftListing_price_idx" ON "DraftListing"("price");

-- AddForeignKey
ALTER TABLE "DraftListing" ADD CONSTRAINT "DraftListing_rentalListingId_fkey" FOREIGN KEY ("rentalListingId") REFERENCES "RentalListing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftListing" ADD CONSTRAINT "DraftListing_saleListingId_fkey" FOREIGN KEY ("saleListingId") REFERENCES "SaleListing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftListing" ADD CONSTRAINT "DraftListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftListing" ADD CONSTRAINT "DraftListing_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
