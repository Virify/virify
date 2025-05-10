/*
  Warnings:

  - You are about to drop the `UserFavourites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ListingToUserFavourites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserFavourites" DROP CONSTRAINT "UserFavourites_userId_fkey";

-- DropForeignKey
ALTER TABLE "_ListingToUserFavourites" DROP CONSTRAINT "_ListingToUserFavourites_A_fkey";

-- DropForeignKey
ALTER TABLE "_ListingToUserFavourites" DROP CONSTRAINT "_ListingToUserFavourites_B_fkey";

-- DropTable
DROP TABLE "UserFavourites";

-- DropTable
DROP TABLE "_ListingToUserFavourites";

-- CreateTable
CREATE TABLE "HiddenListing" (
    "id" SERIAL NOT NULL,
    "userPreferencesId" INTEGER NOT NULL,
    "listingId" INTEGER NOT NULL,
    "reason" TEXT,
    "hiddenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HiddenListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedSearch" (
    "id" SERIAL NOT NULL,
    "userPreferencesId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFavouriteListing" (
    "id" SERIAL NOT NULL,
    "userPreferencesId" INTEGER NOT NULL,
    "listingId" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserFavouriteListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HiddenListing_userPreferencesId_listingId_key" ON "HiddenListing"("userPreferencesId", "listingId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavouriteListing_userPreferencesId_listingId_key" ON "UserFavouriteListing"("userPreferencesId", "listingId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- CreateIndex
CREATE INDEX "UserPreferences_userId_idx" ON "UserPreferences"("userId");

-- AddForeignKey
ALTER TABLE "HiddenListing" ADD CONSTRAINT "HiddenListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HiddenListing" ADD CONSTRAINT "HiddenListing_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSearch" ADD CONSTRAINT "SavedSearch_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavouriteListing" ADD CONSTRAINT "UserFavouriteListing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavouriteListing" ADD CONSTRAINT "UserFavouriteListing_userPreferencesId_fkey" FOREIGN KEY ("userPreferencesId") REFERENCES "UserPreferences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
