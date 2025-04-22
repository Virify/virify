-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "AgentRole" AS ENUM ('SENIOR', 'JUNIOR');

-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('FOR_SALE', 'FOR_LONG_TERM_LET', 'SHORT_TERM_LET', 'AUCTION');

-- CreateEnum
CREATE TYPE "ListingTier" AS ENUM ('BASIC', 'PREMIUM', 'FEATURED');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('OFFERS_IN_EXCESS_OF', 'GUIDE_PRICE', 'OFFERS_IN_THE_REGION_OF', 'PER_CALENDAR_MONTH', 'PER_WEEK');

-- CreateEnum
CREATE TYPE "AvailabilityStatus" AS ENUM ('AVAILABLE', 'UNDER_OFFER', 'SOLD', 'LET_AGREED');

-- CreateEnum
CREATE TYPE "AmenityType" AS ENUM ('TRANSPORT', 'EDUCATION', 'HEALTHCARE', 'SHOPPING_ENTERTAINMENT', 'GREEN_SPACE');

-- CreateEnum
CREATE TYPE "AmenitySubtype" AS ENUM ('TRAIN_STATION', 'BUS_STOP', 'MOTORWAY_ACCESS', 'SCHOOL', 'UNIVERSITY', 'HOSPITAL', 'MEDICAL_CENTRE', 'SHOP', 'RESTAURANT', 'CINEMA', 'GYM', 'PARK', 'TRAIL', 'PLAYGROUND', 'OTHER');

-- CreateEnum
CREATE TYPE "BedSizeType" AS ENUM ('SINGLE', 'DOUBLE', 'QUEEN', 'KING', 'SUPER_KING', 'BUNK');

-- CreateEnum
CREATE TYPE "EPCRating" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "HeatingType" AS ENUM ('GAS_CENTRAL', 'ELECTRIC', 'OIL', 'UNDERFLOOR', 'BIOMASS', 'HEAT_PUMP', 'DISTRICT', 'STORAGE_HEATERS', 'OTHER');

-- CreateEnum
CREATE TYPE "BoilerType" AS ENUM ('COMBI', 'SYSTEM', 'CONVENTIONAL', 'BACK_BOILER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "HotWaterSource" AS ENUM ('BOILER', 'IMMERSION_HEATER', 'SOLAR_THERMAL', 'HEAT_PUMP', 'OTHER');

-- CreateEnum
CREATE TYPE "BroadbandType" AS ENUM ('ADSL', 'FTTC', 'FTTP', 'CABLE', 'MOBILE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "PlanningClassification" AS ENUM ('AGRICULTURAL', 'RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'MIXED_USE', 'OTHER');

-- CreateEnum
CREATE TYPE "LandUse" AS ENUM ('GRAZING', 'ARABLE', 'PASTURE', 'FORESTRY', 'EQUESTRIAN', 'HORTICULTURE', 'CONSERVATION', 'MIXED', 'VACANT', 'OTHER');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('HOUSE', 'COTTAGE', 'BUNGALOW', 'PENTHOUSE', 'FLAT', 'LAND', 'FARM', 'SHARED_OWNERSHIP', 'RETIREMENT_HOME', 'NEW_BUILD_HOME', 'STUDENT_ACCOMMODATION');

-- CreateEnum
CREATE TYPE "PropertyClassification" AS ENUM ('TERRACED_HOUSE', 'SEMI_DETACHED_HOUSE', 'END_OF_TERRACE_HOUSE', 'DETACHED_HOUSE', 'MANSION', 'TERRACED_COTTAGE', 'SEMI_DETACHED_COTTAGE', 'END_OF_TERRACE_COTTAGE', 'DETACHED_COTTAGE', 'TERRACED_BUNGALOW', 'SEMI_DETACHED_BUNGALOW', 'END_OF_TERRACE_BUNGALOW', 'DETACHED_BUNGALOW', 'PENTHOUSE', 'CONVERTED_FLAT', 'STUDIO_FLAT', 'MAISONETTE', 'HIGH_RISE_FLAT', 'COMPLEX_FLAT', 'RESIDENTIAL_LAND', 'COMMERCIAL_LAND', 'AGRICULTURAL_LAND', 'DEVELOPMENT_PLOT', 'NON_WORKING_FARMHOUSE', 'WORKING_FARM', 'SHARED_OWNERSHIP', 'RETIREMENT_HOME', 'NEW_BUILD_HOME', 'STUDENT_FLAT', 'STUDENT_HOUSE', 'STUDENT_HOUSE_SHARE');

-- CreateEnum
CREATE TYPE "ConstructionType" AS ENUM ('STANDARD', 'NON_STANDARD');

-- CreateEnum
CREATE TYPE "RoofConstruction" AS ENUM ('SLATE_TILE', 'CONCRETE_TILE');

-- CreateEnum
CREATE TYPE "FurnishingStatus" AS ENUM ('FURNISHED', 'UNFURNISHED', 'PART_FURNISHED');

-- CreateEnum
CREATE TYPE "Tenure" AS ENUM ('LEASEHOLD', 'FREEHOLD');

-- CreateEnum
CREATE TYPE "FireplaceType" AS ENUM ('LOG_BURNER', 'OPEN_FIRE');

-- CreateEnum
CREATE TYPE "Reviewed" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

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
    "estateAgentId" INTEGER NOT NULL,
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
CREATE TABLE "EstateAgent" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "mainContact" TEXT,
    "phoneNumber" TEXT,
    "password" TEXT,
    "businessName" TEXT,
    "companyRegistration" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetTokenExpiry" TIMESTAMP(3),
    "otpCode" TEXT,
    "otpCodeExpiry" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "addressId" INTEGER,

    CONSTRAINT "EstateAgent_pkey" PRIMARY KEY ("id")
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
    "userId" INTEGER,
    "propertyId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "estateAgentId" INTEGER,

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
CREATE TABLE "Accessibility" (
    "id" SERIAL NOT NULL,
    "wheelchairFriendly" BOOLEAN NOT NULL DEFAULT false,
    "stepFreeAccess" BOOLEAN NOT NULL DEFAULT false,
    "wideDoorways" BOOLEAN NOT NULL DEFAULT false,
    "wetRoom" BOOLEAN NOT NULL DEFAULT false,
    "handrails" BOOLEAN NOT NULL DEFAULT false,
    "elevator" BOOLEAN NOT NULL DEFAULT false,
    "stairs" BOOLEAN NOT NULL DEFAULT false,
    "accessibleParking" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Accessibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdditionalFeatures" (
    "id" SERIAL NOT NULL,
    "petFriendly" BOOLEAN NOT NULL DEFAULT true,
    "moveInDate" TIMESTAMP(3) NOT NULL,
    "homeOffice" BOOLEAN NOT NULL DEFAULT false,
    "pool" BOOLEAN NOT NULL DEFAULT false,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdditionalFeatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amenities" (
    "id" SERIAL NOT NULL,
    "type" "AmenityType" NOT NULL,
    "subtype" "AmenitySubtype",
    "name" TEXT NOT NULL,
    "distanceM" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "location" JSONB,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bathroom" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL,
    "enSuite" BOOLEAN NOT NULL DEFAULT false,
    "bathtub" BOOLEAN NOT NULL DEFAULT true,
    "walkInShower" BOOLEAN NOT NULL DEFAULT false,
    "downstairs" BOOLEAN NOT NULL DEFAULT false,
    "upstairs" BOOLEAN NOT NULL DEFAULT true,
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
    "enSuite" BOOLEAN NOT NULL DEFAULT false,
    "builtInStorage" BOOLEAN NOT NULL DEFAULT false,
    "walkInWardrobe" BOOLEAN NOT NULL DEFAULT false,
    "size" DOUBLE PRECISION,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bedroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diningroom" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL DEFAULT 1,
    "openConcept" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "size" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diningroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnergyAndUtilities" (
    "id" SERIAL NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "epcRating" "EPCRating",
    "epcCertificateUrl" TEXT,
    "primaryHeatingType" "HeatingType",
    "secondaryHeatingType" "HeatingType",
    "boilerType" "BoilerType",
    "hotWaterSource" "HotWaterSource",
    "solarPanels" BOOLEAN NOT NULL DEFAULT false,
    "batteryStorage" BOOLEAN NOT NULL DEFAULT false,
    "smartMeterInstalled" BOOLEAN NOT NULL DEFAULT false,
    "evChargingPointInstalled" BOOLEAN NOT NULL DEFAULT false,
    "broadbandType" "BroadbandType",
    "fullFibreAvailable" BOOLEAN NOT NULL DEFAULT false,
    "maxDownloadSpeedMbps" DOUBLE PRECISION,
    "mainsGas" BOOLEAN NOT NULL DEFAULT false,
    "mainsElectricity" BOOLEAN NOT NULL DEFAULT false,
    "mainsWater" BOOLEAN NOT NULL DEFAULT false,
    "privateWaterSupply" BOOLEAN NOT NULL DEFAULT false,
    "mainsDrainage" BOOLEAN NOT NULL DEFAULT false,
    "septicTank" BOOLEAN NOT NULL DEFAULT false,
    "cesspool" BOOLEAN NOT NULL DEFAULT false,
    "rainwaterHarvestingSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnergyAndUtilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kitchen" (
    "id" SERIAL NOT NULL,
    "modern" BOOLEAN NOT NULL DEFAULT true,
    "openPlan" BOOLEAN NOT NULL DEFAULT false,
    "appliancesIncluded" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT NOT NULL,
    "size" DOUBLE PRECISION,
    "breakfastBar" BOOLEAN NOT NULL DEFAULT false,
    "island" BOOLEAN NOT NULL DEFAULT false,
    "utilityAccess" BOOLEAN NOT NULL DEFAULT false,
    "pantry" BOOLEAN NOT NULL DEFAULT true,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kitchen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Land" (
    "id" SERIAL NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "planningClassification" "PlanningClassification" NOT NULL,
    "landSize" DOUBLE PRECISION,
    "accessRights" BOOLEAN NOT NULL DEFAULT false,
    "roadFrontage" BOOLEAN NOT NULL DEFAULT false,
    "utilitiesAvailable" BOOLEAN NOT NULL DEFAULT false,
    "currentUse" "LandUse" NOT NULL,
    "agriculturalSubsidies" BOOLEAN NOT NULL DEFAULT false,
    "stewardshipScheme" BOOLEAN NOT NULL DEFAULT false,
    "tenanted" BOOLEAN NOT NULL DEFAULT false,
    "vacant" BOOLEAN NOT NULL DEFAULT true,
    "agriculturalUse" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Land_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LivingArea" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL,
    "fireplace" "FireplaceType",
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT NOT NULL,
    "size" DOUBLE PRECISION,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LivingArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutdoorSpace" (
    "id" SERIAL NOT NULL,
    "frontGarden" BOOLEAN NOT NULL DEFAULT false,
    "frontGardenSize" DOUBLE PRECISION,
    "rearGarden" BOOLEAN NOT NULL DEFAULT false,
    "rearGardenSize" DOUBLE PRECISION,
    "sunTerrace" BOOLEAN NOT NULL DEFAULT false,
    "terrace" BOOLEAN NOT NULL DEFAULT false,
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "patio" BOOLEAN NOT NULL DEFAULT false,
    "separateParcel" BOOLEAN NOT NULL DEFAULT false,
    "shed" BOOLEAN NOT NULL DEFAULT false,
    "summerHouse" BOOLEAN NOT NULL DEFAULT false,
    "gardenOffice" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OutdoorSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parking" (
    "id" SERIAL NOT NULL,
    "garage" BOOLEAN NOT NULL,
    "driveway" BOOLEAN NOT NULL,
    "permitParking" BOOLEAN NOT NULL,
    "onStreet" BOOLEAN NOT NULL,
    "noParking" BOOLEAN NOT NULL,
    "carport" BOOLEAN NOT NULL,
    "allocatedParking" BOOLEAN NOT NULL,
    "evCharging" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "type" "PropertyType" NOT NULL,
    "classification" "PropertyClassification" NOT NULL,
    "size" DOUBLE PRECISION,
    "yearBuilt" TEXT NOT NULL,
    "constructionType" "ConstructionType" NOT NULL,
    "roofConstruction" "RoofConstruction" NOT NULL,
    "floorLevel" INTEGER,
    "furnishingStatus" "FurnishingStatus" NOT NULL,
    "tenure" "Tenure" NOT NULL,
    "leaseTerm" INTEGER,
    "addressId" INTEGER,
    "userId" INTEGER,
    "agentId" INTEGER,
    "estateAgentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reception" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "size" DOUBLE PRECISION,
    "openPlan" BOOLEAN NOT NULL DEFAULT false,
    "fireplace" "FireplaceType",
    "gamesRoom" BOOLEAN NOT NULL DEFAULT false,
    "homeCinema" BOOLEAN NOT NULL DEFAULT false,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reception_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunningCosts" (
    "id" SERIAL NOT NULL,
    "councilTaxBand" TEXT NOT NULL,
    "serviceCharges" DOUBLE PRECISION,
    "groundRent" DOUBLE PRECISION,
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
    "intercomSystem" BOOLEAN NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Security_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Storage" (
    "id" SERIAL NOT NULL,
    "attic" BOOLEAN NOT NULL DEFAULT false,
    "basement" BOOLEAN NOT NULL DEFAULT false,
    "separateDressing" BOOLEAN NOT NULL DEFAULT false,
    "underStairs" BOOLEAN NOT NULL DEFAULT false,
    "pantry" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdditionalToilet" (
    "id" SERIAL NOT NULL,
    "downstairs" BOOLEAN NOT NULL DEFAULT false,
    "upstairs" BOOLEAN NOT NULL DEFAULT false,
    "guestCloakroom" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdditionalToilet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Utility" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "appliances" TEXT[],
    "storage" BOOLEAN NOT NULL DEFAULT false,
    "sink" BOOLEAN NOT NULL DEFAULT false,
    "plumbing" BOOLEAN NOT NULL DEFAULT false,
    "size" DOUBLE PRECISION,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Utility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "password" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetTokenExpiry" TIMESTAMP(3),
    "otpCode" TEXT,
    "otpCodeExpiry" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "addressId" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "estateAgentId" INTEGER,
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
CREATE INDEX "Address_propertyId_idx" ON "Address"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Address_street_city_postcode_country_key" ON "Address"("street", "city", "postcode", "country");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "Agent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_activationToken_key" ON "Agent"("activationToken");

-- CreateIndex
CREATE INDEX "Agent_estateAgentId_idx" ON "Agent"("estateAgentId");

-- CreateIndex
CREATE UNIQUE INDEX "EstateAgent_email_key" ON "EstateAgent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EstateAgent_passwordResetToken_key" ON "EstateAgent"("passwordResetToken");

-- CreateIndex
CREATE UNIQUE INDEX "Listing_propertyId_key" ON "Listing"("propertyId");

-- CreateIndex
CREATE INDEX "Listing_userId_idx" ON "Listing"("userId");

-- CreateIndex
CREATE INDEX "Listing_propertyId_idx" ON "Listing"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "ListingCosts_listingId_key" ON "ListingCosts"("listingId");

-- CreateIndex
CREATE INDEX "Media_propertyId_idx" ON "Media"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Accessibility_propertyId_key" ON "Accessibility"("propertyId");

-- CreateIndex
CREATE INDEX "Accessibility_propertyId_idx" ON "Accessibility"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "AdditionalFeatures_propertyId_key" ON "AdditionalFeatures"("propertyId");

-- CreateIndex
CREATE INDEX "AdditionalFeatures_propertyId_idx" ON "AdditionalFeatures"("propertyId");

-- CreateIndex
CREATE INDEX "Amenities_propertyId_idx" ON "Amenities"("propertyId");

-- CreateIndex
CREATE INDEX "Bathroom_propertyId_idx" ON "Bathroom"("propertyId");

-- CreateIndex
CREATE INDEX "Bedroom_propertyId_idx" ON "Bedroom"("propertyId");

-- CreateIndex
CREATE INDEX "Diningroom_propertyId_idx" ON "Diningroom"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "EnergyAndUtilities_propertyId_key" ON "EnergyAndUtilities"("propertyId");

-- CreateIndex
CREATE INDEX "EnergyAndUtilities_propertyId_idx" ON "EnergyAndUtilities"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Kitchen_propertyId_key" ON "Kitchen"("propertyId");

-- CreateIndex
CREATE INDEX "Kitchen_propertyId_idx" ON "Kitchen"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Land_propertyId_key" ON "Land"("propertyId");

-- CreateIndex
CREATE INDEX "Land_propertyId_idx" ON "Land"("propertyId");

-- CreateIndex
CREATE INDEX "LivingArea_propertyId_idx" ON "LivingArea"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "OutdoorSpace_propertyId_key" ON "OutdoorSpace"("propertyId");

-- CreateIndex
CREATE INDEX "OutdoorSpace_propertyId_idx" ON "OutdoorSpace"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Parking_propertyId_key" ON "Parking"("propertyId");

-- CreateIndex
CREATE INDEX "Parking_propertyId_idx" ON "Parking"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Property_addressId_key" ON "Property"("addressId");

-- CreateIndex
CREATE INDEX "Property_userId_idx" ON "Property"("userId");

-- CreateIndex
CREATE INDEX "Property_agentId_idx" ON "Property"("agentId");

-- CreateIndex
CREATE INDEX "Reception_propertyId_idx" ON "Reception"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "RunningCosts_propertyId_key" ON "RunningCosts"("propertyId");

-- CreateIndex
CREATE INDEX "RunningCosts_propertyId_idx" ON "RunningCosts"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Security_propertyId_key" ON "Security"("propertyId");

-- CreateIndex
CREATE INDEX "Security_propertyId_idx" ON "Security"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Storage_propertyId_key" ON "Storage"("propertyId");

-- CreateIndex
CREATE INDEX "Storage_propertyId_idx" ON "Storage"("propertyId");

-- CreateIndex
CREATE INDEX "AdditionalToilet_propertyId_idx" ON "AdditionalToilet"("propertyId");

-- CreateIndex
CREATE INDEX "Utility_propertyId_idx" ON "Utility"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_passwordResetToken_key" ON "User"("passwordResetToken");

-- CreateIndex
CREATE INDEX "User_addressId_idx" ON "User"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_userId_key" ON "Verification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_estateAgentId_key" ON "Verification"("estateAgentId");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_reviewToken_key" ON "Verification"("reviewToken");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_activationToken_key" ON "Verification"("activationToken");

-- CreateIndex
CREATE INDEX "_AgentToListing_B_index" ON "_AgentToListing"("B");

-- CreateIndex
CREATE INDEX "_AgentToProperty_B_index" ON "_AgentToProperty"("B");

-- AddForeignKey
ALTER TABLE "Agent" ADD CONSTRAINT "Agent_estateAgentId_fkey" FOREIGN KEY ("estateAgentId") REFERENCES "EstateAgent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstateAgent" ADD CONSTRAINT "EstateAgent_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_estateAgentId_fkey" FOREIGN KEY ("estateAgentId") REFERENCES "EstateAgent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingCosts" ADD CONSTRAINT "ListingCosts_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Accessibility" ADD CONSTRAINT "Accessibility_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalFeatures" ADD CONSTRAINT "AdditionalFeatures_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amenities" ADD CONSTRAINT "Amenities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bathroom" ADD CONSTRAINT "Bathroom_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bedroom" ADD CONSTRAINT "Bedroom_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diningroom" ADD CONSTRAINT "Diningroom_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnergyAndUtilities" ADD CONSTRAINT "EnergyAndUtilities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kitchen" ADD CONSTRAINT "Kitchen_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Land" ADD CONSTRAINT "Land_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LivingArea" ADD CONSTRAINT "LivingArea_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutdoorSpace" ADD CONSTRAINT "OutdoorSpace_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parking" ADD CONSTRAINT "Parking_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_estateAgentId_fkey" FOREIGN KEY ("estateAgentId") REFERENCES "EstateAgent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reception" ADD CONSTRAINT "Reception_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunningCosts" ADD CONSTRAINT "RunningCosts_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Security" ADD CONSTRAINT "Security_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Storage" ADD CONSTRAINT "Storage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdditionalToilet" ADD CONSTRAINT "AdditionalToilet_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Utility" ADD CONSTRAINT "Utility_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_estateAgentId_fkey" FOREIGN KEY ("estateAgentId") REFERENCES "EstateAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentToListing" ADD CONSTRAINT "_AgentToListing_A_fkey" FOREIGN KEY ("A") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentToListing" ADD CONSTRAINT "_AgentToListing_B_fkey" FOREIGN KEY ("B") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentToProperty" ADD CONSTRAINT "_AgentToProperty_A_fkey" FOREIGN KEY ("A") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AgentToProperty" ADD CONSTRAINT "_AgentToProperty_B_fkey" FOREIGN KEY ("B") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
