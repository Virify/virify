-- CreateEnum
CREATE TYPE "ViewingStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'RESCHEDULED', 'CANCELLED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "NotificationType" ADD VALUE 'VIEWING_REQUEST';
ALTER TYPE "NotificationType" ADD VALUE 'VIEWING_ACCEPTED';
ALTER TYPE "NotificationType" ADD VALUE 'VIEWING_REJECTED';
ALTER TYPE "NotificationType" ADD VALUE 'VIEWING_RESCHEDULED';

-- CreateTable
CREATE TABLE "Viewing" (
    "id" SERIAL NOT NULL,
    "listingId" INTEGER NOT NULL,
    "requesterId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "conversationId" INTEGER,
    "proposedAt" TIMESTAMP(3) NOT NULL,
    "counterProposedAt" TIMESTAMP(3),
    "status" "ViewingStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Viewing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Viewing_listingId_idx" ON "Viewing"("listingId");

-- CreateIndex
CREATE INDEX "Viewing_requesterId_idx" ON "Viewing"("requesterId");

-- CreateIndex
CREATE INDEX "Viewing_ownerId_idx" ON "Viewing"("ownerId");

-- CreateIndex
CREATE INDEX "Viewing_conversationId_idx" ON "Viewing"("conversationId");

-- CreateIndex
CREATE INDEX "Viewing_status_idx" ON "Viewing"("status");

-- CreateIndex
CREATE INDEX "Viewing_proposedAt_idx" ON "Viewing"("proposedAt");

-- AddForeignKey
ALTER TABLE "Viewing" ADD CONSTRAINT "Viewing_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viewing" ADD CONSTRAINT "Viewing_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viewing" ADD CONSTRAINT "Viewing_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Viewing" ADD CONSTRAINT "Viewing_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
