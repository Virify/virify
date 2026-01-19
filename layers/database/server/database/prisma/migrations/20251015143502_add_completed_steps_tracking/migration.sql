-- AlterTable
ALTER TABLE "public"."DraftListing" ADD COLUMN     "completedSteps" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
