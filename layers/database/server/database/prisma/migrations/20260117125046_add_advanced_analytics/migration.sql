-- AlterTable
ALTER TABLE "ListingView" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "referrer" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "userAgent" TEXT;

-- CreateTable
CREATE TABLE "DailyListingStats" (
    "id" SERIAL NOT NULL,
    "listingId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "uniqueViews" INTEGER NOT NULL DEFAULT 0,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "favourites" INTEGER NOT NULL DEFAULT 0,
    "enquiries" INTEGER NOT NULL DEFAULT 0,
    "avgDuration" INTEGER,

    CONSTRAINT "DailyListingStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyUserStats" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "listingViews" INTEGER NOT NULL DEFAULT 0,
    "totalImpressions" INTEGER NOT NULL DEFAULT 0,
    "enquiriesReceived" INTEGER NOT NULL DEFAULT 0,
    "enquiriesSent" INTEGER NOT NULL DEFAULT 0,
    "favouritesReceived" INTEGER NOT NULL DEFAULT 0,
    "searchesPerformed" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DailyUserStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingImpression" (
    "id" SERIAL NOT NULL,
    "listingId" INTEGER NOT NULL,
    "userId" INTEGER,
    "sessionId" TEXT,
    "searchId" INTEGER,
    "position" INTEGER NOT NULL,
    "clicked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingImpression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingPriceHistory" (
    "id" SERIAL NOT NULL,
    "listingId" INTEGER NOT NULL,
    "oldPrice" DOUBLE PRECISION NOT NULL,
    "newPrice" DOUBLE PRECISION NOT NULL,
    "changePercent" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingPriceHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyListingStats_listingId_idx" ON "DailyListingStats"("listingId");

-- CreateIndex
CREATE INDEX "DailyListingStats_userId_idx" ON "DailyListingStats"("userId");

-- CreateIndex
CREATE INDEX "DailyListingStats_date_idx" ON "DailyListingStats"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyListingStats_listingId_date_key" ON "DailyListingStats"("listingId", "date");

-- CreateIndex
CREATE INDEX "DailyUserStats_userId_idx" ON "DailyUserStats"("userId");

-- CreateIndex
CREATE INDEX "DailyUserStats_date_idx" ON "DailyUserStats"("date");

-- CreateIndex
CREATE UNIQUE INDEX "DailyUserStats_userId_date_key" ON "DailyUserStats"("userId", "date");

-- CreateIndex
CREATE INDEX "ListingImpression_listingId_idx" ON "ListingImpression"("listingId");

-- CreateIndex
CREATE INDEX "ListingImpression_userId_idx" ON "ListingImpression"("userId");

-- CreateIndex
CREATE INDEX "ListingImpression_searchId_idx" ON "ListingImpression"("searchId");

-- CreateIndex
CREATE INDEX "ListingImpression_createdAt_idx" ON "ListingImpression"("createdAt");

-- CreateIndex
CREATE INDEX "ListingImpression_clicked_idx" ON "ListingImpression"("clicked");

-- CreateIndex
CREATE INDEX "ListingPriceHistory_listingId_idx" ON "ListingPriceHistory"("listingId");

-- CreateIndex
CREATE INDEX "ListingPriceHistory_createdAt_idx" ON "ListingPriceHistory"("createdAt");

-- CreateIndex
CREATE INDEX "ListingView_source_idx" ON "ListingView"("source");

-- AddForeignKey
ALTER TABLE "DailyListingStats" ADD CONSTRAINT "DailyListingStats_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyListingStats" ADD CONSTRAINT "DailyListingStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyUserStats" ADD CONSTRAINT "DailyUserStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingImpression" ADD CONSTRAINT "ListingImpression_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingImpression" ADD CONSTRAINT "ListingImpression_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingImpression" ADD CONSTRAINT "ListingImpression_searchId_fkey" FOREIGN KEY ("searchId") REFERENCES "TrackSearch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingPriceHistory" ADD CONSTRAINT "ListingPriceHistory_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
