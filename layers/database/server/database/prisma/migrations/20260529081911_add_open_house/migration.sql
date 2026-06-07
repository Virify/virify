-- AlterTable
ALTER TABLE "Viewing" ADD COLUMN     "openHouseSessionId" INTEGER;

-- CreateTable
CREATE TABLE "OpenHouseSession" (
    "id" SERIAL NOT NULL,
    "listingId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "slotMins" INTEGER NOT NULL DEFAULT 15,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OpenHouseSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OpenHouseSession_listingId_idx" ON "OpenHouseSession"("listingId");

-- CreateIndex
CREATE INDEX "OpenHouseSession_date_idx" ON "OpenHouseSession"("date");

-- CreateIndex
CREATE INDEX "Viewing_openHouseSessionId_idx" ON "Viewing"("openHouseSessionId");

-- AddForeignKey
ALTER TABLE "OpenHouseSession" ADD CONSTRAINT "OpenHouseSession_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viewing" ADD CONSTRAINT "Viewing_openHouseSessionId_fkey" FOREIGN KEY ("openHouseSessionId") REFERENCES "OpenHouseSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;
