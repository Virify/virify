-- DropForeignKey
ALTER TABLE "Accessibility" DROP CONSTRAINT "Accessibility_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "AdditionalFeatures" DROP CONSTRAINT "AdditionalFeatures_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "AdditionalToilet" DROP CONSTRAINT "AdditionalToilet_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Amenities" DROP CONSTRAINT "Amenities_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Bathroom" DROP CONSTRAINT "Bathroom_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Bedroom" DROP CONSTRAINT "Bedroom_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Diningroom" DROP CONSTRAINT "Diningroom_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "EnergyAndUtilities" DROP CONSTRAINT "EnergyAndUtilities_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Kitchen" DROP CONSTRAINT "Kitchen_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Land" DROP CONSTRAINT "Land_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "LivingArea" DROP CONSTRAINT "LivingArea_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "OutdoorSpace" DROP CONSTRAINT "OutdoorSpace_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Parking" DROP CONSTRAINT "Parking_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_addressId_fkey";

-- DropForeignKey
ALTER TABLE "Reception" DROP CONSTRAINT "Reception_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "RunningCosts" DROP CONSTRAINT "RunningCosts_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Security" DROP CONSTRAINT "Security_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Storage" DROP CONSTRAINT "Storage_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "Utility" DROP CONSTRAINT "Utility_propertyId_fkey";

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accessibility" ADD CONSTRAINT "Accessibility_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalFeatures" ADD CONSTRAINT "AdditionalFeatures_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amenities" ADD CONSTRAINT "Amenities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bathroom" ADD CONSTRAINT "Bathroom_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bedroom" ADD CONSTRAINT "Bedroom_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diningroom" ADD CONSTRAINT "Diningroom_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyAndUtilities" ADD CONSTRAINT "EnergyAndUtilities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kitchen" ADD CONSTRAINT "Kitchen_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Land" ADD CONSTRAINT "Land_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LivingArea" ADD CONSTRAINT "LivingArea_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutdoorSpace" ADD CONSTRAINT "OutdoorSpace_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parking" ADD CONSTRAINT "Parking_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reception" ADD CONSTRAINT "Reception_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunningCosts" ADD CONSTRAINT "RunningCosts_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Security" ADD CONSTRAINT "Security_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Storage" ADD CONSTRAINT "Storage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalToilet" ADD CONSTRAINT "AdditionalToilet_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Utility" ADD CONSTRAINT "Utility_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
