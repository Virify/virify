-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "AccessibilityFeaturesType" AS ENUM ('WHEELCHAIR_ACCESSIBLE', 'WHEELCHAIR_RAMP', 'ELEVATOR', 'STAIRS', 'PARKING', 'OTHER');

-- CreateEnum
CREATE TYPE "AgentRole" AS ENUM ('SENIOR', 'JUNIOR');

-- CreateEnum
CREATE TYPE "BedSizeType" AS ENUM ('SINGLE', 'DOUBLE', 'QUEEN', 'KING', 'SUPER_KING', 'BUNK');

-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('FOR_SALE', 'FOR_LONG_TERM_LET', 'SHORT_TERM_LET', 'AUCTION');

-- CreateEnum
CREATE TYPE "ListingTier" AS ENUM ('BASIC', 'PREMIUM', 'FEATURED');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('OFFERS_IN_EXCESS_OF', 'GUIDE_PRICE', 'OFFERS_IN_THE_REGION_OF', 'PER_CALENDAR_MONTH', 'PER_WEEK');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'UNDER_OFFER', 'SOLD', 'LET_AGREED');

-- CreateEnum
CREATE TYPE "OwnerRole" AS ENUM ('USER', 'AGENT');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('HOUSE', 'COTTAGE', 'BUNGALOW', 'CONDO', 'PENTHOUSE', 'FLAT', 'LAND', 'NEW_BUILD', 'SHARED_OWNERSHIP', 'RETIREMENT', 'STUDENT');

-- CreateEnum
CREATE TYPE "PropertyClassification" AS ENUM ('SEMI_DETACHED', 'END_OF_TERRACE', 'DETACHED', 'TERRACED', 'NON_WORKING_FARM', 'WORKING_FARM');

-- CreateEnum
CREATE TYPE "ConstructionType" AS ENUM ('STONE', 'BRICK', 'STANDARD');

-- CreateEnum
CREATE TYPE "RoofConstruction" AS ENUM ('SLATE_TILE', 'CONCRETE_TILE');

-- CreateEnum
CREATE TYPE "FurnishingStatus" AS ENUM ('FURNISHED', 'UNFURNISHED', 'PART_FURNISHED');

-- CreateEnum
CREATE TYPE "Tenure" AS ENUM ('LEASEHOLD', 'FREEHOLD');

-- CreateEnum
CREATE TYPE "EpcType" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G');

-- CreateEnum
CREATE TYPE "Reviewed" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "AdditionalFeatures" (
    "id" SERIAL NOT NULL,
    "investmentPotential" TEXT NOT NULL,
    "petPolicy" BOOLEAN NOT NULL,
    "accessibilityFeatures" "AccessibilityFeaturesType"[],
    "moveInDate" TIMESTAMP(3) NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdditionalFeatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "number" TEXT,
    "flat" TEXT,
    "street" TEXT,
    "city" TEXT,
    "postcode" TEXT,
    "country" TEXT,
    "county" TEXT,
    "propertyId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "location" geometry,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "ownerId" INTEGER NOT NULL,
    "role" "AgentRole" NOT NULL DEFAULT 'SENIOR',
    "passwordResetToken" TEXT,
    "lastLogin" TIMESTAMP(3),
    "activationToken" TEXT,
    "tokenExpiry" TIMESTAMP(3),
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amenities" (
    "id" SERIAL NOT NULL,
    "transportLinks" TEXT,
    "schools" TEXT,
    "hospitals" TEXT,
    "shopping" TEXT,
    "greenSpaces" TEXT,
    "description" TEXT,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bathroom" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL DEFAULT 1,
    "enSuite" BOOLEAN NOT NULL,
    "bathtub" BOOLEAN NOT NULL,
    "walkInShower" BOOLEAN NOT NULL,
    "downstairs" BOOLEAN NOT NULL,
    "upstairs" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "size" DOUBLE PRECISION,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bathroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bedroom" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL,
    "bed" "BedSizeType"[],
    "description" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "size" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bedroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diningroom" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL DEFAULT 1,
    "openConcept" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "size" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diningroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kitchen" (
    "id" SERIAL NOT NULL,
    "modern" BOOLEAN NOT NULL,
    "openPlan" BOOLEAN NOT NULL,
    "appliancesIncluded" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "size" DOUBLE PRECISION,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kitchen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "priceType" "PriceType" NOT NULL,
    "listingType" "ListingType" NOT NULL,
    "availabilityStatus" "AvailabilityStatus" NOT NULL,
    "listingTier" "ListingTier" NOT NULL,
    "ownerId" INTEGER,
    "propertyId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingCosts" (
    "id" SERIAL NOT NULL,
    "deposit" DOUBLE PRECISION NOT NULL,
    "upfrontCosts" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "listingId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ListingCosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LivingArea" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL DEFAULT 1,
    "fireplace" BOOLEAN NOT NULL,
    "balcony" BOOLEAN NOT NULL,
    "openConcept" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "size" DOUBLE PRECISION,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LivingArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "images" TEXT,
    "videoTour" TEXT,
    "floorPlans" TEXT,
    "metadata" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutdoorSpace" (
    "id" SERIAL NOT NULL,
    "land" BOOLEAN NOT NULL,
    "landSize" DOUBLE PRECISION,
    "garden" BOOLEAN NOT NULL,
    "gardenSize" DOUBLE PRECISION,
    "terrace" BOOLEAN NOT NULL,
    "balcony" BOOLEAN NOT NULL,
    "patio" BOOLEAN NOT NULL,
    "separateParcel" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutdoorSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Owner" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "mainContact" TEXT,
    "password" TEXT,
    "businessName" TEXT,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "county" TEXT,
    "postcode" TEXT,
    "country" TEXT,
    "companyRegistration" TEXT,
    "umbrellaId" INTEGER,
    "role" "OwnerRole" NOT NULL DEFAULT 'USER',
    "passwordResetToken" TEXT,
    "passwordResetTokenExpiry" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parking" (
    "id" SERIAL NOT NULL,
    "garage" BOOLEAN NOT NULL,
    "driveway" BOOLEAN NOT NULL,
    "permitParking" BOOLEAN NOT NULL,
    "onStreet" BOOLEAN NOT NULL,
    "noParking" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "propertyValue" DOUBLE PRECISION,
    "propertyType" "PropertyType" NOT NULL,
    "propertyClassification" "PropertyClassification" NOT NULL,
    "size" DOUBLE PRECISION,
    "yearBuilt" TEXT NOT NULL,
    "constructionType" "ConstructionType" NOT NULL,
    "roofConstruction" "RoofConstruction" NOT NULL,
    "floorLevel" INTEGER,
    "furnishingStatus" "FurnishingStatus" NOT NULL,
    "tenure" "Tenure" NOT NULL,
    "leaseTerm" INTEGER,
    "addressId" INTEGER,
    "bedrooms" INTEGER NOT NULL DEFAULT 3,
    "bathrooms" INTEGER NOT NULL DEFAULT 1,
    "kitchens" INTEGER NOT NULL DEFAULT 1,
    "livingRooms" INTEGER NOT NULL DEFAULT 1,
    "diningRooms" INTEGER NOT NULL DEFAULT 1,
    "ownerId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunningCosts" (
    "id" SERIAL NOT NULL,
    "councilTaxBand" TEXT NOT NULL,
    "serviceCharges" DOUBLE PRECISION,
    "groundRent" DOUBLE PRECISION,
    "epc" "EpcType" NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RunningCosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Security" (
    "id" SERIAL NOT NULL,
    "gatedCommunity" BOOLEAN NOT NULL,
    "cctv" BOOLEAN NOT NULL,
    "alarmSystem" BOOLEAN NOT NULL,
    "neighborhoodWatch" BOOLEAN NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Security_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Storage" (
    "id" SERIAL NOT NULL,
    "closets" BOOLEAN NOT NULL,
    "attic" BOOLEAN NOT NULL,
    "basement" BOOLEAN NOT NULL,
    "walkInWardrobe" BOOLEAN NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Umbrella" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "county" TEXT,
    "postcode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "companyRegistration" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Umbrella_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "identity" BOOLEAN,
    "address" BOOLEAN,
    "bank" BOOLEAN,
    "payslip" BOOLEAN,
    "business" BOOLEAN,
    "reviewed" "Reviewed" NOT NULL DEFAULT 'PENDING',
    "reviewToken" TEXT,
    "reviewTokenExpiry" TIMESTAMP(3),
    "activated" BOOLEAN NOT NULL DEFAULT false,
    "activationToken" TEXT,
    "activationTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AgentToListing" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AgentToListing_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_AgentToProperty" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AgentToProperty_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdditionalFeatures_propertyId_key" ON "AdditionalFeatures"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_propertyId_key" ON "Address"("propertyId");

-- CreateIndex
CREATE INDEX "address_location_idx" ON "Address" USING GIST ("location");

-- CreateIndex
CREATE INDEX "address_postcode_idx" ON "Address"("postcode");

-- CreateIndex
CREATE INDEX "address_city_idx" ON "Address"("city");

-- CreateIndex
CREATE INDEX "address_street_idx" ON "Address"("street");

-- CreateIndex
CREATE UNIQUE INDEX "Address_street_city_postcode_country_key" ON "Address"("street", "city", "postcode", "country");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "Agent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_activationToken_key" ON "Agent"("activationToken");

-- CreateIndex
CREATE INDEX "Agent_ownerId_idx" ON "Agent"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Kitchen_propertyId_key" ON "Kitchen"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_propertyId_key" ON "Listing"("propertyId");

-- CreateIndex
CREATE INDEX "Listing_ownerId_idx" ON "Listing"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "ListingCosts_listingId_key" ON "ListingCosts"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "OutdoorSpace_propertyId_key" ON "OutdoorSpace"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_username_key" ON "Owner"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_email_key" ON "Owner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_passwordResetToken_key" ON "Owner"("passwordResetToken");

-- CreateIndex
CREATE INDEX "Owner_umbrellaId_idx" ON "Owner"("umbrellaId");

-- CreateIndex
CREATE UNIQUE INDEX "Parking_propertyId_key" ON "Parking"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Property_addressId_key" ON "Property"("addressId");

-- CreateIndex
CREATE INDEX "Property_ownerId_idx" ON "Property"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "RunningCosts_propertyId_key" ON "RunningCosts"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Security_propertyId_key" ON "Security"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Storage_propertyId_key" ON "Storage"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Umbrella_companyRegistration_key" ON "Umbrella"("companyRegistration");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_ownerId_key" ON "Verification"("ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_reviewToken_key" ON "Verification"("reviewToken");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_activationToken_key" ON "Verification"("activationToken");

-- CreateIndex
CREATE INDEX "_AgentToListing_B_index" ON "_AgentToListing"("B");

-- CreateIndex
CREATE INDEX "_AgentToProperty_B_index" ON "_AgentToProperty"("B");

-- AddForeignKey
ALTER TABLE "AdditionalFeatures" ADD CONSTRAINT "AdditionalFeatures_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amenities" ADD CONSTRAINT "Amenities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bathroom" ADD CONSTRAINT "Bathroom_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bedroom" ADD CONSTRAINT "Bedroom_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diningroom" ADD CONSTRAINT "Diningroom_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kitchen" ADD CONSTRAINT "Kitchen_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingCosts" ADD CONSTRAINT "ListingCosts_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LivingArea" ADD CONSTRAINT "LivingArea_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutdoorSpace" ADD CONSTRAINT "OutdoorSpace_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Owner" ADD CONSTRAINT "Owner_umbrellaId_fkey" FOREIGN KEY ("umbrellaId") REFERENCES "Umbrella"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parking" ADD CONSTRAINT "Parking_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunningCosts" ADD CONSTRAINT "RunningCosts_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Security" ADD CONSTRAINT "Security_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Storage" ADD CONSTRAINT "Storage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentToListing" ADD CONSTRAINT "_AgentToListing_A_fkey" FOREIGN KEY ("A") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentToListing" ADD CONSTRAINT "_AgentToListing_B_fkey" FOREIGN KEY ("B") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentToProperty" ADD CONSTRAINT "_AgentToProperty_A_fkey" FOREIGN KEY ("A") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentToProperty" ADD CONSTRAINT "_AgentToProperty_B_fkey" FOREIGN KEY ("B") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
