-- DropForeignKey
ALTER TABLE "RentalListing" DROP CONSTRAINT "RentalListing_draftListingId_fkey";

-- DropForeignKey
ALTER TABLE "SaleListing" DROP CONSTRAINT "SaleListing_draftListingId_fkey";

-- AddForeignKey
ALTER TABLE "RentalListing" ADD CONSTRAINT "RentalListing_draftListingId_fkey" FOREIGN KEY ("draftListingId") REFERENCES "DraftListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleListing" ADD CONSTRAINT "SaleListing_draftListingId_fkey" FOREIGN KEY ("draftListingId") REFERENCES "DraftListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
