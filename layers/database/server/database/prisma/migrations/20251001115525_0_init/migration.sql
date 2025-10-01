-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "public"."AgentRole" AS ENUM ('SENIOR', 'JUNIOR');

-- CreateEnum
CREATE TYPE "public"."ListingTier" AS ENUM ('BASIC', 'PREMIUM', 'FEATURED');

-- CreateEnum
CREATE TYPE "public"."VerificationLevel" AS ENUM ('UNVERIFIED', 'BASIC', 'VERIFIED', 'FULLY_VERIFIED');

-- CreateEnum
CREATE TYPE "public"."FurnishedStatus" AS ENUM ('FURNISHED', 'UNFURNISHED', 'PART_FURNISHED');

-- CreateEnum
CREATE TYPE "public"."RentalPriceType" AS ENUM ('WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "public"."RentalAvailabilityStatus" AS ENUM ('AVAILABLE', 'LET_AGREED', 'LET');

-- CreateEnum
CREATE TYPE "public"."TenureType" AS ENUM ('FREEHOLD', 'LEASEHOLD', 'COMMONHOLD');

-- CreateEnum
CREATE TYPE "public"."SalePriceType" AS ENUM ('FIXED', 'OFFERS_OVER', 'GUIDE_PRICE');

-- CreateEnum
CREATE TYPE "public"."SaleAvailabilityStatus" AS ENUM ('AVAILABLE', 'UNDER_OFFER', 'SOLD');

-- CreateEnum
CREATE TYPE "public"."MembershipType" AS ENUM ('FREE', 'BASIC', 'FEATURED', 'PREMIUM', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "public"."MembershipStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."AmenityType" AS ENUM ('TRANSPORT', 'EDUCATION', 'HEALTHCARE', 'SHOPPING_ENTERTAINMENT', 'GREEN_SPACE');

-- CreateEnum
CREATE TYPE "public"."AmenitySubtype" AS ENUM ('TRAIN_STATION', 'BUS_STOP', 'MOTORWAY_ACCESS', 'SCHOOL', 'UNIVERSITY', 'HOSPITAL', 'MEDICAL_CENTRE', 'SHOP', 'RESTAURANT', 'CINEMA', 'GYM', 'PARK', 'TRAIL', 'PLAYGROUND', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."BedSizeType" AS ENUM ('SINGLE', 'DOUBLE', 'QUEEN', 'KING', 'SUPER_KING');

-- CreateEnum
CREATE TYPE "public"."EPCRating" AS ENUM ('A', 'B', 'C', 'D', 'E', 'F', 'G', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "public"."HeatingType" AS ENUM ('GAS_CENTRAL', 'ELECTRIC', 'OIL', 'UNDERFLOOR', 'BIOMASS', 'HEAT_PUMP', 'DISTRICT', 'STORAGE_HEATERS', 'LPG', 'PASSIVE', 'SOLAR_THERMAL', 'OTHER', 'NILL');

-- CreateEnum
CREATE TYPE "public"."BoilerType" AS ENUM ('COMBI', 'SYSTEM', 'CONVENTIONAL', 'BACK_BOILER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "public"."HotWaterSource" AS ENUM ('BOILER', 'IMMERSION_HEATER', 'SOLAR_THERMAL', 'HEAT_PUMP', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."RenewableEnergy" AS ENUM ('SOLAR_PV', 'BATTERY_STORAGE', 'SMART_METER', 'EV_CHARGING', 'GREY_WATER');

-- CreateEnum
CREATE TYPE "public"."ConnectedUtilities" AS ENUM ('GAS', 'ELECTRICITY', 'WATER', 'SEWAGE', 'DRAINAGE', 'SEPTIC_TANK', 'CESSPIT', 'RAINWATER_HARVESTING');

-- CreateEnum
CREATE TYPE "public"."BroadbandType" AS ENUM ('ADSL', 'FTTC', 'FTTP', 'CABLE', 'MOBILE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "public"."OtherRoomType" AS ENUM ('OFFICE', 'STUDY', 'LIBRARY', 'GYM', 'WORKSHOP', 'POOL_ROOM', 'WINE_CELLAR', 'SPA', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."GardenFacing" AS ENUM ('NORTH', 'EAST', 'SOUTH', 'WEST');

-- CreateEnum
CREATE TYPE "public"."GardenPosition" AS ENUM ('FRONT', 'REAR', 'SIDE');

-- CreateEnum
CREATE TYPE "public"."ConstructionType" AS ENUM ('STANDARD', 'NON_STANDARD');

-- CreateEnum
CREATE TYPE "public"."FireplaceType" AS ENUM ('LOG_BURNER', 'OPEN_FIRE');

-- CreateEnum
CREATE TYPE "public"."ReceptionType" AS ENUM ('LIVING_ROOM', 'FAMILY_ROOM', 'DINING_ROOM', 'GAMES_ROOM', 'HOME_CINEMA');

-- CreateEnum
CREATE TYPE "public"."Reviewed" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."Address" (
    "id" SERIAL NOT NULL,
    "number" TEXT,
    "flat" TEXT,
    "name" TEXT,
    "street" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "country" TEXT,
    "locality" TEXT,
    "county" TEXT,
    "district" TEXT,
    "fullAddress" TEXT,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "location" geometry,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ListingView" (
    "id" SERIAL NOT NULL,
    "listingId" INTEGER NOT NULL,
    "userId" INTEGER,
    "sessionId" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrackLocation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "TrackLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrackQuery" (
    "id" SERIAL NOT NULL,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "TrackQuery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Conversation" (
    "id" SERIAL NOT NULL,
    "listingId" INTEGER,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Message" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DraftListing" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "moveInDate" TIMESTAMP(3),
    "listingTier" "public"."ListingTier" NOT NULL,
    "listingStartDate" TIMESTAMP(3),
    "listingEndDate" TIMESTAMP(3),
    "viewingOptions" TEXT,
    "verificationLevel" "public"."VerificationLevel",
    "userId" INTEGER NOT NULL,
    "propertyId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DraftListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Agent" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "estateAgentId" INTEGER NOT NULL,
    "role" "public"."AgentRole" NOT NULL DEFAULT 'SENIOR',
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
CREATE TABLE "public"."EstateAgent" (
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
CREATE TABLE "public"."Listing" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "moveInDate" TIMESTAMP(3),
    "listingTier" "public"."ListingTier" NOT NULL,
    "listingStartDate" TIMESTAMP(3),
    "listingEndDate" TIMESTAMP(3),
    "viewingOptions" TEXT,
    "verificationLevel" "public"."VerificationLevel",
    "userId" INTEGER,
    "propertyId" INTEGER NOT NULL,
    "estateAgentId" INTEGER,
    "publishedAt" TIMESTAMP(3),
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RentalListing" (
    "id" SERIAL NOT NULL,
    "listingId" INTEGER,
    "deposit" DOUBLE PRECISION,
    "holdingDeposit" DOUBLE PRECISION,
    "rentFrequency" "public"."RentalPriceType",
    "isBillsIncluded" BOOLEAN NOT NULL,
    "rentalLength" INTEGER,
    "furnishedStatus" "public"."FurnishedStatus",
    "availabilityStatus" "public"."RentalAvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',
    "draftListingId" INTEGER,

    CONSTRAINT "RentalListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SaleListing" (
    "id" SERIAL NOT NULL,
    "listingId" INTEGER,
    "tenureType" "public"."TenureType",
    "chain" BOOLEAN NOT NULL DEFAULT false,
    "sharedOwnership" BOOLEAN NOT NULL DEFAULT false,
    "priceType" "public"."SalePriceType",
    "availabilityStatus" "public"."SaleAvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',
    "draftListingId" INTEGER,

    CONSTRAINT "SaleListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Media" (
    "id" SERIAL NOT NULL,
    "image" TEXT,
    "videoTour" TEXT,
    "floorPlan" TEXT,
    "metadata" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bedroomId" INTEGER,
    "bathroomId" INTEGER,
    "receptionId" INTEGER,
    "otherRoomId" INTEGER,
    "kitchenId" INTEGER,
    "gardenId" INTEGER,
    "outdoorSpaceId" INTEGER,
    "landId" INTEGER,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Membership" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "public"."MembershipType" NOT NULL DEFAULT 'FREE',
    "status" "public"."MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "cancellationDate" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "paymentMethod" TEXT,
    "lastPaymentDate" TIMESTAMP(3),
    "nextBillingDate" TIMESTAMP(3),
    "previousType" "public"."MembershipType",
    "upgradeDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Accessibility" (
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
CREATE TABLE "public"."AdditionalFeatures" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "petFriendly" BOOLEAN NOT NULL DEFAULT true,
    "moveInDate" TIMESTAMP(3) NOT NULL,
    "pool" BOOLEAN NOT NULL DEFAULT false,
    "internet" BOOLEAN NOT NULL DEFAULT false,
    "concierge" BOOLEAN NOT NULL DEFAULT false,
    "shop" BOOLEAN NOT NULL DEFAULT false,
    "gym" BOOLEAN NOT NULL DEFAULT false,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdditionalFeatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Amenities" (
    "id" SERIAL NOT NULL,
    "type" "public"."AmenityType" NOT NULL,
    "subtype" "public"."AmenitySubtype",
    "name" TEXT NOT NULL,
    "distanceM" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "location" JSONB,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bathroom" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "name" TEXT,
    "toilet" BOOLEAN NOT NULL DEFAULT false,
    "enSuite" BOOLEAN NOT NULL DEFAULT false,
    "bathtub" BOOLEAN NOT NULL DEFAULT true,
    "walkInShower" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "size" DOUBLE PRECISION,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bathroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bedroom" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL,
    "name" TEXT,
    "bed" "public"."BedSizeType"[],
    "floor" INTEGER NOT NULL,
    "description" TEXT,
    "enSuite" BOOLEAN NOT NULL DEFAULT false,
    "builtInStorage" BOOLEAN NOT NULL DEFAULT false,
    "walkInWardrobe" BOOLEAN NOT NULL DEFAULT false,
    "bayWindow" BOOLEAN NOT NULL DEFAULT false,
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "hasView" BOOLEAN NOT NULL DEFAULT false,
    "patioDoors" BOOLEAN NOT NULL DEFAULT false,
    "builtInDesk" BOOLEAN NOT NULL DEFAULT false,
    "size" DOUBLE PRECISION,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bedroom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EnergyAndUtilities" (
    "id" SERIAL NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "description" TEXT,
    "epcRating" "public"."EPCRating" NOT NULL,
    "epcCertificateUrl" TEXT,
    "primaryHeatingType" "public"."HeatingType"[] DEFAULT ARRAY['NILL']::"public"."HeatingType"[],
    "secondaryHeatingType" "public"."HeatingType"[],
    "boilerType" "public"."BoilerType",
    "hotWaterSource" "public"."HotWaterSource",
    "renewables" "public"."RenewableEnergy"[],
    "connectedUtilities" "public"."ConnectedUtilities"[],
    "broadbandType" "public"."BroadbandType",
    "fullFibreAvailable" BOOLEAN NOT NULL DEFAULT false,
    "maxDownloadSpeedMbps" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnergyAndUtilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Kitchen" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER,
    "floor" INTEGER,
    "name" TEXT,
    "modern" BOOLEAN NOT NULL DEFAULT false,
    "openPlan" BOOLEAN NOT NULL DEFAULT false,
    "whiteGoods" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "size" DOUBLE PRECISION,
    "breakfastBar" BOOLEAN NOT NULL DEFAULT false,
    "island" BOOLEAN NOT NULL DEFAULT false,
    "utilityAccess" BOOLEAN NOT NULL DEFAULT false,
    "pantry" BOOLEAN NOT NULL DEFAULT false,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Kitchen_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OtherRoom" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."OtherRoomType" NOT NULL,
    "description" TEXT,
    "size" DOUBLE PRECISION,
    "openPlan" BOOLEAN NOT NULL DEFAULT false,
    "openConcept" BOOLEAN NOT NULL DEFAULT false,
    "fireplace" "public"."FireplaceType",
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "bayWindow" BOOLEAN NOT NULL DEFAULT false,
    "builtInShelving" BOOLEAN NOT NULL DEFAULT false,
    "hasView" BOOLEAN NOT NULL DEFAULT false,
    "patioDoors" BOOLEAN NOT NULL DEFAULT false,
    "builtInStorage" BOOLEAN NOT NULL DEFAULT false,
    "servingHatch" BOOLEAN NOT NULL DEFAULT false,
    "barArea" BOOLEAN NOT NULL DEFAULT false,
    "soundProofing" BOOLEAN NOT NULL DEFAULT false,
    "accousticPanels" BOOLEAN NOT NULL DEFAULT false,
    "stoneFlooring" BOOLEAN NOT NULL DEFAULT false,
    "hardwoodFlooring" BOOLEAN NOT NULL DEFAULT false,
    "builtInDesk" BOOLEAN NOT NULL DEFAULT false,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OtherRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Garden" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "name" TEXT,
    "facing" "public"."GardenFacing",
    "position" "public"."GardenPosition",
    "sunTerrace" BOOLEAN NOT NULL DEFAULT false,
    "terrace" BOOLEAN NOT NULL DEFAULT false,
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "patio" BOOLEAN NOT NULL DEFAULT false,
    "separateParcel" BOOLEAN NOT NULL DEFAULT false,
    "shed" BOOLEAN NOT NULL DEFAULT false,
    "summerHouse" BOOLEAN NOT NULL DEFAULT false,
    "gardenOffice" BOOLEAN NOT NULL DEFAULT false,
    "pool" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "outdoorSpaceId" INTEGER,

    CONSTRAINT "Garden_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Land" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "name" TEXT,
    "separateParcel" BOOLEAN NOT NULL DEFAULT false,
    "woodland" BOOLEAN NOT NULL DEFAULT false,
    "paddock" BOOLEAN NOT NULL DEFAULT false,
    "stables" BOOLEAN NOT NULL DEFAULT false,
    "tennisCourt" BOOLEAN NOT NULL DEFAULT false,
    "orchard" BOOLEAN NOT NULL DEFAULT false,
    "pond" BOOLEAN NOT NULL DEFAULT false,
    "driveway" BOOLEAN NOT NULL DEFAULT false,
    "outbuilding" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "outdoorSpaceId" INTEGER,

    CONSTRAINT "Land_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OutdoorSpace" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "totalGardenSize" DOUBLE PRECISION,
    "totalLandSize" DOUBLE PRECISION,
    "separateParcel" BOOLEAN NOT NULL DEFAULT false,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutdoorSpace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Parking" (
    "id" SERIAL NOT NULL,
    "garage" BOOLEAN NOT NULL DEFAULT false,
    "driveway" BOOLEAN NOT NULL DEFAULT false,
    "permitParking" BOOLEAN NOT NULL DEFAULT false,
    "onStreet" BOOLEAN NOT NULL DEFAULT false,
    "noParking" BOOLEAN NOT NULL DEFAULT false,
    "carport" BOOLEAN NOT NULL DEFAULT false,
    "allocatedParking" BOOLEAN NOT NULL DEFAULT false,
    "evCharging" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Parking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Property" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "value" DOUBLE PRECISION,
    "size" DOUBLE PRECISION,
    "yearBuilt" TEXT,
    "chainFree" BOOLEAN NOT NULL DEFAULT false,
    "vacant" BOOLEAN NOT NULL DEFAULT false,
    "constructionType" "public"."ConstructionType",
    "floorLevel" INTEGER,
    "totalFloors" INTEGER NOT NULL,
    "numberBedrooms" INTEGER DEFAULT 0,
    "numberBathrooms" INTEGER DEFAULT 0,
    "numberReceptions" INTEGER DEFAULT 0,
    "numberOtherRooms" INTEGER DEFAULT 0,
    "numberKitchens" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "addressId" INTEGER,
    "userId" INTEGER,
    "estateAgentId" INTEGER,
    "propertyTypeId" INTEGER NOT NULL,
    "propertyClassificationId" INTEGER NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PropertyClassification" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "PropertyClassification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PropertyType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "defaultSelected" BOOLEAN NOT NULL,

    CONSTRAINT "PropertyType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Reception" (
    "id" SERIAL NOT NULL,
    "roomNumber" INTEGER NOT NULL,
    "floor" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."ReceptionType" NOT NULL,
    "description" TEXT,
    "size" DOUBLE PRECISION,
    "conservatory" BOOLEAN NOT NULL DEFAULT false,
    "openPlan" BOOLEAN NOT NULL DEFAULT false,
    "openConcept" BOOLEAN NOT NULL DEFAULT false,
    "fireplace" "public"."FireplaceType",
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "bayWindow" BOOLEAN NOT NULL DEFAULT false,
    "builtInShelving" BOOLEAN NOT NULL DEFAULT false,
    "hasView" BOOLEAN NOT NULL DEFAULT false,
    "patioDoors" BOOLEAN NOT NULL DEFAULT false,
    "builtInStorage" BOOLEAN NOT NULL DEFAULT false,
    "servingHatch" BOOLEAN NOT NULL DEFAULT false,
    "barArea" BOOLEAN NOT NULL DEFAULT false,
    "soundProofing" BOOLEAN NOT NULL DEFAULT false,
    "accousticPanels" BOOLEAN NOT NULL DEFAULT false,
    "stoneFlooring" BOOLEAN NOT NULL DEFAULT false,
    "hardwoodFlooring" BOOLEAN NOT NULL DEFAULT false,
    "builtInDesk" BOOLEAN NOT NULL DEFAULT false,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reception_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RunningCosts" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "councilTaxBand" TEXT NOT NULL,
    "serviceCharges" DOUBLE PRECISION,
    "groundRent" DOUBLE PRECISION,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RunningCosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Security" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "gatedCommunity" BOOLEAN NOT NULL DEFAULT false,
    "cctv" BOOLEAN NOT NULL DEFAULT false,
    "alarmSystem" BOOLEAN NOT NULL DEFAULT false,
    "neighborhoodWatch" BOOLEAN NOT NULL DEFAULT false,
    "intercomSystem" BOOLEAN NOT NULL DEFAULT false,
    "security" BOOLEAN NOT NULL DEFAULT false,
    "reception" BOOLEAN NOT NULL DEFAULT false,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Security_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Storage" (
    "id" SERIAL NOT NULL,
    "attic" BOOLEAN NOT NULL DEFAULT false,
    "basement" BOOLEAN NOT NULL DEFAULT false,
    "separateDressing" BOOLEAN NOT NULL DEFAULT false,
    "underStairsStorage" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "propertyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Storage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Utility" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
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
CREATE TABLE "public"."HiddenListing" (
    "id" SERIAL NOT NULL,
    "userPreferencesId" INTEGER NOT NULL,
    "listingId" INTEGER NOT NULL,
    "reason" TEXT,
    "hiddenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HiddenListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SavedSearch" (
    "id" SERIAL NOT NULL,
    "userPreferencesId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
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
CREATE TABLE "public"."UserFavouriteListing" (
    "id" SERIAL NOT NULL,
    "userPreferencesId" INTEGER NOT NULL,
    "listingId" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFavouriteListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserLocation" (
    "id" SERIAL NOT NULL,
    "userPreferencesId" INTEGER NOT NULL,
    "geocodingFeature" JSONB NOT NULL,
    "location" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lon" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserNote" (
    "id" SERIAL NOT NULL,
    "userPreferencesId" INTEGER NOT NULL,
    "listingId" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserPreferences" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Verification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "estateAgentId" INTEGER,
    "identity" BOOLEAN,
    "address" BOOLEAN,
    "bank" BOOLEAN,
    "payslip" BOOLEAN,
    "business" BOOLEAN,
    "reviewed" "public"."Reviewed" NOT NULL DEFAULT 'PENDING',
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
CREATE TABLE "public"."_AgentToListing" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AgentToListing_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_AgentToProperty" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AgentToProperty_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "address_location_idx" ON "public"."Address" USING GIST ("location");

-- CreateIndex
CREATE INDEX "address_postcode_idx" ON "public"."Address"("postcode");

-- CreateIndex
CREATE INDEX "address_city_idx" ON "public"."Address"("city");

-- CreateIndex
CREATE INDEX "address_street_idx" ON "public"."Address"("street");

-- CreateIndex
CREATE INDEX "address_autocomplete_idx" ON "public"."Address"("street", "city", "postcode", "country");

-- CreateIndex
CREATE UNIQUE INDEX "Address_number_street_city_postcode_country_key" ON "public"."Address"("number", "street", "city", "postcode", "country");

-- CreateIndex
CREATE INDEX "ListingView_listingId_idx" ON "public"."ListingView"("listingId");

-- CreateIndex
CREATE INDEX "ListingView_userId_idx" ON "public"."ListingView"("userId");

-- CreateIndex
CREATE INDEX "ListingView_sessionId_idx" ON "public"."ListingView"("sessionId");

-- CreateIndex
CREATE INDEX "ListingView_createdAt_idx" ON "public"."ListingView"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "TrackLocation_location_key" ON "public"."TrackLocation"("location");

-- CreateIndex
CREATE UNIQUE INDEX "TrackQuery_query_key" ON "public"."TrackQuery"("query");

-- CreateIndex
CREATE INDEX "Conversation_senderId_idx" ON "public"."Conversation"("senderId");

-- CreateIndex
CREATE INDEX "Conversation_receiverId_idx" ON "public"."Conversation"("receiverId");

-- CreateIndex
CREATE INDEX "Conversation_listingId_idx" ON "public"."Conversation"("listingId");

-- CreateIndex
CREATE INDEX "Conversation_createdAt_idx" ON "public"."Conversation"("createdAt");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "public"."Message"("conversationId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "public"."Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_receiverId_idx" ON "public"."Message"("receiverId");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "public"."Message"("createdAt");

-- CreateIndex
CREATE INDEX "DraftListing_userId_idx" ON "public"."DraftListing"("userId");

-- CreateIndex
CREATE INDEX "DraftListing_propertyId_idx" ON "public"."DraftListing"("propertyId");

-- CreateIndex
CREATE INDEX "DraftListing_price_idx" ON "public"."DraftListing"("price");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "public"."Agent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_activationToken_key" ON "public"."Agent"("activationToken");

-- CreateIndex
CREATE INDEX "Agent_estateAgentId_idx" ON "public"."Agent"("estateAgentId");

-- CreateIndex
CREATE UNIQUE INDEX "EstateAgent_email_key" ON "public"."EstateAgent"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EstateAgent_passwordResetToken_key" ON "public"."EstateAgent"("passwordResetToken");

-- CreateIndex
CREATE INDEX "Listing_userId_idx" ON "public"."Listing"("userId");

-- CreateIndex
CREATE INDEX "Listing_propertyId_idx" ON "public"."Listing"("propertyId");

-- CreateIndex
CREATE INDEX "Listing_price_idx" ON "public"."Listing"("price");

-- CreateIndex
CREATE INDEX "Listing_publishedAt_idx" ON "public"."Listing"("publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RentalListing_listingId_key" ON "public"."RentalListing"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "RentalListing_draftListingId_key" ON "public"."RentalListing"("draftListingId");

-- CreateIndex
CREATE INDEX "RentalListing_listingId_idx" ON "public"."RentalListing"("listingId");

-- CreateIndex
CREATE INDEX "RentalListing_draftListingId_idx" ON "public"."RentalListing"("draftListingId");

-- CreateIndex
CREATE UNIQUE INDEX "SaleListing_listingId_key" ON "public"."SaleListing"("listingId");

-- CreateIndex
CREATE UNIQUE INDEX "SaleListing_draftListingId_key" ON "public"."SaleListing"("draftListingId");

-- CreateIndex
CREATE INDEX "SaleListing_listingId_idx" ON "public"."SaleListing"("listingId");

-- CreateIndex
CREATE INDEX "SaleListing_draftListingId_idx" ON "public"."SaleListing"("draftListingId");

-- CreateIndex
CREATE INDEX "Media_propertyId_idx" ON "public"."Media"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_key" ON "public"."Membership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Accessibility_propertyId_key" ON "public"."Accessibility"("propertyId");

-- CreateIndex
CREATE INDEX "Accessibility_propertyId_idx" ON "public"."Accessibility"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "AdditionalFeatures_propertyId_key" ON "public"."AdditionalFeatures"("propertyId");

-- CreateIndex
CREATE INDEX "AdditionalFeatures_propertyId_idx" ON "public"."AdditionalFeatures"("propertyId");

-- CreateIndex
CREATE INDEX "Amenities_propertyId_idx" ON "public"."Amenities"("propertyId");

-- CreateIndex
CREATE INDEX "Bathroom_propertyId_idx" ON "public"."Bathroom"("propertyId");

-- CreateIndex
CREATE INDEX "Bedroom_propertyId_idx" ON "public"."Bedroom"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "EnergyAndUtilities_propertyId_key" ON "public"."EnergyAndUtilities"("propertyId");

-- CreateIndex
CREATE INDEX "EnergyAndUtilities_propertyId_idx" ON "public"."EnergyAndUtilities"("propertyId");

-- CreateIndex
CREATE INDEX "Kitchen_propertyId_idx" ON "public"."Kitchen"("propertyId");

-- CreateIndex
CREATE INDEX "OtherRoom_propertyId_idx" ON "public"."OtherRoom"("propertyId");

-- CreateIndex
CREATE INDEX "Garden_outdoorSpaceId_idx" ON "public"."Garden"("outdoorSpaceId");

-- CreateIndex
CREATE INDEX "Land_outdoorSpaceId_idx" ON "public"."Land"("outdoorSpaceId");

-- CreateIndex
CREATE UNIQUE INDEX "OutdoorSpace_propertyId_key" ON "public"."OutdoorSpace"("propertyId");

-- CreateIndex
CREATE INDEX "OutdoorSpace_propertyId_idx" ON "public"."OutdoorSpace"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Parking_propertyId_key" ON "public"."Parking"("propertyId");

-- CreateIndex
CREATE INDEX "Parking_propertyId_idx" ON "public"."Parking"("propertyId");

-- CreateIndex
CREATE INDEX "Property_addressId_idx" ON "public"."Property"("addressId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyType_name_key" ON "public"."PropertyType"("name");

-- CreateIndex
CREATE INDEX "Reception_propertyId_idx" ON "public"."Reception"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "RunningCosts_propertyId_key" ON "public"."RunningCosts"("propertyId");

-- CreateIndex
CREATE INDEX "RunningCosts_propertyId_idx" ON "public"."RunningCosts"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Security_propertyId_key" ON "public"."Security"("propertyId");

-- CreateIndex
CREATE INDEX "Security_propertyId_idx" ON "public"."Security"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Storage_propertyId_key" ON "public"."Storage"("propertyId");

-- CreateIndex
CREATE INDEX "Storage_propertyId_idx" ON "public"."Storage"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Utility_propertyId_key" ON "public"."Utility"("propertyId");

-- CreateIndex
CREATE INDEX "Utility_propertyId_idx" ON "public"."Utility"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "HiddenListing_userPreferencesId_listingId_key" ON "public"."HiddenListing"("userPreferencesId", "listingId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_passwordResetToken_key" ON "public"."User"("passwordResetToken");

-- CreateIndex
CREATE INDEX "User_addressId_idx" ON "public"."User"("addressId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavouriteListing_userPreferencesId_listingId_key" ON "public"."UserFavouriteListing"("userPreferencesId", "listingId");

-- CreateIndex
CREATE UNIQUE INDEX "UserNote_userPreferencesId_listingId_key" ON "public"."UserNote"("userPreferencesId", "listingId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "public"."UserPreferences"("userId");

-- CreateIndex
CREATE INDEX "UserPreferences_userId_idx" ON "public"."UserPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_userId_key" ON "public"."Verification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_estateAgentId_key" ON "public"."Verification"("estateAgentId");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_reviewToken_key" ON "public"."Verification"("reviewToken");

-- CreateIndex
CREATE UNIQUE INDEX "Verification_activationToken_key" ON "public"."Verification"("activationToken");

-- CreateIndex
CREATE INDEX "_AgentToListing_B_index" ON "public"."_AgentToListing"("B");

-- CreateIndex
CREATE INDEX "_AgentToProperty_B_index" ON "public"."_AgentToProperty"("B");

-- AddForeignKey
ALTER TABLE "public"."ListingView" ADD CONSTRAINT "ListingView_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ListingView" ADD CONSTRAINT "ListingView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Conversation" ADD CONSTRAINT "Conversation_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DraftListing" ADD CONSTRAINT "DraftListing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DraftListing" ADD CONSTRAINT "DraftListing_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Agent" ADD CONSTRAINT "Agent_estateAgentId_fkey" FOREIGN KEY ("estateAgentId") REFERENCES "public"."EstateAgent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EstateAgent" ADD CONSTRAINT "EstateAgent_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Listing" ADD CONSTRAINT "Listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Listing" ADD CONSTRAINT "Listing_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Listing" ADD CONSTRAINT "Listing_estateAgentId_fkey" FOREIGN KEY ("estateAgentId") REFERENCES "public"."EstateAgent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RentalListing" ADD CONSTRAINT "RentalListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RentalListing" ADD CONSTRAINT "RentalListing_draftListingId_fkey" FOREIGN KEY ("draftListingId") REFERENCES "public"."DraftListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SaleListing" ADD CONSTRAINT "SaleListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SaleListing" ADD CONSTRAINT "SaleListing_draftListingId_fkey" FOREIGN KEY ("draftListingId") REFERENCES "public"."DraftListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_bedroomId_fkey" FOREIGN KEY ("bedroomId") REFERENCES "public"."Bedroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_bathroomId_fkey" FOREIGN KEY ("bathroomId") REFERENCES "public"."Bathroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_receptionId_fkey" FOREIGN KEY ("receptionId") REFERENCES "public"."Reception"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_otherRoomId_fkey" FOREIGN KEY ("otherRoomId") REFERENCES "public"."OtherRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_kitchenId_fkey" FOREIGN KEY ("kitchenId") REFERENCES "public"."Kitchen"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_gardenId_fkey" FOREIGN KEY ("gardenId") REFERENCES "public"."Garden"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_outdoorSpaceId_fkey" FOREIGN KEY ("outdoorSpaceId") REFERENCES "public"."OutdoorSpace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_landId_fkey" FOREIGN KEY ("landId") REFERENCES "public"."Land"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Accessibility" ADD CONSTRAINT "Accessibility_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdditionalFeatures" ADD CONSTRAINT "AdditionalFeatures_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Amenities" ADD CONSTRAINT "Amenities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bathroom" ADD CONSTRAINT "Bathroom_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bedroom" ADD CONSTRAINT "Bedroom_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EnergyAndUtilities" ADD CONSTRAINT "EnergyAndUtilities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Kitchen" ADD CONSTRAINT "Kitchen_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OtherRoom" ADD CONSTRAINT "OtherRoom_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Garden" ADD CONSTRAINT "Garden_outdoorSpaceId_fkey" FOREIGN KEY ("outdoorSpaceId") REFERENCES "public"."OutdoorSpace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Land" ADD CONSTRAINT "Land_outdoorSpaceId_fkey" FOREIGN KEY ("outdoorSpaceId") REFERENCES "public"."OutdoorSpace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OutdoorSpace" ADD CONSTRAINT "OutdoorSpace_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Parking" ADD CONSTRAINT "Parking_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."Address"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_estateAgentId_fkey" FOREIGN KEY ("estateAgentId") REFERENCES "public"."EstateAgent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_propertyTypeId_fkey" FOREIGN KEY ("propertyTypeId") REFERENCES "public"."PropertyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Property" ADD CONSTRAINT "Property_propertyClassificationId_fkey" FOREIGN KEY ("propertyClassificationId") REFERENCES "public"."PropertyClassification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PropertyClassification" ADD CONSTRAINT "PropertyClassification_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."PropertyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Reception" ADD CONSTRAINT "Reception_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RunningCosts" ADD CONSTRAINT "RunningCosts_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Security" ADD CONSTRAINT "Security_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Storage" ADD CONSTRAINT "Storage_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Utility" ADD CONSTRAINT "Utility_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HiddenListing" ADD CONSTRAINT "HiddenListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HiddenListing" ADD CONSTRAINT "HiddenListing_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "public"."UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SavedSearch" ADD CONSTRAINT "SavedSearch_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "public"."UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFavouriteListing" ADD CONSTRAINT "UserFavouriteListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserFavouriteListing" ADD CONSTRAINT "UserFavouriteListing_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "public"."UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserLocation" ADD CONSTRAINT "UserLocation_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "public"."UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserNote" ADD CONSTRAINT "UserNote_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserNote" ADD CONSTRAINT "UserNote_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "public"."UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Verification" ADD CONSTRAINT "Verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Verification" ADD CONSTRAINT "Verification_estateAgentId_fkey" FOREIGN KEY ("estateAgentId") REFERENCES "public"."EstateAgent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AgentToListing" ADD CONSTRAINT "_AgentToListing_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AgentToListing" ADD CONSTRAINT "_AgentToListing_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AgentToProperty" ADD CONSTRAINT "_AgentToProperty_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_AgentToProperty" ADD CONSTRAINT "_AgentToProperty_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;
