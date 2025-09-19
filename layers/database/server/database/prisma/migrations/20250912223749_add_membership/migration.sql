-- CreateEnum
CREATE TYPE "MembershipType" AS ENUM ('FREE', 'BASIC', 'FEATURED', 'PREMIUM', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "Membership" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "MembershipType" NOT NULL DEFAULT 'FREE',
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "autoRenew" BOOLEAN NOT NULL DEFAULT false,
    "cancellationDate" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "paymentMethod" TEXT,
    "lastPaymentDate" TIMESTAMP(3),
    "nextBillingDate" TIMESTAMP(3),
    "previousType" "MembershipType",
    "upgradeDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
