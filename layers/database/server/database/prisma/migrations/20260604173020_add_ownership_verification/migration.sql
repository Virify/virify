-- CreateEnum
CREATE TYPE "OwnershipVerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- CreateTable
CREATE TABLE "OwnershipVerification" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "docOneKey" TEXT NOT NULL,
    "docOneName" TEXT NOT NULL,
    "docTwoKey" TEXT NOT NULL,
    "docTwoName" TEXT NOT NULL,
    "status" "OwnershipVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewToken" TEXT NOT NULL,
    "reviewTokenExpiry" TIMESTAMP(3) NOT NULL DEFAULT NOW() + INTERVAL '30 days',
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnershipVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OwnershipVerification_userId_key" ON "OwnershipVerification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "OwnershipVerification_reviewToken_key" ON "OwnershipVerification"("reviewToken");

-- CreateIndex
CREATE INDEX "OwnershipVerification_userId_idx" ON "OwnershipVerification"("userId");

-- CreateIndex
CREATE INDEX "OwnershipVerification_reviewToken_idx" ON "OwnershipVerification"("reviewToken");

-- AddForeignKey
ALTER TABLE "OwnershipVerification" ADD CONSTRAINT "OwnershipVerification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
