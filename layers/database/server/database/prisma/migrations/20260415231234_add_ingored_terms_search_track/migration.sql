-- AlterTable
ALTER TABLE "TrackSearch" ADD COLUMN     "ignoredTerms" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "usedTerms" TEXT[] DEFAULT ARRAY[]::TEXT[];
