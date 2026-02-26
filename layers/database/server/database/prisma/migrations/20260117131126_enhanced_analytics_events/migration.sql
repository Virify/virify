-- AlterTable
ALTER TABLE "ListingImpression" ADD COLUMN     "ip" TEXT,
ADD COLUMN     "searchQuery" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "userAgent" TEXT,
ALTER COLUMN "position" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ListingClick" (
    "id" SERIAL NOT NULL,
    "listingId" INTEGER NOT NULL,
    "userId" INTEGER,
    "sessionId" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "source" TEXT,
    "position" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingClick_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ListingShare" (
    "id" SERIAL NOT NULL,
    "listingId" INTEGER NOT NULL,
    "userId" INTEGER,
    "sessionId" TEXT,
    "ip" TEXT,
    "platform" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ListingClick_listingId_idx" ON "ListingClick"("listingId");

-- CreateIndex
CREATE INDEX "ListingClick_userId_idx" ON "ListingClick"("userId");

-- CreateIndex
CREATE INDEX "ListingClick_sessionId_idx" ON "ListingClick"("sessionId");

-- CreateIndex
CREATE INDEX "ListingClick_createdAt_idx" ON "ListingClick"("createdAt");

-- CreateIndex
CREATE INDEX "ListingClick_source_idx" ON "ListingClick"("source");

-- CreateIndex
CREATE INDEX "ListingShare_listingId_idx" ON "ListingShare"("listingId");

-- CreateIndex
CREATE INDEX "ListingShare_userId_idx" ON "ListingShare"("userId");

-- CreateIndex
CREATE INDEX "ListingShare_platform_idx" ON "ListingShare"("platform");

-- CreateIndex
CREATE INDEX "ListingShare_createdAt_idx" ON "ListingShare"("createdAt");

-- CreateIndex
CREATE INDEX "ListingImpression_sessionId_idx" ON "ListingImpression"("sessionId");

-- AddForeignKey
ALTER TABLE "ListingClick" ADD CONSTRAINT "ListingClick_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingClick" ADD CONSTRAINT "ListingClick_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingShare" ADD CONSTRAINT "ListingShare_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingShare" ADD CONSTRAINT "ListingShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
