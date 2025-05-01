-- DropForeignKey
ALTER TABLE "Listing" DROP CONSTRAINT "Listing_propertyId_fkey";

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lon" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
