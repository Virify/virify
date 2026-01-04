/*
  Warnings:

  - You are about to drop the column `accessibleParking` on the `Accessibility` table. All the data in the column will be lost.
  - You are about to drop the column `elevator` on the `Accessibility` table. All the data in the column will be lost.
  - You are about to drop the column `handrails` on the `Accessibility` table. All the data in the column will be lost.
  - You are about to drop the column `stairs` on the `Accessibility` table. All the data in the column will be lost.
  - You are about to drop the column `stepFreeAccess` on the `Accessibility` table. All the data in the column will be lost.
  - You are about to drop the column `wetRoom` on the `Accessibility` table. All the data in the column will be lost.
  - You are about to drop the column `wheelchairFriendly` on the `Accessibility` table. All the data in the column will be lost.
  - You are about to drop the column `wideDoorways` on the `Accessibility` table. All the data in the column will be lost.
  - You are about to drop the column `concierge` on the `AdditionalFeatures` table. All the data in the column will be lost.
  - You are about to drop the column `gym` on the `AdditionalFeatures` table. All the data in the column will be lost.
  - You are about to drop the column `internet` on the `AdditionalFeatures` table. All the data in the column will be lost.
  - You are about to drop the column `pool` on the `AdditionalFeatures` table. All the data in the column will be lost.
  - You are about to drop the column `shop` on the `AdditionalFeatures` table. All the data in the column will be lost.
  - You are about to drop the column `bathtub` on the `Bathroom` table. All the data in the column will be lost.
  - You are about to drop the column `enSuite` on the `Bathroom` table. All the data in the column will be lost.
  - You are about to drop the column `toilet` on the `Bathroom` table. All the data in the column will be lost.
  - You are about to drop the column `walkInShower` on the `Bathroom` table. All the data in the column will be lost.
  - You are about to drop the column `balcony` on the `Bedroom` table. All the data in the column will be lost.
  - You are about to drop the column `bayWindow` on the `Bedroom` table. All the data in the column will be lost.
  - You are about to drop the column `builtInDesk` on the `Bedroom` table. All the data in the column will be lost.
  - You are about to drop the column `builtInStorage` on the `Bedroom` table. All the data in the column will be lost.
  - You are about to drop the column `enSuite` on the `Bedroom` table. All the data in the column will be lost.
  - You are about to drop the column `hasView` on the `Bedroom` table. All the data in the column will be lost.
  - You are about to drop the column `patioDoors` on the `Bedroom` table. All the data in the column will be lost.
  - You are about to drop the column `walkInWardrobe` on the `Bedroom` table. All the data in the column will be lost.
  - You are about to drop the column `balcony` on the `Garden` table. All the data in the column will be lost.
  - You are about to drop the column `gardenOffice` on the `Garden` table. All the data in the column will be lost.
  - You are about to drop the column `patio` on the `Garden` table. All the data in the column will be lost.
  - You are about to drop the column `pool` on the `Garden` table. All the data in the column will be lost.
  - You are about to drop the column `separateParcel` on the `Garden` table. All the data in the column will be lost.
  - You are about to drop the column `shed` on the `Garden` table. All the data in the column will be lost.
  - You are about to drop the column `summerHouse` on the `Garden` table. All the data in the column will be lost.
  - You are about to drop the column `sunTerrace` on the `Garden` table. All the data in the column will be lost.
  - You are about to drop the column `terrace` on the `Garden` table. All the data in the column will be lost.
  - You are about to drop the column `breakfastBar` on the `Kitchen` table. All the data in the column will be lost.
  - You are about to drop the column `island` on the `Kitchen` table. All the data in the column will be lost.
  - You are about to drop the column `modern` on the `Kitchen` table. All the data in the column will be lost.
  - You are about to drop the column `openPlan` on the `Kitchen` table. All the data in the column will be lost.
  - You are about to drop the column `pantry` on the `Kitchen` table. All the data in the column will be lost.
  - You are about to drop the column `utilityAccess` on the `Kitchen` table. All the data in the column will be lost.
  - You are about to drop the column `whiteGoods` on the `Kitchen` table. All the data in the column will be lost.
  - You are about to drop the column `orchard` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `outbuilding` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `paddock` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `pond` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `stables` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `tennisCourt` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `woodland` on the `Land` table. All the data in the column will be lost.
  - You are about to drop the column `accousticPanels` on the `OtherRoom` table. All the data in the column will be lost.
  - You are about to drop the column `balcony` on the `OtherRoom` table. All the data in the column will be lost.
  - You are about to drop the column `barArea` on the `OtherRoom` table. All the data in the column will be lost.
  - You are about to drop the column `bayWindow` on the `OtherRoom` table. All the data in the column will be lost.
  - You are about to drop the column `builtInDesk` on the `OtherRoom` table. All the data in the column will be lost.
  - You are about to drop the column `builtInShelving` on the `OtherRoom` table. All the data in the column will be lost.
  - You are about to drop the column `builtInStorage` on the `OtherRoom` table. All the data in the column will be lost.
  - You are about to drop the column `fireplace` on the `OtherRoom` table. All the data in the column will be lost.
  - You are about to drop the column `hardwoodFlooring` on the `OtherRoom` table. All the data in the column will be lost.
  - You are about to drop the column `hasView` on the `OtherRoom` table. All the data in the column will be lost.
  - You are about to drop the column `openConcept` on the `OtherRoom` table. All the data in the column will be lost.
  - You are about to drop the column `openPlan` on the `OtherRoom` table. All the data in the column will be lost.
  - You are about to drop the column `patioDoors` on the `OtherRoom` table. All the data in the column will be lost.
  - You are about to drop the column `servingHatch` on the `OtherRoom` table. All the data in the column will be lost.
  - You are about to drop the column `soundProofing` on the `OtherRoom` table. All the data in the column will be lost.
  - You are about to drop the column `stoneFlooring` on the `OtherRoom` table. All the data in the column will be lost.
  - You are about to drop the column `balcony` on the `OutdoorSpace` table. All the data in the column will be lost.
  - You are about to drop the column `gardenOffice` on the `OutdoorSpace` table. All the data in the column will be lost.
  - You are about to drop the column `patio` on the `OutdoorSpace` table. All the data in the column will be lost.
  - You are about to drop the column `pool` on the `OutdoorSpace` table. All the data in the column will be lost.
  - You are about to drop the column `separateParcel` on the `OutdoorSpace` table. All the data in the column will be lost.
  - You are about to drop the column `shed` on the `OutdoorSpace` table. All the data in the column will be lost.
  - You are about to drop the column `summerHouse` on the `OutdoorSpace` table. All the data in the column will be lost.
  - You are about to drop the column `sunTerrace` on the `OutdoorSpace` table. All the data in the column will be lost.
  - You are about to drop the column `terrace` on the `OutdoorSpace` table. All the data in the column will be lost.
  - You are about to drop the column `allocatedParking` on the `Parking` table. All the data in the column will be lost.
  - You are about to drop the column `carport` on the `Parking` table. All the data in the column will be lost.
  - You are about to drop the column `driveway` on the `Parking` table. All the data in the column will be lost.
  - You are about to drop the column `evCharging` on the `Parking` table. All the data in the column will be lost.
  - You are about to drop the column `garage` on the `Parking` table. All the data in the column will be lost.
  - You are about to drop the column `noParking` on the `Parking` table. All the data in the column will be lost.
  - You are about to drop the column `onStreet` on the `Parking` table. All the data in the column will be lost.
  - You are about to drop the column `permitParking` on the `Parking` table. All the data in the column will be lost.
  - You are about to drop the column `accousticPanels` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `balcony` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `barArea` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `bayWindow` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `builtInDesk` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `builtInShelving` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `builtInStorage` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `conservatory` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `fireplace` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `hardwoodFlooring` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `hasView` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `openConcept` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `openPlan` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `patioDoors` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `servingHatch` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `soundProofing` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `stoneFlooring` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `alarmSystem` on the `Security` table. All the data in the column will be lost.
  - You are about to drop the column `cctv` on the `Security` table. All the data in the column will be lost.
  - You are about to drop the column `gatedCommunity` on the `Security` table. All the data in the column will be lost.
  - You are about to drop the column `intercomSystem` on the `Security` table. All the data in the column will be lost.
  - You are about to drop the column `neighborhoodWatch` on the `Security` table. All the data in the column will be lost.
  - You are about to drop the column `reception` on the `Security` table. All the data in the column will be lost.
  - You are about to drop the column `security` on the `Security` table. All the data in the column will be lost.
  - You are about to drop the column `attic` on the `Storage` table. All the data in the column will be lost.
  - You are about to drop the column `basement` on the `Storage` table. All the data in the column will be lost.
  - You are about to drop the column `separateDressing` on the `Storage` table. All the data in the column will be lost.
  - You are about to drop the column `underStairsStorage` on the `Storage` table. All the data in the column will be lost.
  - You are about to drop the column `plumbing` on the `Utility` table. All the data in the column will be lost.
  - You are about to drop the column `sink` on the `Utility` table. All the data in the column will be lost.
  - You are about to drop the column `storage` on the `Utility` table. All the data in the column will be lost.
  - You are about to drop the column `balcony` on the `Yard` table. All the data in the column will be lost.
  - You are about to drop the column `gardenOffice` on the `Yard` table. All the data in the column will be lost.
  - You are about to drop the column `patio` on the `Yard` table. All the data in the column will be lost.
  - You are about to drop the column `pool` on the `Yard` table. All the data in the column will be lost.
  - You are about to drop the column `separateParcel` on the `Yard` table. All the data in the column will be lost.
  - You are about to drop the column `shed` on the `Yard` table. All the data in the column will be lost.
  - You are about to drop the column `summerHouse` on the `Yard` table. All the data in the column will be lost.
  - You are about to drop the column `sunTerrace` on the `Yard` table. All the data in the column will be lost.
  - You are about to drop the column `terrace` on the `Yard` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."AccessibilityFeature" AS ENUM ('WHEELCHAIR_FRIENDLY', 'STEP_FREE_ACCESS', 'WIDE_DOORWAYS', 'WET_ROOM', 'HANDRAILS', 'ELEVATOR', 'STAIRS', 'ACCESSIBLE_PARKING');

-- CreateEnum
CREATE TYPE "public"."BuildingFeature" AS ENUM ('POOL', 'INTERNET', 'CONCIERGE', 'SHOP', 'GYM');

-- CreateEnum
CREATE TYPE "public"."BathroomFeature" AS ENUM ('TOILET', 'EN_SUITE', 'BATHTUB', 'WALK_IN_SHOWER');

-- CreateEnum
CREATE TYPE "public"."BedroomFeature" AS ENUM ('EN_SUITE', 'BUILT_IN_STORAGE', 'WALK_IN_WARDROBE', 'BAY_WINDOW', 'BALCONY', 'HAS_VIEW', 'PATIO_DOORS', 'BUILT_IN_DESK');

-- CreateEnum
CREATE TYPE "public"."KitchenFeature" AS ENUM ('MODERN', 'OPEN_PLAN', 'WHITE_GOODS', 'BREAKFAST_BAR', 'ISLAND', 'UTILITY_ACCESS', 'PANTRY');

-- CreateEnum
CREATE TYPE "public"."LandFeature" AS ENUM ('WOODLAND', 'PADDOCK', 'STABLES', 'TENNIS_COURT', 'ORCHARD', 'POND', 'OUTBUILDING');

-- CreateEnum
CREATE TYPE "public"."OutdoorSpaceFeature" AS ENUM ('SUN_TERRACE', 'TERRACE', 'BALCONY', 'PATIO', 'SEPARATE_PARCEL', 'SHED', 'SUMMER_HOUSE', 'GARDEN_OFFICE', 'POOL');

-- CreateEnum
CREATE TYPE "public"."ParkingFeature" AS ENUM ('GARAGE', 'DRIVEWAY', 'PERMIT_PARKING', 'ON_STREET', 'NO_PARKING', 'CARPORT', 'ALLOCATED_PARKING', 'EV_CHARGING');

-- CreateEnum
CREATE TYPE "public"."RoomFeature" AS ENUM ('OPEN_PLAN', 'OPEN_CONCEPT', 'FIREPLACE', 'BALCONY', 'BAY_WINDOW', 'BUILT_IN_SHELVING', 'HAS_VIEW', 'PATIO_DOORS', 'BUILT_IN_STORAGE', 'SERVING_HATCH', 'BAR_AREA', 'SOUND_PROOFING', 'ACCOUSTIC_PANELS', 'STONE_FLOORING', 'HARDWOOD_FLOORING', 'BUILT_IN_DESK', 'CONSERVATORY');

-- CreateEnum
CREATE TYPE "public"."SecurityFeature" AS ENUM ('GATED_COMMUNITY', 'CCTV', 'ALARM_SYSTEM', 'NEIGHBORHOOD_WATCH', 'INTERCOM_SYSTEM', 'SECURITY', 'RECEPTION');

-- CreateEnum
CREATE TYPE "public"."StorageFeature" AS ENUM ('ATTIC', 'BASEMENT', 'SEPARATE_DRESSING', 'UNDER_STAIRS_STORAGE');

-- CreateEnum
CREATE TYPE "public"."UtilityFeature" AS ENUM ('STORAGE', 'SINK', 'PLUMBING');

-- AlterTable
ALTER TABLE "public"."Accessibility" DROP COLUMN "accessibleParking",
DROP COLUMN "elevator",
DROP COLUMN "handrails",
DROP COLUMN "stairs",
DROP COLUMN "stepFreeAccess",
DROP COLUMN "wetRoom",
DROP COLUMN "wheelchairFriendly",
DROP COLUMN "wideDoorways",
ADD COLUMN     "features" "public"."AccessibilityFeature"[];

-- AlterTable
ALTER TABLE "public"."AdditionalFeatures" DROP COLUMN "concierge",
DROP COLUMN "gym",
DROP COLUMN "internet",
DROP COLUMN "pool",
DROP COLUMN "shop",
ADD COLUMN     "features" "public"."BuildingFeature"[];

-- AlterTable
ALTER TABLE "public"."Bathroom" DROP COLUMN "bathtub",
DROP COLUMN "enSuite",
DROP COLUMN "toilet",
DROP COLUMN "walkInShower",
ADD COLUMN     "features" "public"."BathroomFeature"[];

-- AlterTable
ALTER TABLE "public"."Bedroom" DROP COLUMN "balcony",
DROP COLUMN "bayWindow",
DROP COLUMN "builtInDesk",
DROP COLUMN "builtInStorage",
DROP COLUMN "enSuite",
DROP COLUMN "hasView",
DROP COLUMN "patioDoors",
DROP COLUMN "walkInWardrobe",
ADD COLUMN     "features" "public"."BedroomFeature"[];

-- AlterTable
ALTER TABLE "public"."Garden" DROP COLUMN "balcony",
DROP COLUMN "gardenOffice",
DROP COLUMN "patio",
DROP COLUMN "pool",
DROP COLUMN "separateParcel",
DROP COLUMN "shed",
DROP COLUMN "summerHouse",
DROP COLUMN "sunTerrace",
DROP COLUMN "terrace",
ADD COLUMN     "features" "public"."OutdoorSpaceFeature"[];

-- AlterTable
ALTER TABLE "public"."Kitchen" DROP COLUMN "breakfastBar",
DROP COLUMN "island",
DROP COLUMN "modern",
DROP COLUMN "openPlan",
DROP COLUMN "pantry",
DROP COLUMN "utilityAccess",
DROP COLUMN "whiteGoods",
ADD COLUMN     "features" "public"."KitchenFeature"[];

-- AlterTable
ALTER TABLE "public"."Land" DROP COLUMN "orchard",
DROP COLUMN "outbuilding",
DROP COLUMN "paddock",
DROP COLUMN "pond",
DROP COLUMN "stables",
DROP COLUMN "tennisCourt",
DROP COLUMN "woodland",
ADD COLUMN     "features" "public"."LandFeature"[];

-- AlterTable
ALTER TABLE "public"."OtherRoom" DROP COLUMN "accousticPanels",
DROP COLUMN "balcony",
DROP COLUMN "barArea",
DROP COLUMN "bayWindow",
DROP COLUMN "builtInDesk",
DROP COLUMN "builtInShelving",
DROP COLUMN "builtInStorage",
DROP COLUMN "fireplace",
DROP COLUMN "hardwoodFlooring",
DROP COLUMN "hasView",
DROP COLUMN "openConcept",
DROP COLUMN "openPlan",
DROP COLUMN "patioDoors",
DROP COLUMN "servingHatch",
DROP COLUMN "soundProofing",
DROP COLUMN "stoneFlooring",
ADD COLUMN     "features" "public"."RoomFeature"[];

-- AlterTable
ALTER TABLE "public"."OutdoorSpace" DROP COLUMN "balcony",
DROP COLUMN "gardenOffice",
DROP COLUMN "patio",
DROP COLUMN "pool",
DROP COLUMN "separateParcel",
DROP COLUMN "shed",
DROP COLUMN "summerHouse",
DROP COLUMN "sunTerrace",
DROP COLUMN "terrace",
ADD COLUMN     "features" "public"."OutdoorSpaceFeature"[];

-- AlterTable
ALTER TABLE "public"."Parking" DROP COLUMN "allocatedParking",
DROP COLUMN "carport",
DROP COLUMN "driveway",
DROP COLUMN "evCharging",
DROP COLUMN "garage",
DROP COLUMN "noParking",
DROP COLUMN "onStreet",
DROP COLUMN "permitParking",
ADD COLUMN     "features" "public"."ParkingFeature"[];

-- AlterTable
ALTER TABLE "public"."Reception" DROP COLUMN "accousticPanels",
DROP COLUMN "balcony",
DROP COLUMN "barArea",
DROP COLUMN "bayWindow",
DROP COLUMN "builtInDesk",
DROP COLUMN "builtInShelving",
DROP COLUMN "builtInStorage",
DROP COLUMN "conservatory",
DROP COLUMN "fireplace",
DROP COLUMN "hardwoodFlooring",
DROP COLUMN "hasView",
DROP COLUMN "openConcept",
DROP COLUMN "openPlan",
DROP COLUMN "patioDoors",
DROP COLUMN "servingHatch",
DROP COLUMN "soundProofing",
DROP COLUMN "stoneFlooring",
ADD COLUMN     "features" "public"."RoomFeature"[];

-- AlterTable
ALTER TABLE "public"."Security" DROP COLUMN "alarmSystem",
DROP COLUMN "cctv",
DROP COLUMN "gatedCommunity",
DROP COLUMN "intercomSystem",
DROP COLUMN "neighborhoodWatch",
DROP COLUMN "reception",
DROP COLUMN "security",
ADD COLUMN     "features" "public"."SecurityFeature"[];

-- AlterTable
ALTER TABLE "public"."Storage" DROP COLUMN "attic",
DROP COLUMN "basement",
DROP COLUMN "separateDressing",
DROP COLUMN "underStairsStorage",
ADD COLUMN     "features" "public"."StorageFeature"[];

-- AlterTable
ALTER TABLE "public"."Utility" DROP COLUMN "plumbing",
DROP COLUMN "sink",
DROP COLUMN "storage",
ADD COLUMN     "features" "public"."UtilityFeature"[];

-- AlterTable
ALTER TABLE "public"."Yard" DROP COLUMN "balcony",
DROP COLUMN "gardenOffice",
DROP COLUMN "patio",
DROP COLUMN "pool",
DROP COLUMN "separateParcel",
DROP COLUMN "shed",
DROP COLUMN "summerHouse",
DROP COLUMN "sunTerrace",
DROP COLUMN "terrace",
ADD COLUMN     "features" "public"."OutdoorSpaceFeature"[];

-- DropEnum
DROP TYPE "public"."FireplaceType";
